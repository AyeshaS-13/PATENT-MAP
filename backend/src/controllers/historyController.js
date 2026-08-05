const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const savePatent = async (req, res, next) => {
  try {
    const { patentId, notes } = req.body;
    const userId = req.user.userId;

    const saved = await prisma.savedPatent.upsert({
      where: {
        userId_patentId: { userId, patentId }
      },
      update: { notes },
      create: { userId, patentId, notes }
    });

    res.status(200).json({ success: true, message: 'Patent bookmark saved.', data: saved });
  } catch (err) {
    next(err);
  }
};

const getSavedPatents = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const items = await prisma.savedPatent.findMany({
      where: { userId },
      include: {
        patent: {
          include: { domainAnalysis: true, cpcRecommendations: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};

const saveSearch = async (req, res, next) => {
  try {
    const { queryTitle, queryText, filters } = req.body;
    const userId = req.user.userId;

    const saved = await prisma.savedSearch.create({
      data: {
        userId,
        queryTitle: queryTitle || 'Saved Prior Art Query',
        queryText: queryText || '',
        filtersJson: JSON.stringify(filters || {})
      }
    });

    res.status(201).json({ success: true, message: 'Search query saved.', data: saved });
  } catch (err) {
    next(err);
  }
};

const getSavedSearches = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const items = await prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  savePatent,
  getSavedPatents,
  saveSearch,
  getSavedSearches
};
