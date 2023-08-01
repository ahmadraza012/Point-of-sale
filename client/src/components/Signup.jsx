import { Button, Form, Input, Select, message } from 'antd'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleSubmit = async (value) => {
        try {
            dispatch({
                type: "SHOW_LOADING"
            })
            await axios.post('http://localhost:8080/api/users/register', value)
            message.success("Registered successfully")
            navigate("/login")
            dispatch({
                type: "HIDE_LOADING"
            })
        } catch (error) {
            message.error("Something went wrong")
            console.log(error)
        }
    };
    useEffect(() => {
        if(localStorage.getItem("auth")){
            localStorage.getItem("auth");
            navigate("/")
            }
    },[navigate])
    return (
        <>
            <div className="container my-5">
                <div className="register">
                    <h1>POS</h1>
                    <h3>Register Page</h3>
                    <Form layout='vertical' className='w-75 mx-auto' onFinish={handleSubmit}>
                        <Form.Item name="name" label="Name">
                            <Input className='w-100' />
                        </Form.Item>
                        <Form.Item name="userId" label="User Id">
                            <Input className='w-100' />
                        </Form.Item>
                        <Form.Item name="password" label="Password">
                            <Input type='password' className='w-100' />
                        </Form.Item>

                        <div className="d-flex justify-content-between">
                            <p>Already register? <Link to="/login">Login</Link></p>
                            <Button type='primary' htmlType='submit'>Register</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default Signup