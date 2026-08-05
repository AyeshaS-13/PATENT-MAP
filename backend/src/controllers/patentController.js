const { PrismaClient } = require('@prisma/client');
const aiService = require('../services/aiService');
const axios = require('axios');

const prisma = new PrismaClient();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

const uploadOrProcessPatent = async (req, res, next) => {
  try {
    const { text, fileUrl } = req.body;
    const userId = req.user.userId;

    let extraction = null;
    let rawTextForAI = "";

    // If PDF file buffer uploaded via multipart/form-data
    if (req.file) {
      if (!req.file.originalname.match(/\.(pdf|txt)$/i)) {
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid file format. Only PDF (.pdf) and Text (.txt) documents are supported.' }
        });
      }

      if (req.file.originalname.toLowerCase().endsWith('.pdf')) {
        // Send raw PDF bytes directly to FastAPI /extract-pdf microservice
        try {
          const FormData = require('form-data');
          const form = new FormData();
          form.append('file', req.file.buffer, { filename: req.file.originalname, contentType: 'application/pdf' });

          const aiResp = await axios.post(`${AI_SERVICE_URL}/extract-pdf`, form, {
            headers: form.getHeaders()
          });
          extraction = aiResp.data.data;
        } catch (err) {
          // Fallback if pdf parser fails or fallback to buffer string cleaning
          const rawBufferStr = req.file.buffer.toString('utf-8');
          extraction = await aiService.extractContent(rawBufferStr);
        }
      } else {
        // TXT document file
        const txtContent = req.file.buffer.toString('utf-8');
        extraction = await aiService.extractContent(txtContent);
      }
    } else if (text && text.trim()) {
      extraction = await aiService.extractContent(text);
    } else {
      return res.status(400).json({
        success: false,
        error: { message: 'Patent document content cannot be empty. Please upload a PDF or enter patent text.' }
      });
    }

    rawTextForAI = `${extraction.title}\n\n${extraction.abstract}\n\n${extraction.claims}\n\n${extraction.description}`;

    // 2. Domain Detection on Clean Extracted Text
    const domainData = await aiService.detectDomains(rawTextForAI);

    // 3. CPC Recommendation on Clean Extracted Text
    const cpcRecommendations = await aiService.recommendCPC(rawTextForAI);

    // 4. Primary CPC AI Explanation
    const topCpc = cpcRecommendations[0] || { cpc_code: 'G06F 18/20', description: 'Pattern recognition' };
    const aiExplanation = await aiService.explainAI(rawTextForAI, topCpc.cpc_code, topCpc.description);

    // 5. Search Query Generation
    const cpcCodesList = cpcRecommendations.map(c => c.cpc_code);
    const queryData = await aiService.generateQueries(extraction.title, extraction.abstract, extraction.claims, cpcCodesList);

    // Save Record to Relational Database
    const patent = await prisma.patent.create({
      data: {
        userId,
        title: extraction.title || 'Untitled Patent Document',
        abstract: extraction.abstract || 'Patent Abstract',
        claims: extraction.claims || 'Claim 1. A system...',
        description: extraction.description || 'Detailed Description',
        fileUrl: fileUrl || (req.file ? req.file.originalname : null),
        sourceType: req.file ? 'PDF' : 'TEXT',
        status: 'PROCESSED'
      }
    });

    // Save Domain Analysis
    await prisma.domainAnalysis.create({
      data: {
        patentId: patent.id,
        dominantDomain: domainData.dominant_domain.name,
        dominantPct: domainData.dominant_domain.percentage,
        dependentDomainsJson: JSON.stringify(domainData.dependent_domains)
      }
    });

    // Save CPC Recommendations
    for (const rec of cpcRecommendations) {
      await prisma.cPCRecommendation.create({
        data: {
          patentId: patent.id,
          cpcCode: rec.cpc_code,
          description: rec.description,
          section: rec.section || 'G',
          subclass: rec.subclass || 'G06F',
          confidence: rec.confidence
        }
      });
    }

    // Save AI Explanation
    await prisma.aIExplanation.create({
      data: {
        patentId: patent.id,
        cpcCode: aiExplanation.cpc_code,
        rationale: aiExplanation.rationale,
        featureImportanceJson: JSON.stringify(aiExplanation.feature_importance),
        textHighlightsJson: JSON.stringify(aiExplanation.text_highlights),
        confidenceScore: aiExplanation.model_confidence_score || 0.95
      }
    });

    // Save Prior Art Queries
    await prisma.priorArtQuery.create({
      data: {
        patentId: patent.id,
        usptoQuery: queryData.uspto_syntax_query,
        epoQuery: queryData.epo_espacenet_syntax,
        broadQuery: queryData.broad_patent_query,
        keywordsJson: JSON.stringify(queryData.extracted_keywords)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Patent PDF processed, extracted, and classified successfully.',
      data: {
        patentId: patent.id,
        extraction,
        domainData,
        cpcRecommendations,
        aiExplanation,
        queryData
      }
    });
  } catch (err) {
    next(err);
  }
};

const getPatentDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patent = await prisma.patent.findUnique({
      where: { id },
      include: {
        domainAnalysis: true,
        cpcRecommendations: true,
        aiExplanations: true,
        priorArtQueries: true
      }
    });

    if (!patent) {
      return res.status(404).json({
        success: false,
        error: { message: 'Patent record not found.' }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        patent,
        domainAnalysis: patent.domainAnalysis ? {
          ...patent.domainAnalysis,
          dependentDomains: JSON.parse(patent.domainAnalysis.dependentDomainsJson || '[]')
        } : null,
        cpcRecommendations: patent.cpcRecommendations,
        aiExplanation: patent.aiExplanations[0] ? {
          ...patent.aiExplanations[0],
          featureImportance: JSON.parse(patent.aiExplanations[0].featureImportanceJson || '[]'),
          textHighlights: JSON.parse(patent.aiExplanations[0].textHighlightsJson || '[]')
        } : null,
        priorArtQuery: patent.priorArtQueries[0] ? {
          ...patent.priorArtQueries[0],
          keywords: JSON.parse(patent.priorArtQueries[0].keywordsJson || '[]')
        } : null
      }
    });
  } catch (err) {
    next(err);
  }
};

const listUserPatents = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const patents = await prisma.patent.findMany({
      where: { userId },
      include: {
        domainAnalysis: true,
        cpcRecommendations: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      count: patents.length,
      data: patents
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadOrProcessPatent,
  getPatentDetails,
  listUserPatents
};
