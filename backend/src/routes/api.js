const express = require('express');
const multer = require('multer');

const { verifyToken } = require('../middleware/auth');
const authController = require('../controllers/authController');
const patentController = require('../controllers/patentController');
const searchController = require('../controllers/searchController');
const cpcController = require('../controllers/cpcController');
const reportController = require('../controllers/reportController');
const historyController = require('../controllers/historyController');

const router = express.Router();

// Multer in-memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB max file size
});

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'PATENT MAP Express Backend API', timestamp: new Date().toISOString() });
});

// --- AUTHENTICATION ROUTES ---
router.post('/auth/register', authController.register);
router.post('/auth/send-otp', authController.sendOTP);
router.post('/auth/verify-otp', authController.verifyOTP);
router.post('/auth/login', authController.login);
router.get('/auth/me', verifyToken, authController.me);
router.post('/auth/logout', verifyToken, authController.logout);

// --- PATENT UPLOADING & PROCESSING ROUTES ---
router.post('/patent/upload', verifyToken, upload.single('file'), patentController.uploadOrProcessPatent);
router.post('/patent/process-text', verifyToken, patentController.uploadOrProcessPatent);
router.get('/patent/list', verifyToken, patentController.listUserPatents);
router.get('/patent/detail/:id', verifyToken, patentController.getPatentDetails);

// --- SEARCH & PRIOR ART ROUTES ---
router.post('/search/generate-query', verifyToken, searchController.generateQuery);
router.post('/search/prior-art', verifyToken, searchController.searchPriorArt);
router.post('/search/compare', verifyToken, searchController.comparePatents);

// --- CPC EXPLORER ROUTES ---
router.get('/cpc/taxonomy', verifyToken, cpcController.getCPCTaxonomy);
router.get('/cpc/detail/:code', verifyToken, cpcController.getCPCDetail);

// --- REPORT ROUTES ---
router.post('/report/generate', verifyToken, reportController.generateReport);
router.get('/report/preview/:id', verifyToken, reportController.getReportPreview);
router.get('/report/list', verifyToken, reportController.listUserReports);

// --- HISTORY & SAVED ROUTES ---
router.post('/history/save-patent', verifyToken, historyController.savePatent);
router.get('/history/saved-patents', verifyToken, historyController.getSavedPatents);
router.post('/history/save-search', verifyToken, historyController.saveSearch);
router.get('/history/saved-searches', verifyToken, historyController.getSavedSearches);

module.exports = router;
