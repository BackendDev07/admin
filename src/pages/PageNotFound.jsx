import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
const PageNotFound = ({ type }) => {
    const navigate = useNavigate()
    const handleBtnClick = () => {
        navigate(type === 'routes' ? '/' : '/login')
    }
    return (
        <Result
            status='404'
            title='404'
            subTitle='Sorry, the page you visited does not exist.'
            extra={
                <Button type='primary' onClick={handleBtnClick}>
                    Back Home
                </Button>
            }
        />
    )
}

export default PageNotFound
