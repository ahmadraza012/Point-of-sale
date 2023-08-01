// const Bills = require("../models/billsModel");
const billsModel = require("../models/billsModel");
const Items = require("../models/itemModel");

// add Bills
// const addBillsController = async (req, res) => {
//   try{
//     const newBill = new billsModel(req.body)
//     await newBill.save()
//     res.send("Bill created Successfully!")
//   } catch (error) {
//    res.send("Something went wrong")
//    console.log(error)
//   }
// }
const addBillsController = async (req, res) => {
  try {
    const newBillData = req.body;
    const { customerId } = newBillData;
    console.log(newBillData, "Bills Data", customerId)
    // Calculate remaining payment


    if (customerId) {
      // If customerId is provided, update the existing customer's bill

      // Find the latest bill for the customer from the frontend
      const latestBillForCustomer = await billsModel.findOne({ _id: customerId }).sort({ date: -1 });

      console.log(latestBillForCustomer, "Customer found!")

      // Update the bill data with the latest customer data
      // latestBillForCustomer.customerName = newBillData.customerName;
      // latestBillForCustomer.customerNumber = newBillData.customerNumber;
      latestBillForCustomer.paymentMode = newBillData.paymentMode;
      latestBillForCustomer.totalAmount = newBillData.totalAmount;
      latestBillForCustomer.subTotal = newBillData.subTotal;
      latestBillForCustomer.paidPayment = newBillData.paidPayment;
      latestBillForCustomer.remainingPayment = newBillData.remainingPayment;
      latestBillForCustomer.cartItems = newBillData.cartItems;

      // Save the updated bill
      await latestBillForCustomer.save();
      const items = req.body.cartItems;

      // Assuming items are included in the request body
      for (const item of items) {
        const itemId = item._id; // Assuming each item has an "itemId" property
  
        // Find the item in the database
        // console.log(foundItem)
        const foundItem = await Items.findById(itemId);
        if (foundItem) {
          // Decrease the quantity based on the purchased quantity
          foundItem.quantity -= item.singleQuantity;
          foundItem.CartoonsQuantity -= item.cartoonsQuantity;
  
          // Save the updated item
          await foundItem.save();
        }
      }
  

      res.send("Bill updated successfully!");
    } else {
      // If customerId is not provided, it's a new customer, so create a new bill

      // Calculate remaining payment
      newBillData.remainingPayment = newBillData.totalAmount - newBillData.paidPayment;

      const newBill = new billsModel(newBillData);
      await newBill.save();
      const items = req.body.cartItems;

      // Assuming items are included in the request body
      for (const item of items) {
        const itemId = item._id; // Assuming each item has an "itemId" property
  
        // Find the item in the database
        // console.log(foundItem)
        const foundItem = await Items.findById(itemId);
        if (foundItem) {
          // Decrease the quantity based on the purchased quantity
          foundItem.quantity -= item.singleQuantity;
          foundItem.CartoonsQuantity -= item.cartoonsQuantity;
  
          // Save the updated item
          await foundItem.save();
        }
      }
  
      res.send("Bill created successfully!");
    }
    // newBillData.remainingPayment = newBillData.totalAmount - newBillData.paidPayment;

    // const newBill = new billsModel(newBillData);
    // await newBill.save();

    // Decrease item quantities
 
    // res.send("Bill created successfully!");
  } catch (error) {
    res.send("Something went wrong");
    console.log(error);
  }
};
// get bills
const getBillsController = async (req, res) => {
  try {
    const bills = await billsModel.find();
    res.send(bills);
  } catch (error) {
    console.log(error);
  }
};
const getBillByIdController = async (req, res) => {
  try {
    console.log(req.params.id)
    const billId = req.params.id;
    const bill = await billsModel.findById(billId);
    if (bill) {
      res.send(bill);
    } else {
      res.status(404).send("Bill not found");
    }
  } catch (error) {
    res.status(500).send("Error fetching bill");
    console.log(error);
  }
};
const updateBillController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBillData = req.body;

    // Fetch the bill by ID
    const existingBill = await Bills.findById(id);
    if (!existingBill) {
      return res.status(404).send("Bill not found.");
    }

    // Fetch the latest bill for the customer from the frontend
    const { customerId } = updatedBillData;
    const latestBillForCustomer = await Bills.findOne({ customerId }).sort({ date: -1 });

    // Update the bill data with the latest customer data
    existingBill.customerName = latestBillForCustomer.customerName;
    existingBill.customerNumber = latestBillForCustomer.customerNumber;
    // Update other properties as required based on your frontend form data
    existingBill.paymentMode = updatedBillData.paymentMode;
    existingBill.totalAmount = updatedBillData.totalAmount;
    existingBill.subTotal = updatedBillData.subTotal;
    existingBill.paidPayment = updatedBillData.paidPayment;
    existingBill.remainingPayment = updatedBillData.remainingPayment;
    existingBill.cartItems = updatedBillData.cartItems;

    // Save the updated bill
    await existingBill.save();

    res.send("Bill updated successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong while updating the bill.");
  }
};
const deleteBillController = async (req, res) => {
  try {
    const billId = req.params.id;
    const deletedBill = await billsModel.findByIdAndRemove(billId);

    if (deletedBill) {
      res.send(deletedBill);
    } else {
      res.status(404).send("Bill not found");
    }
  } catch (error) {
    res.status(500).send("Error deleting bill");
    console.log(error);
  }
};
const getLatestBillByCustomerId = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    
    // Assuming you have a field named "customerId" in the Bills schema
    // Sort the bills by the "date" field in descending order to get the latest bill first
    const latestBill = await Bills.findOne({ customerId }).sort({ date: -1 });

    if (!latestBill) {
      return res.status(404).json({ message: "Latest bill not found for the given customer" });
    }

    res.json(latestBill);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addBillsController, getBillsController, getBillByIdController, updateBillController, deleteBillController, getLatestBillByCustomerId };
