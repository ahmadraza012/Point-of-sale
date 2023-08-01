import React, { useEffect, useState } from 'react'
import DefaultLayout from '../components/DefaultLayout'
import { useDispatch } from 'react-redux'
import axios from "axios"
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Select, Table, message } from 'antd'

const ItemsPage = () => {
  const dispatch = useDispatch()
  const [itemsData, setItemsData] = useState([])
  const [popModal, setPopModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form] = Form.useForm(); // Add this line to create a form instance
  const [selectedImg, setSelectedImg] = useState("")

  const getAllItems = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING"
      })
      const { data } = await axios.get('http://localhost:8080/api/items/get-item')
      setItemsData(data)
      dispatch({
        type: "HIDE_LOADING"
      })
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllItems()
  }, [])

  useEffect(() => {
    // Update form initial values when editItem changes
    form.setFieldsValue(editItem);
  }, [editItem]);
  const onProfileImageChange = (e) => {
    console.log("sending file")
		let file = e.target.files[0];
		let formData = new FormData();
		formData.append("file", file);

		axios
    // console.log(file)
			.post("http://localhost:8080/api/upload/uploader", formData,  { headers: { "Content-Type": "multipart/form-data" } })
			.then((res) => {
        console.log(res.data.url)
        setSelectedImg(res.data.url)
        console.log(res)})
			.catch((err) => console.log(err));
	};

  const handleSubmit = async (value) => {
    console.log(value)
    if (editItem === null) {
      try {
        dispatch({
          type: "SHOW_LOADING"
        })
        const res = await axios.post('http://localhost:8080/api/items/add-item', {...value, image: selectedImg})
        message.success("Item added successfully")
        getAllItems()
        setPopModal(false)
        dispatch({
          type: "HIDE_LOADING"
        })
      } catch (error) {
        message.error("Something went wrong")
        console.log(error)
      }
    } else {
      try {
        dispatch({
          type: "SHOW_LOADING"
        })
        await axios.put('http://localhost:8080/api/items/edit-item', { ...value, itemId: editItem._id, image: selectedImg })
        message.success("Item Updated successfully")
        getAllItems()
        setPopModal(false)
        dispatch({
          type: "HIDE_LOADING"
        })
      } catch (error) {
        message.error("Something went wrong")
        console.log(error)
      }
    }
  }
  console.log(editItem)

  const handleDelete = async (record) => {
    try {
      dispatch({
        type: "SHOW_LOADING"
      })
      await axios.post('http://localhost:8080/api/items/delete-item', { itemId: record._id })
      message.success("Item deleted successfully")
      getAllItems()
      setPopModal(false)
      dispatch({
        type: "HIDE_LOADING"
      })
    } catch (error) {
      message.error("Something went wrong")
      console.log(error)
    }
  }

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
      title: "Price Single",
      dataIndex: "price"
    },
    {
      title: "Price Cartoons",
      dataIndex: "priceCartoons"
    },
    {
      title: "Quantity Single Piece",
      dataIndex: "quantity"
    },
    {
      title: "Quantity Cartoons ",
      dataIndex: "CartoonsQuantity"
    },
    {
      title: "Disount Cartoons",
      dataIndex: "discount"
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => <div><DeleteOutlined onClick={() => handleDelete(record)} /> <EditOutlined onClick={() => { setEditItem(record); setPopModal(true), console.log(record) }} /></div>,
    },
  ]

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className='mb-0'>
          Items List
        </h1>
        <button className='btn btn-primary' onClick={() => {
          form.resetFields(); // Reset form fields
          setEditItem(null);
          setPopModal(true);
        }}>
          Add Item
        </button>
      </div>

      <Table columns={columns} dataSource={itemsData} bordered />
      {
        <Modal title={`${editItem !== null ? 'Edit Item' : 'Add New Item'}`} visible={popModal} onCancel={() => { setPopModal(false); setEditItem(null) }} footer={false}>
          <Form form={form} layout='vertical' onFinish={handleSubmit}>
            <Form.Item name="name" label="Name">
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price Single">
              <Input />
            </Form.Item>
            <Form.Item name="priceCartoons" label="Price Cartoons">
              <Input />
            </Form.Item>
            
            <div className="position-relative uploadBox">
              <a className="upload-text pointer">
                <span className="iconify" data-icon="bytesize:upload"></span>
                <span className="upload-text ms-3">Upload photo</span>
              </a>
              <input
                type="file"
                onChange={(e) => {
                  onProfileImageChange(e);
                  // e.target = null;
                }}
              />
            </div>
            {/* {((total / 100) * 10).toFixed(2)} */}
            <Form.Item name="quantity" label="Quantity Single Piece">
              <Input />
            </Form.Item>
            <Form.Item name="CartoonsQuantity" label="Quantity Cartoons">
              <Input />
            </Form.Item>
            <Form.Item name="discount" label="Add Discount">
              <Input/>
            </Form.Item>
            <Form.Item name="category" label="Category">
              <Select>
                <Select.Option value="lunch-box">Lunch Box</Select.Option>
                <Select.Option value="bowls">Bowls</Select.Option>
                <Select.Option value="bottles">Bottles</Select.Option>
              </Select>
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button type='primary' htmlType='submit'>Save</Button>
            </div>
          </Form>
        </Modal>
      }
    </DefaultLayout>
  )
}

export default ItemsPage
