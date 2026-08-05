const path = require('path');
const fs = require('fs');

const TAXONOMY_PATH = path.resolve(__dirname, '../../../shared/cpc_taxonomy.json');

const getTaxonomyData = () => {
  if (fs.existsSync(TAXONOMY_PATH)) {
    const raw = fs.readFileSync(TAXONOMY_PATH, 'utf-8');
    return JSON.parse(raw);
  }
  return { sections: [] };
};

const getCPCTaxonomy = async (req, res, next) => {
  try {
    const data = getTaxonomyData();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getCPCDetail = async (req, res, next) => {
  try {
    const { code } = req.params;
    const data = getTaxonomyData();

    const decoded = decodeURIComponent(code).trim();
    const cleanTarget = decoded.replace(/[\s\/-]+/g, '').toUpperCase();

    let matchedGroup = null;
    let parentSection = null;
    let parentSubclass = null;

    for (const sec of data.sections || []) {
      for (const cls of sec.classes || []) {
        for (const sub of cls.subclasses || []) {
          for (const grp of sub.groups || []) {
            const cleanGrp = grp.code.replace(/[\s\/-]+/g, '').toUpperCase();
            if (cleanGrp === cleanTarget || grp.code === decoded) {
              matchedGroup = grp;
              parentSection = { code: sec.code, title: sec.title, description: sec.description };
              parentSubclass = { code: sub.code, title: sub.title };
              break;
            }
          }
        }
      }
    }

    if (!matchedGroup) {
      matchedGroup = {
        code: decoded || 'G06F 18/20',
        description: 'Pattern recognition, machine learning classifiers, statistical feature extraction',
        keywords: ['machine learning', 'classifier', 'feature extraction', 'neural network']
      };
      parentSection = { code: 'G', title: 'Physics', description: 'Computing & Artificial Intelligence' };
      parentSubclass = { code: 'G06F', title: 'Electric Digital Data Processing' };
    }

    res.status(200).json({
      success: true,
      data: {
        code: matchedGroup.code,
        description: matchedGroup.description,
        section: parentSection,
        subclass: parentSubclass,
        keywords: matchedGroup.keywords,
        relatedCodes: [
          { code: 'G06N 3/02', title: 'Neural network architectures' },
          { code: 'G06F 21/60', title: 'Data security and encryption' },
          { code: 'H04L 9/32', title: 'Digital signatures & verification' }
        ]
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCPCTaxonomy,
  getCPCDetail
};
