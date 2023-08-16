const express = require('express');
const {
  addBillsController,
  getBillsController,
  getLatestBills,
  getLatest,
} = require('../controllers/billsController');

const router = express.Router();
router.post('/add-bills', addBillsController);
router.get('/get-bills', getBillsController);
router.get('/get-latest-bills', getLatestBills);
router.get('/get-latest', getLatest);


module.exports = router;

