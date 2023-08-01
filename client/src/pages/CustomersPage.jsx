import React, { useEffect, useState } from 'react'
import DefaultLayout from '../components/DefaultLayout'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Table } from 'antd'

const CustomersPage = () => {
  const [billsData, setBillsData] = useState([])
  const dispatch = useDispatch()

  const getAllBills = async () => {
    try{
      dispatch({
        type: "SHOW_LOADING"
      })
      const {data} = await axios.get('http://localhost:8080/api/bills/get-bills')
      setBillsData(data)
      dispatch({
        type: "HIDE_LOADING"
      })
      console.log(data)
    }catch (error){
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
        dataIndex: "totalAmount"
    },
  
  ]


  return (
    <DefaultLayout>
      <h1>Customer Page</h1>
      <Table columns={columns} dataSource={billsData} bordered />
    </DefaultLayout>
  )
}

export default CustomersPage