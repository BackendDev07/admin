import { Spin } from 'antd'
import React from 'react'

export const FullPageLoader = () => {
    return (
        <div className='loader'>
            <Spin size='large' />
        </div>
    )
}
