const { PrismaClient } = require('@prisma/client');
const aiService = require('../services/aiService');

const prisma = new PrismaClient();

const generateQuery = async (req, res, next) => {
  try {
    const { title, abstract, claims, cpcCodes } = req.body;
    const result = await aiService.generateQueries(title || '', abstract || '', claims || '', cpcCodes || []);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const searchPriorArt = async (req, res, next) => {
  try {
    const { queryText, patentId } = req.body;
    let searchText = queryText;

    if (!searchText && patentId) {
      const pat = await prisma.patent.findUnique({ where: { id: patentId } });
      if (pat) {
        searchText = `${pat.title} ${pat.abstract} ${pat.claims}`;
      }
    }

    if (!searchText || !searchText.trim()) {
      searchText = 'neural network machine learning classification';
    }

    const results = await aiService.searchPriorArt(searchText);
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (err) {
    next(err);
  }
};

const comparePatents = async (req, res, next) => {
  try {
    const { sourceText, patentId, targetPatentId } = req.body;
    let source = sourceText;

    if (!source && patentId) {
      const pat = await prisma.patent.findUnique({ where: { id: patentId } });
      if (pat) {
        source = `${pat.title} ${pat.abstract} ${pat.claims}`;
      }
    }

    if (!source || !source.trim()) {
      source = 'A system for deep learning neural network classification comprising multi-task attention.';
    }

    const comparison = await aiService.comparePatents(source, targetPatentId || 'US11847520B2');
    res.status(200).json({ success: true, data: comparison });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateQuery,
  searchPriorArt,
  comparePatents
};
