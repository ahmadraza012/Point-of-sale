const billsModel = require("../models/billsModel");
const Items = require("../models/itemModel");

// const addBillsController = async (req, res) => {
//   try {
//     const newBillData = req.body;
//     const { customerId } = newBillData;
//     console.log(newBillData, "Bills Data", customerId)
//     if (customerId) {
//       const latestBillForCustomer = await billsModel.findOne({ _id: customerId }).sort({ date: -1 });

//       console.log(latestBillForCustomer, "Customer found!")
//       latestBillForCustomer.paymentMode = newBillData.paymentMode;
//       latestBillForCustomer.totalAmount = newBillData.totalAmount;
//       latestBillForCustomer.subTotal = newBillData.subTotal;
//       latestBillForCustomer.paidPayment = newBillData.paidPayment;
//       latestBillForCustomer.remainingPayment = newBillData.remainingPayment;
//       latestBillForCustomer.cartItems = newBillData.cartItems;

//       await latestBillForCustomer.save();
//       const items = req.body.cartItems;

//       for (const item of items) {
//         const itemId = item._id; 
  
//         const foundItem = await Items.findById(itemId);
//         if (foundItem) {
//           foundItem.quantity -= item.singleQuantity;
//           foundItem.CartoonsQuantity -= item.cartoonsQuantity;  
//           await foundItem.save();
//         }
//       }
  

//       res.send("Bill updated successfully!");
//     } else {

//       newBillData.remainingPayment = newBillData.totalAmount - newBillData.paidPayment;
//       const newBill = new billsModel(newBillData);
//       await newBill.save();
//       const items = req.body.cartItems;

//       for (const item of items) {
//         const itemId = item._id; 
//         const foundItem = await Items.findById(itemId);
//         if (foundItem) {
//           foundItem.quantity -= item.singleQuantity;
//           foundItem.CartoonsQuantity -= item.cartoonsQuantity;
//           await foundItem.save();
//         }
//       }
  
//       res.send("Bill created successfully!");
//     }
//   } catch (error) {
//     res.send("Something went wrong");
//     console.log(error);
//   }
// };
const addBillsController = async (req, res) => {
  try {
    const newBillData = req.body;
    const newBill = new billsModel(newBillData);
    await newBill.save();

    const items = req.body.cartItems;
    for (const item of items) {
      const itemId = item._id;
      const foundItem = await Items.findById(itemId);
      if (foundItem) {
        foundItem.quantity -= item.singleQuantity;
        foundItem.CartoonsQuantity -= item.cartoonsQuantity;
        await foundItem.save();
      }
    }

    res.send("Bill created successfully!");
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


const getLatestBills = async (req, res) => {
  try {
    const latestBills = await billsModel.aggregate([
      {
        $sort: { date: -1 } // Sort bills by date in descending order
      },
      {
        $group: {
          _id: "$customerName",
          latestBill: { $last: "$$ROOT" } // Get the first bill (latest) for each customer
        }
      }
    ]);
    res.json(latestBills.map(bill => bill.latestBill));
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}
const getLatest = async (req, res) => {
  try {
    const latestBills = await billsModel.aggregate([
      {
        $sort: { createdAt: -1 } // Sort bills by date in descending order
      },
      {
        $group: {
          _id: "$customerName",
          bills: { $push: "$$ROOT" } // Push all bills into the "bills" array
        }
      },
      {
        $project: {
          _id: 1,
          bills: {
            $reverseArray: "$bills" // Reverse the array to have bills newest to oldest
          }
        }
      }
    ]);
    res.json(latestBills);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = { addBillsController, getBillsController, getLatestBills, getLatest};

