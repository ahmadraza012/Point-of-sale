const express = require('express')
const { getItemController, addItemController, editItemController, deleteItemController } = require('./../controllers/itemController')

const router = express.Router()

// method.get
router.get('/get-item',  getItemController);

// method.post 
router.post('/add-item', addItemController)

// method put
router.put('/edit-item', editItemController)

// method delete
router.post('/delete-item', deleteItemController)

module.exports = router