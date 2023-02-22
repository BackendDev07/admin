import React, { useState } from 'react'
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
import PageHeader from '../components/PageHeader'
import {
    categoriesListUrl,
    categoryAddUrl,
    getCategoryUpdateUrl,
    getCategoryDeleteUrl,
} from '../helpers/urls'
import {
    useDeleteRequest,
    useLoad,
    usePutRequest,
    usePostRequest,
} from '../hooks/request'
import {
    catchSelectedCategory,
    deleteProps,
    generateCategoriesList,
    slugify,
} from './../helpers/helpers'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
const { Panel } = Collapse

const initialCategoryData = {
    isEdit: false,
    id: null,
    slug: '',
    name_uz: '',
    name_ru: '',
    catImage: '',
    parent_id: 0,
}

function CategoriesPage() {
    const { loading, response, request } = useLoad({ url: categoriesListUrl })
    const catogoryPostRequest = usePostRequest({ url: categoryAddUrl })
    const catogoryDeleteRequest = useDeleteRequest()
    const catogoryEditRequest = usePutRequest()
    const [categoryData, setCategoryData] = useState(initialCategoryData)
    const [modalOpen, setModalOpen] = useState(false)
    const [deletedId, setDeletedId] = useState(null)

    const handleFinish = async (e) => {
        const { name_uz } = deleteProps(categoryData, ['id', 'isEdit'])
        const posted_data = {
            ...deleteProps(categoryData, ['id', 'isEdit']),
            slug: slugify(name_uz),
        }

        console.log(categoryData.isEdit)
        if (categoryData.isEdit) {
            const { response, success } = await catogoryEditRequest.request({
                url: getCategoryUpdateUrl(categoryData.id),
                data: posted_data,
            })
            if (success) {
                message.success('Kategoriya muvofaqqiyatli yangilandi')
                setCategoryData(initialCategoryData)
                request()
            }
        } else {
            const { response, success } = await catogoryPostRequest.request({
                data: posted_data,
            })
            if (success) {
                console.log(response)
                message.success('Kategoriya muvofaqqiyatli qo`shildi')
                request()
            }
        }
    }

    const handleChange = ({ target }) => {
        const { value, name } = target
        setCategoryData({ ...categoryData, [name]: value })
    }

    const handleEditBtn = (item) => {
        setCategoryData({
            ...categoryData,
            id: item.id,
            isEdit: true,
            name_uz: item.name_uz,
            name_ru: item.name_ru,
            parent_id: item.parent_id,
        })
    }

    const handleDeleteBtn = (item) => {
        setDeletedId(item.id)
        setModalOpen(true)
    }

    const handleModalOk = async () => {
        const { success } = await catogoryDeleteRequest.request({
            url: getCategoryDeleteUrl(deletedId),
        })
        if (success) {
            message.success('Kategoriya muvofaqqiyatli o`chirildi!')
            handleModalClose()
            request()
        }
    }

    const handleModalClose = () => {
        setModalOpen(false)
        setDeletedId(null)
    }

    const genExtra = (item) => (
        <Space>
            <Button
                icon={<EditOutlined />}
                onClick={() => handleEditBtn(item)}
            />
            <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteBtn(item)}
            />
        </Space>
    )

    return (
        <>
            <PageHeader title='Kategoriyalar' btnTitle='Kategoriya qo`shish' />

            {loading ? (
                <Spin />
            ) : (
                <Row className='container' wrap={false}>
                    <Form
                        name='basic'
                        layout='vertical'
                        style={{ width: '20%' }}
                        onFinish={handleFinish}
                    >
                        <Form.Item
                            label='Kategoriya nome UZ'
                            rules={[
                                {
                                    required: true,
                                    message: 'Katagoriya nomini kiriting!',
                                },
                            ]}
                        >
                            <Input
                                value={categoryData.name_uz}
                                name='name_uz'
                                onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item
                            label='Kategoriya nome RU'
                            rules={[
                                {
                                    required: true,
                                    message: 'Katagoriya nomini kiriting!',
                                },
                            ]}
                        >
                            <Input
                                value={categoryData.name_ru}
                                name='name_ru'
                                onChange={handleChange}
                            />
                        </Form.Item>
                        <Form.Item
                            label='Ota kategoriyani tanlang'
                            rules={[
                                {
                                    required: true,
                                    message: 'Katagoriya nomini kiriting!',
                                },
                            ]}
                        >
                            <Select
                                onChange={(e) =>
                                    handleChange({
                                        target: { value: e, name: 'parent_id' },
                                    })
                                }
                                defaultValue={categoryData.parent_id}
                                value={catchSelectedCategory(
                                    response?.categories,
                                    categoryData.parent_id
                                )}
                                options={generateCategoriesList(
                                    response?.categories
                                )}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type='primary' htmlType='submit'>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                    <Collapse defaultActiveKey={['1']} style={{ width: '80%' }}>
                        {response?.categories?.map((item) => (
                            <Panel
                                header={item.name_uz}
                                key={item.id}
                                extra={genExtra(item)}
                            >
                                {!!item?.children?.length ? (
                                    <List
                                        bordered
                                        dataSource={item?.children}
                                        renderItem={(el) => (
                                            <List.Item extra={genExtra(el)}>
                                                {el.name_uz}
                                            </List.Item>
                                        )}
                                    />
                                ) : (
                                    <p>Item content</p>
                                )}
                            </Panel>
                        ))}
                    </Collapse>
                </Row>
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
                <p>Kategoriyani o'chirmoqchimisz?</p>
            </Modal>
        </>
    )
}

export default CategoriesPage
