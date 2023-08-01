import React, { useEffect, useState, useRef } from 'react'
import DefaultLayout from '../components/DefaultLayout'
import { Button, Form, Input, Modal, Select, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import ReactToPrint from 'react-to-print';
import { useReactToPrint } from 'react-to-print';

const BillsPage = () => {
    const componentRef = useRef();
    const dispatch = useDispatch()
    const [billsData, setBillsData] = useState([])
    const [popModal, setPopModal] = useState(false)
    const [selectedBill, setSelectedBill] = useState(null)
    const getAllBills = async () => {
        try {
            dispatch({
                type: "SHOW_LOADING"
            })
            const { data } = await axios.get('http://localhost:8080/api/bills/get-bills')
            setBillsData(data)
            dispatch({
                type: "HIDE_LOADING"
            })
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {

        getAllBills()
    }, [])


    const columns = [
        {
            title: "ID",
            dataIndex: "_id"
        },
        {
            title: "Customer Name",
            dataIndex: "customerName",
        },
        {
            title: "Contact Number",
            dataIndex: "customerNumber"
        },
        {
            title: "Total Amount",
            dataIndex: "subTotal"
        },
        {
            title: "Paid Amount",
            dataIndex: "paidPayment"
        },
        {
            title: "Remaining Payment",
            dataIndex: "remainingPayment"
        },

        // {
        //     title: "Tax",
        //     dataIndex: "tax"
        // },
        // {
        //     title: "Discount",
        //     dataIndex: "discount"
        // },
        {
            title: "Total Amount",
            dataIndex: "totalAmount"
        },
        {
            title: "Actions",
            dataIndex: "_id",
            render: (id, record) => <div> <EyeOutlined onClick={() => { setSelectedBill(record); console.log(record); setPopModal(true) }} /></div>,
        },
    ]
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    return (
        <DefaultLayout>
            <h1>BillsPage</h1>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className='mb-0'>
                    Invoice List
                </h1>

            </div>

            <Table columns={columns} dataSource={billsData} bordered />
            {popModal && (
                <Modal title="Invoice Details" visible={popModal} onCancel={() => { setPopModal(false) }} footer={false}>
                    <div id="invoice-pos" ref={componentRef}>
                        <center id='top'>
                            <h1 className="logo">
                                <img src="/assets/logo-social.png" height={90} alt="" />
                            </h1>
                            <div className="info">
                                <h2>Contact: <span className='text-primary'>0333-3333333</span></h2>
                                <h2>Address: <span className='text-primary'>93-town Lahore</span></h2>

                            </div>
                        </center>
                        <div id="mid">
                            <div className="mt-2">
                                <p>
                                    Customer Name: <b>{selectedBill.customerName}</b>
                                    <br />
                                    Phone No : <b>{selectedBill.customerNumber}</b>
                                    <br />
                                    Date : <b>{selectedBill.date.toString().substring(0, 10)}</b>
                                </p>
                                <hr className="m-2" />
                                <div id="bot">
                                    <table>
                                        <thead>
                                            <tr className="tabletitle">
                                                <th className="item pe- w-142">
                                                    <h2>Item</h2>
                                                </th>
                                                <th className="Hours pe-4 text-cente w-14r">
                                                    <h2>Single Qty Price</h2>
                                                </th>
                                                <th className="Hours text-center pe-2 w-14" >
                                                    <h2>Qty</h2>
                                                </th>
                                                <th className="Rate pe-4 text-center w-14" >
                                                    <h2>Price Cartoons</h2>
                                                </th>
                                                <th className="Hours pe-4 text-center w-14" >
                                                    <h2>Cartoons Qty</h2>
                                                </th>
                                                <th className="Hours pe-4 text-center w-14" >
                                                    <h2>Disc Per Crt</h2>
                                                </th>
                                                
                                                <th className=" pe-2 w-14 text-center" >
                                                    <h2>Total</h2>
                                                </th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            {selectedBill.cartItems.map((item) => (
                                                <>
                                                    <tr className="service">
                                                        <td className="tableItem pe-2">
                                                            <p className="itemtext">{item.name}</p>
                                                        </td>
                                                        <td className="tableItem pe-2 ">
                                                            <p className="itemtext">{item.price}</p>
                                                        </td>
                                                        <td className="tableItem pe-2 text-center">
                                                            <p className="itemtext">{item.singleQuantity}</p>
                                                        </td>
                                                        <td className="tableItem pe-4 text-center">
                                                            <p className="itemtext">{item.priceCartoons}</p>
                                                        </td>
                                                        <td className="tableItem pe-4 text-center">
                                                            <p className="itemtext">{item.cartoonsQuantity}</p>
                                                        </td>
                                                      
                                                        <td className="tableItem pe-4 text-center">
                                                            <p className="itemtext">{item.discount} %</p>
                                                        </td>
                                                        <td className="tableItem pe-2 text-center">
                                                            <p className="itemtext">{(item.singleQuantity * item.price ) + ( item.cartoonsQuantity * item.priceCartoons)}</p>
                                                        </td>
                                                    </tr>

                                                </>
                                            ))}
                                        </tbody>
                                        <tbody>
                                            {/* <tr className="tabletitle">
                                                <td></td>
                                                <td></td>
                                                <td className="rate text-center">
                                                    <h2>Discount</h2>
                                                </td>
                                                <td className="payment text-center">
                                                    <h2>{selectedBill.discount}</h2>
                                                </td>
                                            </tr> */}
                                            <tr className="tabletitle">
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td className="rate text-center">
                                                    <h2>Grand Total</h2>
                                                </td>
                                                <td className="payment text-center">
                                                    <h2>{selectedBill.subTotal}</h2>
                                                </td>
                                            </tr>
                                            <tr className="tabletitle">
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td className="rate text-center">
                                                    <h2>Paid Amount</h2>
                                                </td>
                                                <td className="payment text-center">
                                                    <h2>{selectedBill.paidPayment}</h2>
                                                </td>
                                            </tr>
                                            <tr className="tabletitle">
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td className="rate text-center">
                                                    <h2>Remaining Payment</h2>
                                                </td>
                                                <td className="payment text-center">
                                                    <h2>{selectedBill.remainingPayment}</h2>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <Button type='primary' onClick={handlePrint}>
                            Print
                        </Button>
                    </div>
                </Modal>
            )}
        </DefaultLayout>
    )
}

export default BillsPage