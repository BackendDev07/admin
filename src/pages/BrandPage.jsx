import React, { useState } from 'react'
import { Card, Modal, Row, Upload, Form, Input, message, Button } from 'antd'
import PageHeader from '../components/PageHeader'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import {
    useDeleteRequest,
    useLoad,
    usePostRequest,
    usePutRequest,
} from '../hooks/request'
import {
    addFileUrl,
    bradndListUrl,
    brandAddUrl,
    deleteFileUrl,
    getBrandDeleteUrl,
    getBrandUpdateUrl,
} from '../helpers/urls'
import { FullPageLoader } from '../components/FullPageLoader'
import { getEncryptedCode, deleteProps } from '../helpers/helpers'
import { MediaAxios } from '../helpers/axios'

const { Meta } = Card

const initialBrandData = {
    id: null,
    name_uz: '',
    name_ru: '',
    image: '',
}
function BrandPage() {
    const { response, loading, request } = useLoad({ url: bradndListUrl })
    const brandPostRequest = usePostRequest({ url: brandAddUrl })
    const brandDeleteRequest = useDeleteRequest()
    const brandUpdateRequest = usePutRequest()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [fileList, setFileList] = useState([])
    const [brandData, setBrandData] = useState(initialBrandData)

    const handleOk = async () => {
        const postData = deleteProps(brandData, ['id'])

        for (const key in postData) {
            if (postData[key] === initialBrandData[key]) {
                return message.error(`${key} maydonni to'diring!`)
            }
        }

        if (brandData.id) {
            const { success, response } = await brandUpdateRequest.request({
                url: getBrandUpdateUrl(brandData.id),
                data: postData,
            })
            if (success) {
                request()
            }
        } else {
            const { success, response } = await brandPostRequest.request({
                data: postData,
            })
            if (success) {
                request()
                console.log(response)
            }
        }
        setIsModalOpen(false)
    }

    const handleChange = ({ target }) => {
        const { value, name } = target
        setBrandData({ ...brandData, [name]: value })
    }

    const handleCancel = () => {
        setIsModalOpen(false)
        setBrandData(initialBrandData)
        setFileList([])
    }

    const handleAddBtn = () => {
        setIsModalOpen(true)
    }

    const onChange = ({ file }) => {
        const encryptCode = getEncryptedCode()

        const headers = {
            'x-auth-key': encryptCode,
        }

        if (file.status === 'removed') {
            console.log(true)
            const key = file.url.split('/').splice(3).join('/')
            MediaAxios.post(deleteFileUrl, { key }, { headers })
                .then(function (response) {
                    if (response.data.id) {
                        handleChange({
                            target: { value: '', name: 'image' },
                        })
                        setFileList([])
                    }
                })
                .catch(function (error) {
                    message.error(error.data.message)
                })
        } else {
            const formData = new FormData()
            formData.append('file', file.originFileObj)
            formData.append('project', 'ecommerce')
            MediaAxios.post(addFileUrl, formData, { headers })
                .then(function (response) {
                    if (response.data.url) {
                        handleChange({
                            target: { value: response.data.url, name: 'image' },
                        })
                        setFileList([
                            ...fileList,
                            {
                                uid: response.data.id,
                                name: file.name,
                                status: 'done',
                                url: response.data.url,
                            },
                        ])
                    }
                })
                .catch(function (error) {
                    message.error(error.data.message)
                })
        }
    }

    const handleDeleteModalOkBtn = async () => {
        const { success, response } = await brandDeleteRequest.request({
            url: getBrandDeleteUrl(brandData.id),
        })
        if (success) {
            request()
            setDeleteModalOpen(false)
        }
    }

    const handleDeleteModalCloseBtn = () => {
        setBrandData(initialBrandData)
        setDeleteModalOpen(false)
    }

    const handleDeleteBtn = (id) => {
        setBrandData({ ...brandData, id })
        setDeleteModalOpen(true)
    }

    const handleEditBtn = (item) => {
        setBrandData({
            id: item.id,
            name_uz: item.name_uz,
            name_ru: item.name_ru,
            image: item.image,
        })
        setFileList([
            ...fileList,
            {
                uid: item.id,
                name: item.name_uz,
                status: 'done',
                url: item.image,
            },
        ])
        setIsModalOpen(true)
    }

    return (
        <>
            <PageHeader
                title='Brendlar'
                btnTitle='Brend qo`shish'
                handleClick={handleAddBtn}
            />

            <Row className='container' justify='space-between'>
                {loading ? (
                    <FullPageLoader />
                ) : (
                    response?.brands?.map((item) => (
                        <Card
                            key={item.id}
                            style={{
                                width: 350,
                                marginBottom: 16,
                            }}
                            cover={<img alt='example' src={item.image} />}
                            actions={[
                                <Button
                                    type='text'
                                    onClick={() => handleEditBtn(item)}
                                >
                                    <EditOutlined key='edit' />
                                </Button>,
                                <Button
                                    type='text'
                                    onClick={() => handleDeleteBtn(item.id)}
                                >
                                    <DeleteOutlined key='delete' />
                                </Button>,
                            ]}
                        >
                            <Meta title={item.name_uz} />
                        </Card>
                    ))
                )}
            </Row>

            <Modal
                title='Basic Modal'
                open={isModalOpen}
                okText={brandData.id ? 'Update' : 'Add'}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form name='basic'>
                    <Form.Item label='Name uz'>
                        <Input
                            name='name_uz'
                            value={brandData.name_uz}
                            onChange={handleChange}
                        />
                    </Form.Item>

                    <Form.Item label='Name ru'>
                        <Input
                            name='name_ru'
                            value={brandData.name_ru}
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='Rasm'>
                        <Upload
                            listType='picture-card'
                            fileList={fileList}
                            onChange={onChange}
                        >
                            {fileList.length < 1 && '+ Upload'}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Delete"
                cancelText="No"
                okText='Yes'
                okType='Danger'
                centered
                open={deleteModalOpen}
                onOk={handleDeleteModalOkBtn}
                onCancel={handleDeleteModalCloseBtn}
            >
                <p>Do you add a new brend</p>
            </Modal>
        </>
    )
}

export default BrandPage
