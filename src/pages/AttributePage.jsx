import {
    Button,
    Collapse,
    Form,
    Input,
    List,
    message,
    Modal,
    Row,
    Select,
    Space,
    Spin,
} from 'antd'
import React, { useState } from 'react'
import PageHeader from '../components/PageHeader'
import {
    attributeAddUrl,
    attributeListUrl,
    getAttributeDeleteUrl,
    getAttributeUpdateUrl,
    getAttributeValueAddUrl,
    getAttributeValueDeleteUrl,
    getAttributeValueUpdateUrl,
} from '../helpers/urls'
import {
    useDeleteRequest,
    useLoad,
    usePutRequest,
    usePostRequest,
} from '../hooks/request'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import {
    catchSelectedCategory,
    deleteProps,
    generateCategoriesList,
    slugify,
} from '../helpers/helpers'
const { Panel } = Collapse

const initialAttributeData = {
    id: null,
    name_uz: '',
    name_ru: '',
    slug: '',
    is_filterable: 0,
}

const initialAttributeValueData = {
    id: null,
    attribute_id: null,
    value_uz: '',
    value_ru: '',
}

function AttributePage() {
    const { loading, response, request } = useLoad({ url: attributeListUrl })
    const attributePostRequest = usePostRequest({ url: attributeAddUrl })
    const attributeEditRequest = usePutRequest()
    const attributeDeleteRequest = useDeleteRequest()
    const attributeValuePostRequest = usePostRequest()
    const attributeValueEditRequest = usePutRequest()
    const [attributeData, setAttributeData] = useState(initialAttributeData)
    const [attributeValueData, setAttributeValueData] = useState(
        initialAttributeValueData
    )
    const [modalOpen, setModalOpen] = useState(false)

    const handleChange = ({ target }) => {
        const { value, name } = target
        setAttributeData({ ...attributeData, [name]: value })
    }

    const handleChangeValue = ({ target }) => {
        const { value, name } = target
        setAttributeValueData({ ...attributeValueData, [name]: value })
    }

    const handleFinishAttribute = async () => {
        const { name_uz } = deleteProps(attributeData, ['id'])
        const posted_data = {
            ...deleteProps(attributeData, ['id']),
            slug: slugify(name_uz),
        }

        if (attributeData.id) {
            const { response, success } = await attributeEditRequest.request({
                url: getAttributeUpdateUrl(attributeData.id),
                data: posted_data,
            })
            if (success) {
                message.success('Attribute muvofaqqiyatli yangilandi')
                setAttributeData(initialAttributeData)
                request()
            }
        } else {
            const { response, success } = await attributePostRequest.request({
                data: posted_data,
            })
            if (success) {
                console.log(response)
                message.success('Attribute muvofaqqiyatli qo`shildi')
                setAttributeData(initialAttributeData)
                request()
            }
        }
    }

    const handleFinishAttributeValue = async () => {
        const posted_data = deleteProps(attributeValueData, [
            'id',
            'attribute_id',
        ])

        if (attributeValueData.id) {
            const { response, success } =
                await attributeValueEditRequest.request({
                    url: getAttributeValueUpdateUrl(attributeValueData.id),
                    data: posted_data,
                })
            if (success) {
                message.success('Attribute value muvofaqqiyatli yangilandi')
                setAttributeValueData(initialAttributeValueData)
                request()
            }
        } else {
            const { response, success } =
                await attributeValuePostRequest.request({
                    url: getAttributeValueAddUrl(
                        attributeValueData.attribute_id
                    ),
                    data: posted_data,
                })
            if (success) {
                console.log(response)
                message.success('Attribute value muvofaqqiyatli qo`shildi')
                setAttributeValueData(initialAttributeValueData)
                request()
            }
        }
    }

    const handleEditBtn = (item) => {
        setAttributeData(deleteProps(item, ['attributeValues']))
    }

    const handleEditBtnValue = (item) => {
        setAttributeValueData(deleteProps(item, ['created_at', 'updated_at']))
    }

    const handleModalOk = async () => {
        const { success } = await attributeDeleteRequest.request({
            url: attributeData.id
                ? getAttributeDeleteUrl(attributeData.id)
                : getAttributeValueDeleteUrl(attributeValueData.id),
        })
        if (success) {
            message.success('Attribute muvofaqqiyatli o`chirildi!')
            handleModalClose()
            request()
        }
    }

    const handleModalClose = () => {
        setAttributeData(initialAttributeData)
        setAttributeValueData(initialAttributeValueData)
        setModalOpen(false)
    }

    const handleDeleteBtn = (item) => {
        setAttributeData({ ...attributeData, id: item.id })
        setModalOpen(true)
    }

    const handleDeleteBtnValue = (item) => {
        setAttributeValueData({ ...attributeValueData, id: item.id })
        setModalOpen(true)
    }

    const genExtra = (item, isAttribute) => (
        <Space>
            <Button
                icon={<EditOutlined />}
                onClick={() =>
                    isAttribute ? handleEditBtn(item) : handleEditBtnValue(item)
                }
            />
            <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() =>
                    isAttribute
                        ? handleDeleteBtn(item)
                        : handleDeleteBtnValue(item)
                }
            />
        </Space>
    )

    return (
        <>
            <PageHeader title='Attributlar' />

            {loading ? (
                <Spin />
            ) : (
                <div className='container'>
                    <Row wrap={false} justify='space-between'>
                        <Form
                            name='basic'
                            layout='vertical'
                            style={{ width: '30%' }}
                            onFinish={handleFinishAttribute}
                        >
                            <Form.Item
                                label='Attribute name UZ'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Attribute nomini kiriting!',
                                    },
                                ]}
                            >
                                <Input
                                    value={attributeData.name_uz}
                                    name='name_uz'
                                    onChange={handleChange}
                                />
                            </Form.Item>
                            <Form.Item
                                label='Attribute name RU'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Attribute nomini kiriting!',
                                    },
                                ]}
                            >
                                <Input
                                    value={attributeData.name_ru}
                                    name='name_ru'
                                    onChange={handleChange}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type='primary' htmlType='submit'>
                                    {attributeData.id ? 'Update' : 'Add'}
                                </Button>
                                {attributeData.id && (
                                    <Button
                                        type='text'
                                        htmlType='reset'
                                        onClick={() =>
                                            setAttributeData(
                                                initialAttributeData
                                            )
                                        }
                                    >
                                        Reset
                                    </Button>
                                )}
                            </Form.Item>
                        </Form>
                        <Form
                            name='basic'
                            layout='vertical'
                            style={{ width: '30%' }}
                            onFinish={handleFinishAttributeValue}
                        >
                            <Form.Item
                                label='Attribute value name UZ'
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Attribute value nomini kiriting!',
                                    },
                                ]}
                            >
                                <Input
                                    value={attributeValueData.value_uz}
                                    name='value_uz'
                                    onChange={handleChangeValue}
                                />
                            </Form.Item>
                            <Form.Item
                                label='Attribute value name RU'
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Attribute value nomini kiriting!',
                                    },
                                ]}
                            >
                                <Input
                                    value={attributeValueData.value_ru}
                                    name='value_ru'
                                    onChange={handleChangeValue}
                                />
                            </Form.Item>
                            <Form.Item
                                label='Attributeni tanlang'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Attributeni kiriting!',
                                    },
                                ]}
                            >
                                <Select
                                    onChange={(e) =>
                                        handleChangeValue({
                                            target: {
                                                value: e,
                                                name: 'attribute_id',
                                            },
                                        })
                                    }
                                    value={catchSelectedCategory(
                                        response?.attributes,
                                        attributeValueData.attribute_id
                                    )}
                                    options={generateCategoriesList(
                                        response?.attributes
                                    )}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Space>
                                    <Button type='primary' htmlType='submit'>
                                        {attributeValueData.id
                                            ? 'Update'
                                            : 'Add'}
                                    </Button>
                                    {attributeValueData.id && (
                                        <Button
                                            type='text'
                                            htmlType='reset'
                                            onClick={() =>
                                                setAttributeValueData(
                                                    initialAttributeValueData
                                                )
                                            }
                                        >
                                            Reset
                                        </Button>
                                    )}
                                </Space>
                            </Form.Item>
                        </Form>
                    </Row>
                    <Collapse defaultActiveKey={['1']}>
                        {response?.attributes?.map((item) => (
                            <Panel
                                header={item.name_uz}
                                key={item.id}
                                extra={genExtra(item, true)}
                            >
                                {!!item?.attributeValues?.length ? (
                                    <List
                                        bordered
                                        dataSource={item?.attributeValues}
                                        renderItem={(el) => (
                                            <List.Item
                                                extra={genExtra(el, false)}
                                            >
                                                {el.value_uz}
                                            </List.Item>
                                        )}
                                    />
                                ) : (
                                    <p>Item content</p>
                                )}
                            </Panel>
                        ))}
                    </Collapse>
                </div>
            )}

            <Modal
                title="O'chirish"
                cancelText="Yo'q"
                okText='Ha'
                okType='danger'
                centered
                open={modalOpen}
                onOk={handleModalOk}
                onCancel={handleModalClose}
            >
                <p>Attributeni o'chirmoqchimisz?</p>
            </Modal>
        </>
    )
}

export default AttributePage
