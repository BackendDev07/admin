import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import MainLayout from './components/Layout'
import { loginRoutes } from './helpers/routes'
import useAuth from './hooks/useAuth'
function App() {
    const isLogin = useAuth()
    const navigate = useNavigate()

    return (
        <div>
            <Header />
            {isLogin ? (
                <MainLayout />
            ) : (
                <Routes>
                    {loginRoutes.map((item) => (
                        <Route
                            key={item.id}
                            path={item.path}
                            element={item.component}
                        />
                    ))}
                </Routes>
            )}
        </div>
    )
}

export default App
