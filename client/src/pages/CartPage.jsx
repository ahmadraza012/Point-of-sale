import React, { useEffect, useState } from 'react'
import DefaultLayout from '../components/DefaultLayout'
import { useSelector, useDispatch } from 'react-redux'
import { DeleteOutlined, FlagFilled, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Select, Table, message } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CartPage = () => {
    const [total, setTotal] = useState({
        grandTotal: 0,
        subTotal: 0,
        remainingBlance: 0
    })

    const [billPopup, setBillPopup] = useState(false);
    const [records, setRecords] = useState([]);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form] = Form.useForm()

    const handleIncrement = (record, type) => {



        if (type === "single") {

            dispatch({
                type: "UPDATE_CART",
                payload: { ...record, singleQuantity: record.singleQuantity + 1 }
            })
        }
        else if (type === "cartoons") {

            dispatch({
                type: "UPDATE_CARTOONS",
                payload: { ...record, cartoonsQuantity: record.cartoonsQuantity + 1 }
            })

        }
    }
    const handleDecrement = (record, type) => {
        if (type === "single") {

            if (record.singleQuantity !== 0) {
                dispatch({
                    type: "UPDATE_CART",
                    payload: { ...record, singleQuantity: record.singleQuantity - 1 }
                })
            }


        }

        else if (type === "cartoons") {
            if (record.cartoonsQuantity !== 0) {
                dispatch({
                    type: "UPDATE_CARTOONS",
                    payload: { ...record, cartoonsQuantity: record.cartoonsQuantity - 1 }
                })
            }

        }


    }
    const { cartItems } = useSelector(state => state.rootReducer)

    console.log(cartItems)
    const columns = [
        {
            title: "Name",
            dataIndex: "name"
        },
        {
            title: "Image",
            dataIndex: "image",
            render: (image, record) => <img src={image} height={40} width={40} />
        },
        {
            title: "Cartoons Quantity",
            dataIndex: "_id",
            render: (id, record) => <div>
                <PlusCircleOutlined className='mx-3' onClick={() => handleIncrement(record, "cartoons")} />
                <b>{record.cartoonsQuantity}</b>
                <MinusCircleOutlined className='mx-3' onClick={() => handleDecrement(record, "cartoons")} />
            </div>
        },
        {
            title: "Price Cartoons",
            dataIndex: "_id",
            render: (id, record) => (
              <Input
                value={record.priceCartoons}
                onChange={(e) => handlePriceChange(record, e.target.value, "cartoons")}
              />
            ),
          },
        {
            title: "Single Quantity",
            dataIndex: "_id",
            render: (id, record) => <div>
                <PlusCircleOutlined className='mx-3' onClick={() => handleIncrement(record, "single")} />
                <b>{record.singleQuantity}</b>
                <MinusCircleOutlined className='mx-3' onClick={() => handleDecrement(record, "single")} />
            </div>
        },
        {
            title: "Price Single Piece",
            dataIndex: "_id",
            render: (id, record) => (
              <Input
                value={record.priceSingle}
                onChange={(e) => handlePriceChange(record, e.target.value, "single")}
              />
            ),
          },
          {
            title: "Discount",
            dataIndex: "_id",
            render: (id, record) => (
              <Input
                value={record.discount}
                onChange={(e) => handleDiscountChange(record, e.target.value)}
              />
            ),
        },
        {
            title: "Actions",
            dataIndex: "_id",
            render: (id, record) => <DeleteOutlined onClick={() => dispatch({
                type: "DELETE_FROM_CART",
                payload: record
            })} />
        },
    ];
    const [selectedCustomer, setSelectedCustomer] = useState(false);

    
    const handlePriceChange = (item, value, type) => {

        const updatedCartItems = cartItems.map((data) =>
        data._id === item._id
            ? { ...data, [type === "single" ? "priceSingle" : "priceCartoons"]: value }
            : data
        );

        console.log("updated", updatedCartItems)
        dispatch({ type: "UPDATE_CART_ITEMS", payload: updatedCartItems });
     
      };
      const handleDiscountChange = (item, value) => {
        const updatedCartItems = cartItems.map((data) =>
            data._id === item._id ? { ...data, discount: parseFloat(value) || 0 } : data
        );
        dispatch({ type: "UPDATE_CART_ITEMS", payload: updatedCartItems });
    };

    const [customerData, setCustomerData] = useState({});
  
    const handleSearch = (e) => {
        const searchValue = e.target.value;
        const arr = records.find((item) => item.customerName.includes(searchValue));

        if (arr) {
            setSelectedCustomer(arr.customerName);
            setCustomerData(arr);
            form.setFieldsValue({ ...form.getFieldsValue(), customerName: searchValue, customerNumber: arr.customerNumber });
        } else {
            setSelectedCustomer(null);
            setCustomerData({}); // Reset customerData to empty when no customer is selected
            form.setFieldsValue({ ...form.getFieldsValue(), customerName: "", customerNumber: "" });
        }
    };

    const getRecords = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/bills/get-latest-bills');
            setRecords(response?.data);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        let temp = 0;
        cartItems.forEach(item => {
          temp = temp + (
              (item.priceSingle * item.singleQuantity) + 
              ((item.priceCartoons * item.cartoonsQuantity) - 
              (((item.priceCartoons * item.cartoonsQuantity) / 100) * item.discount).toFixed(2))
          );
        });
    
        setTotal({ ...total, subTotal: temp });
        getRecords();
    }, [cartItems]);
  console.log(records, "records")

    const handleSubmit = async (value) => {
        console.log(value) // customerName and customerNumber is not present here
        try {
            const newObject = {
                ...value,
                cartItems: cartItems.map(item => ({
                    ...item,
                    price: item.price,
                    priceCartoons: item.priceCartoons
                  })),
                subTotal: selectedCustomer ? total.subTotal + customerData.remainingPayment : total.subTotal,
                remainingPayment: Number(total.remainingBlance),
                paidPayment: document.getElementById('paidInput').value,
                totalAmount: selectedCustomer ? total.subTotal + customerData.remainingPayment : total.subTotal,
                customerId: selectedCustomer ? customerData._id : null
            }
            if (selectedCustomer) {
                newObject.customerId = customerData._id;
            }

            console.log(newObject, customerData._id)

            await axios.post('http://localhost:8080/api/bills/add-bills', newObject)
            message.success("Bill Generated")
            navigate('/bills', {
                state: {
                    customerId: selectedCustomer ? customerData._id : null,
                    remainingPayment: total.remainingBlance,
                    subTotal: selectedCustomer ? total.subTotal + customerData.remainingPayment : total.subTotal,

                },
            })
        } catch (error) {
            message.error("Something went wrong")
            console.log(error)
        }

    }


    const onDiscountChange = (value) => {
        console.log(value)
        if (selectedCustomer === false) {
            const rBalance = total.subTotal - value
            console.log(rBalance)
            setTotal({ ...total, remainingBlance: rBalance })
        } else {
            const rBalance = (total.subTotal + customerData?.remainingPayment) - value
            setTotal({ ...total, remainingBlance: rBalance })
            // console.log(setTotal)
        }
    }
    


    useEffect(() => {
        const selectedRecord = records.find((item) => item.customerName === selectedCustomer);
        setCustomerData(selectedRecord || {});

    }, [selectedCustomer, records]);




    return (
        <DefaultLayout>
            <h1>CartPage</h1>
            <Table columns={columns} dataSource={cartItems} bordered />
            <div className="d-flex flex-column align-items-end">
                <hr />
                <h3>Sub total: <b>{total.subTotal}</b></h3>
                <Button type='primary' onClick={() => setBillPopup(true)}>Create Invoice</Button>
            </div>
            <Modal open={billPopup} title="Create Invoice" onCancel={() => setBillPopup(false)} footer={false}>
                <select value={selectedCustomer} onChange={(e) => handleSearch(e)}>
                    <option value="">All Customers</option>
                    {records.map((item) => (
                        <option key={item.customerId} value={item.customerName}>
                            {item.customerName}
                        </option>
                    ))}
                </select>

                <Form form={form} layout='vertical' onFinish={handleSubmit}>

                    {selectedCustomer &&
                        <>
                            {/* <input type="text" name='customerName' value={customerData?.customerName} />
                            <input type="text" name='customerNumber' value={customerData?.customerNumber} /> */}
                            <Form.Item name="customerName" label="Customer Name">

                                <Input value={customerData.customerName} />
                            </Form.Item>
                            <Form.Item name="customerNumber" label="Contact Number">
                                <Input value={customerData?.customerNumber} />
                            </Form.Item>
                        </>
                    }

                    {!selectedCustomer &&
                        <>

                            <Form.Item name="customerName" label="Customer Name">
                                <Input />
                            </Form.Item>
                            <Form.Item name="customerNumber" label="Contact Number">
                                <Input />
                            </Form.Item>
                        </>
                    }

                    <Form.Item name="paymentMode" label="Payment Method">
                        <Select>
                            <Select.Option value="cash">Cash</Select.Option>
                            <Select.Option value="card">Card</Select.Option>
                        </Select>
                    </Form.Item>

                    <div className="bill-item">
                        <h5>
                            Sub Total : <b>{total.subTotal}</b>
                        </h5>
                        {/* <h4>
                            Tax : <b>{((total / 100) * 10).toFixed(2)}</b>
                        </h4> */}
                        {/* <h4>
                            Discount : <input type="number" name='discount' id='discountInput' placeholder='Add' onChange={(e) => {onDiscountChange(e.target.value)}} />
                        </h4> */}
                        <h3>
                            Grand Total = <b>{Number(total.subTotal)}</b>
                        </h3>
                        {!selectedCustomer && <h4>
                            Paid Amount : <input type="number" name='paidAmount' id='paidInput' placeholder='add' onChange={(e) => { onDiscountChange(e.target.value) }} />
                        </h4>}

                        {selectedCustomer &&
                            <>
                                <h3>
                                    Prvious Payment = <b>{customerData?.remainingPayment}</b>
                                </h3>
                                <h3>
                                    TotalAmount = <b>{total.subTotal + customerData?.remainingPayment}</b>
                                </h3>
                                <h4>
                                    Paid Amount : <input type="number" name='paidAmount' id='paidInput' placeholder='add' onChange={(e) => { onDiscountChange(e.target.value) }} />
                                </h4>
                            </>}

                        <h3>
                            Remaining Balance = <b>{Number(total?.remainingBlance)}</b>
                        </h3>

                    </div>

                    <div className="d-flex justify-content-end">
                        <Button type='primary' htmlType='submit'>Generate Bill</Button>
                    </div>
                </Form>


            </Modal>
        </DefaultLayout>
    )
}

export default CartPage