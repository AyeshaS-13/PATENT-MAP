const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateReport = async (req, res, next) => {
  try {
    const { patentId, reportFormat } = req.body;
    const userId = req.user.userId;

    const patent = await prisma.patent.findUnique({
      where: { id: patentId },
      include: {
        domainAnalysis: true,
        cpcRecommendations: true,
        aiExplanations: true,
        priorArtQueries: true
      }
    });

    if (!patent) {
      return res.status(404).json({ success: false, error: { message: 'Patent record not found.' } });
    }

    const reportPayload = {
      reportId: `REP-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      patentTitle: patent.title,
      sourceType: patent.sourceType,
      domainClassification: patent.domainAnalysis ? {
        dominantDomain: patent.domainAnalysis.dominantDomain,
        percentage: patent.domainAnalysis.dominantPct,
        dependentDomains: JSON.parse(patent.domainAnalysis.dependentDomainsJson || '[]')
      } : null,
      topCPCRecommendations: patent.cpcRecommendations.map(c => ({
        code: c.cpcCode,
        description: c.description,
        confidence: c.confidence
      })),
      aiRationale: patent.aiExplanations[0] ? patent.aiExplanations[0].rationale : 'Assigned based on key feature extraction.',
      extractedSections: {
        abstract: patent.abstract,
        claims: patent.claims,
        description: patent.description
      }
    };

    const report = await prisma.report.create({
      data: {
        userId,
        patentId,
        title: `Patent Analysis Dossier - ${patent.title.substring(0, 40)}`,
        reportFormat: reportFormat || 'PDF',
        reportDataJson: JSON.stringify(reportPayload)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Report generated successfully.',
      data: {
        id: report.id,
        title: report.title,
        reportFormat: report.reportFormat,
        createdAt: report.createdAt,
        dossier: reportPayload
      }
    });
  } catch (err) {
    next(err);
  }
};

const getReportPreview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await prisma.report.findUnique({
      where: { id },
      include: { patent: true }
    });

    if (!report) {
      return res.status(404).json({ success: false, error: { message: 'Report not found.' } });
    }

    res.status(200).json({
      success: true,
      data: {
        reportId: report.id,
        title: report.title,
        format: report.reportFormat,
        createdAt: report.createdAt,
        data: JSON.parse(report.reportDataJson || '{}')
      }
    });
  } catch (err) {
    next(err);
  }
};

const listUserReports = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const reports = await prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateReport,
  getReportPreview,
  listUserReports
};
