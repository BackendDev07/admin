import {DingdingOutlined , PieChartOutlined, UserOutlined, UnorderedListOutlined, FontColorsOutlined, AppleOutlined, CustomerServiceOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { routes } from './../helpers/routes'
const { Sider } = Layout

function getItem(label, key, icon, path, children) {
    return {
        key,
        icon,
        children,
        label,
        path,
    }
}
const items = [
    getItem('Asosiy', '1', <PieChartOutlined />, '/'),
    getItem('Mahsulotlar', '2', <UserOutlined />, '/products'),
    getItem('Kategoriya', '3', <UnorderedListOutlined />, '/categories'),
    getItem('Attribut', '4', <FontColorsOutlined />, '/attribute'),
    getItem('Brand', '5', <AppleOutlined />, '/brand'),
    getItem('Banner', '6', <CustomerServiceOutlined />, '/banner'),
    getItem('Orders', '7', <DingdingOutlined />, '/orders'),
]
const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false)
    const [activeMenuKey, setActiveMenuKey] = useState('1')
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const menuItemHandler = (e) => {
        const { path } = e.item.props
        navigate(path)
    }

    function isSelectedMenuItem(path, key) {
        if (path === pathname) {
            setActiveMenuKey(key)
        }
    }

    useEffect(() => {
        items.forEach((item) => {
            isSelectedMenuItem(item.path, item.key)
        })
    }, [])

    return (
        <Layout
            style={{
                minHeight: '100vh',
                paddingTop: '60px',
            }}
        >
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <Menu
                    theme='dark'
                    defaultSelectedKeys={[activeMenuKey]}
                    selectedKeys={[activeMenuKey]}
                    mode='inline'
                    items={items}
                    onClick={menuItemHandler}
                />
            </Sider>
            <Layout className='site-layout'>
                <Routes>
                    {routes.map((route) => (
                        <Route
                            path={route.path}
                            key={route.id}
                            element={route.component}
                        />
                    ))}
                </Routes>
            </Layout>
        </Layout>
    )
}
export default MainLayout
