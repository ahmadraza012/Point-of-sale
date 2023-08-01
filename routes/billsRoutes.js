const express = require('express');
const {
  addBillsController,
  getBillsController,
  getBillByIdController,
  updateBillController,
  deleteBillController,
  getLatestBillByCustomerId,
} = require('../controllers/billsController');

const router = express.Router();

// POST: Create a new bill
router.post('/add-bills', addBillsController);

// GET: Get all bills
router.get('/get-bills', getBillsController);

// GET: Get a bill by ID
router.get('/get-bills/:id', getBillByIdController);

// PUT: Update a bill by ID
router.put('/update-bill/:id', updateBillController);

// DELETE: Delete a bill by ID
router.delete('/delete-bill/:id', deleteBillController);
router.get('/get-latest-bill/:customerId', getLatestBillByCustomerId);

module.exports = router;