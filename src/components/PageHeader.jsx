import { Button, Row, Typography } from 'antd'
import React from 'react'

const { Title } = Typography
function PageHeader(props) {
    const { title, btnTitle, handleClick } = props
    return (
        <Row justify='space-between' className='container pageHeader'>
            <Title level={2}>{title}</Title>
            {btnTitle && <Button onClick={handleClick}>{btnTitle}</Button>}
        </Row>
    )
}

export default PageHeader
