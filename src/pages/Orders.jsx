import React, { useState } from 'react'
import { Button, Descriptions, Drawer, Image, Row ,Space,Table, Typography } from 'antd'
import PageHeader from '../components/PageHeader'
import { EyeOutlined } from '@ant-design/icons'
import { useLoad } from '../hooks/request'
import { ordersListUrl } from '../helpers/urls'
import { paymentMethod } from '../helpers/helpers'

function Orders() {
  const { response, loading, request } = useLoad({url: ordersListUrl})
  const [ drawerOpen, setDrawerOpen ] = useState(false)
  const [order, setOrder] = useState({})
  const handleViewBtn = (item) => {
    setOrder(item)
    setDrawerOpen(true)
  }
  const columns = [
    {
        title: 'ID',
        dataIndex: 'order_id',
        key: 'order_id',
    },
    {
        title: 'Name',
        dataIndex: 'full_name',
        key: 'full_name',
    },
    {
        title: 'Pay method',
        dataIndex: 'payment_method',
        key: 'payment_method',
        render: (item) => <Typography>{ paymentMethod[item] }</Typography>
    },
    {
        title: 'Total price',
        dataIndex: 'total_price',
        key: 'total_price',
    },
    {
        title: 'Action',
        key: 'action',
        render: (item) => (
            <Space size='middle'>
                <Button type='default' onClick={ () =>  handleViewBtn(item)}>
                    <EyeOutlined />
                </Button>
            </Space>
        ),
    },
  ]

  const productColumns = [
    {
        title: 'Image',
        dataIndex: 'images',
        key: 'images',
        render: (item) => {
            return <Image width={80} src={item} />
        },
    },
    {
        title: 'Name',
        dataIndex: 'name_uz',
        key: 'name_uz',
    },
    
    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
    },
]
  
  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  const handleRefreshBtn = () => {
    request()
  }

  return (
    <Row className='container'>
        <PageHeader title='Orders' btnTitle='Update' handleClick={handleRefreshBtn}/>
                <Table
                    style={{ width: '100%' }}
                    columns={columns}
                    dataSource={response?.orders}
                    loading={loading}
                />
                <Drawer
                width={'80%'}
                title="About order"
                placement='right'
                onClose={handleDrawerClose}
                open={drawerOpen} 
                >
                  <Space direction='vertical'>
                    <Typography> <strong>Order ID</strong> : {order.order_id}</Typography>
                    <Typography> <strong>Order date</strong> : {' '}</Typography>
                    <Typography> <strong>Order bill</strong> : {Number(order.total_price).toLocaleString()}</Typography>
                  </Space>

 <Descriptions title="User Info">
    <Descriptions.Item label="UserName">{order.full_name}</Descriptions.Item>
    <Descriptions.Item label="Telephone">{order.delivery_phone}</Descriptions.Item>
    <Descriptions.Item label="Live">{order?.delivery_address}</Descriptions.Item>
  </Descriptions>
  <Typography>Ordered products:</Typography>
  <Table style={{ width: '100%'}}
  columns={productColumns}
  dataSource={order?.order_items}
  loading={loading}
  pagination={false}
  />
                    </Drawer> 
    </Row>
  )
}

export default Orders