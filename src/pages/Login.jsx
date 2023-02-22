import React from 'react'
import { Button, Form, Input, message } from 'antd';
import { usePostRequest } from '../hooks/request';
import { loginUrl } from '../helpers/url';

function Login() {
  const {request, loading} = usePostRequest({ url: loginUrl })

  const handleOnFinish = async (e) => {
        const { response, success } = await request({ data: e})
        if (success) {
          if (response.isOk){
            localStorage.setItem('accessToken', response.accessToken)
            localStorage.setItem('refreshToken', response.refreshToken)
          } else {
            message.warning(response.message) 
          }
      }
  }
  return (
    <div className='login-wrapper'>
    <div className="login-form">
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={handleOnFinish}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>

      </Form.Item>
    </Form>
    </div>
  </div>
  )
}

export default Login

