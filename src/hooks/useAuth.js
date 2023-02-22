import { useEffect, useState } from 'react'

function useAuth() {
    const [isAuth, setIsAuth] = useState(false)
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    useEffect(() => {
        if (!!accessToken && !!refreshToken) {
            setIsAuth(true)
        } else {
            setIsAuth(false)
        }
    }, [accessToken, refreshToken])

    return isAuth
}

export default useAuth
