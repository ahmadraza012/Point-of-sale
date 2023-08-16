import React, { useEffect, useRef, useState } from 'react'
import DefaultLayout from '../components/DefaultLayout'
import { useDispatch } from 'react-redux'
import axios from 'axios'
// import { Table } from 'antd'
import { Button, Collapse, Modal, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';


const { Panel } = Collapse;


const CustomersPage = () => {
  const componentRef = useRef();
  const [billsData, setBillsData] = useState([])
  const [popModal, setPopModal] = useState(false)
  const [selectedBill, setSelectedBill] = useState(null)

  const [customerBills, setCustomerBills] = useState({});
  const dispatch = useDispatch()

  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING"
      })
      const { data } = await axios.get('http://localhost:8080/api/bills/get-latest')
      // const { data } = await axios.get('http://localhost:8080/api/bills/get-bills');
      // Group bills by customerName
      const groupedBills = {};
      console.log(data, "ssfdsafsdafsdaf")
      data.map((item) => {
        item.bills.forEach((bill) => {
          if (!groupedBills[bill.customerName]) {
            groupedBills[bill.customerName] = [bill];
          } else {
            groupedBills[bill.customerName].push(bill);
          }
        })
      });
      

      setCustomerBills(groupedBills);

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
  const renderCustomerBills = () => {
    return Object.entries(customerBills).map(([customerName, bills]) => (
      <div key={customerName}>
        <h3>{customerName}</h3>
        <Table columns={columns} dataSource={bills} bordered />
      </div>
    ));
  };


  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName'
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
      title: "Paid Amount",
      dataIndex: "paidPayment"
    },
    {
      title: "Remaining Payment",
      dataIndex: "remainingPayment"
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount'
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => <div> <EyeOutlined onClick={() => { setSelectedBill(record); console.log(record); setPopModal(true) }} /></div>,
    },
  ];
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
});

  return (
    // <DefaultLayout>
    //   <h1>Customer Page</h1>
    //   <Table columns={columns} dataSource={billsData} bordered />
    // </DefaultLayout>
    <DefaultLayout>
      <h1>Customer Page</h1>
      {renderCustomerBills()}
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
                              <p className="itemtext">{item.priceSingle}</p>
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
                              <p className="itemtext">{(item.singleQuantity * item.priceSingle) + (item.cartoonsQuantity * item.priceCartoons)}</p>
                            </td>
                          </tr>

                        </>
                      ))}
                    </tbody>
                    <tbody>

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

export default CustomersPage