import DashboardPage from './../pages/DashboardPage'
import ProductsPage from './../pages/ProductsPage'
import CategoriesPage from './../pages/CategoriesPage'
import BannerPage from './../pages/BannerPage'
import BrandPage from './../pages/BrandPage'
import AttributePage from './../pages/AttributePage'
import LoginPage from '../pages/LoginPage'
import PageNotFound from '../pages/PageNotFound'
import Orders from '../pages/Orders'

export const routes = [
    {
        id: 1,
        path: '/',
        component: <DashboardPage />,
    },
    {
        id: 2,
        path: '/products',
        component: <ProductsPage />,
    },
    {
        id: 3,
        path: '/categories',
        component: <CategoriesPage />,
    },
    {
        id: 4,
        path: '/banner',
        component: <BannerPage />,
    },
    {
        id: 5,
        path: '/brand',
        component: <BrandPage />,
    },
    {
        id: 6,
        path: '/attribute',
        component: <AttributePage />,
    },
    {
        id: 10,
        path: '/orders',
        component: <Orders />,
    },
    {
        id: 9,
        path: '*',
        component: <PageNotFound type='routes'/>,
    },
]

export const loginRoutes = [
    {
        id: 7,
        path: '/login',
        component: <LoginPage />,
    },
    {
        id: 8,
        path: '*',
        component: <PageNotFound type='loginroutes' />,
    },
]
