import { message } from 'antd'
import { useEffect, useState } from 'react'
import Axios from '../helpers/axios'

export function usePostRequest(options = {}) {
    return useRequest({ method: 'POST', ...options })
}

export function usePutRequest(options = {}) {
    return useRequest({ method: 'PUT', ...options })
}

export function usePatchRequest(options = {}) {
    return useRequest({ method: 'PATCH', ...options })
}

export function useGetRequest(options = {}) {
    return useRequest({ method: 'GET', ...options })
}

export function useDeleteRequest(options = {}) {
    return useRequest({ method: 'DELETE', ...options })
}

export function useRequest(options = {}) {
    const [response, setResponse] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({})

    async function request(overrideOptions = {}, sync = false) {
        setLoading(true)
        try {
            const { data } = await Axios({
                ...options,
                ...overrideOptions,
            })
            if (!sync) setResponse(data)
            return { response: data, success: true }
        } catch (e) {
            setError(e.response || {})
            if (e.response === undefined) {
                message.warning('Проверьте интернет соединение')
            } else if (e.response.status >= 500) {
                message.warning('Ошибка сервера.')
            }

            return { error: e.response, success: false }
        } finally {
            if (!sync) setLoading(false)
        }
    }

    return {
        loading,
        request,
        error,
        response,
        setResponse,
        setError,
        setLoading,
    }
}

export function useLoad(options, dependencies = []) {
    const request = useRequest({ method: 'GET', ...options })
    useEffect(() => {
        request.request()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies)

    return request
}
