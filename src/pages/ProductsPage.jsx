import {
    Button,
    Drawer,
    Form,
    Image,
    Input,
    Row,
    Space,
    Table,
    Tabs,
    Modal,
    Upload,
    Select,
    message,
} from 'antd'
import {
    EditOutlined,
    EyeOutlined,
    DeleteOutlined,
} from '@ant-design/icons'
import React, { useState } from 'react'
import PageHeader from '../components/PageHeader'
import {
    addFileUrl,
    attributeListUrl,
    bradndListUrl,
    categoriesListUrl,
    deleteFileUrl,
    getProductDeleteUrl,
    productAddUrl,
    productsListUrl,
} from '../helpers/urls'
import {
    deleteProps,
    generateCategoriesList,
    getEncryptedCode,
    productErrorMessages,
    slugify,
} from '../helpers/helpers'
import { useLoad, usePostRequest } from '../hooks/request'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { MediaAxios } from '../helpers/axios'
import { useDeleteRequest } from './../hooks/request'

const initialProductData = {
    id: null,
    name_uz: '',
    name_ru: '',
    description_uz: '',
    description_ru: '',
    slug: '',
    category_id: null,
    brand_id: null,
    quantity: 0,
    attributes:
        '[{"attribute_id":1,"value_id":2},{"attribute_id":2,"value_id":5}]',
    previous_price: 0,
    price: 0,
    image: '',
    images: '',
    discount: 0,
}

function ProductsPage() {
    const { response, loading, request } = useLoad({ url: productsListUrl })
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [productData, setProductData] = useState(initialProductData)

    const [deleteModal, setDeleteModal] = useState(false)

    const productAddRequest = usePostRequest({ url: productAddUrl })
    const productDeleteRequest = useDeleteRequest()

    const handleOnchange = ({ target }) => {
        const { name, value } = target
        setProductData({
            ...productData,
            [name]: value,
        })
    }

    const handleDeleteButton = (item) => {
        setProductData({ ...productData, id: item.id })
        setDeleteModal(true)
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (item) => {
                return <Image width={80} src={item} />
            },
        },
        {
            title: 'Name',
            dataIndex: 'name_uz',
            key: 'name_uz',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Action',
            key: 'action',
            render: (item, record) => (
                <Space size='middle'>
                    <Button type='default'>
                        <EditOutlined />
                    </Button>
                    <Button type='default'>
                        <EyeOutlined />
                    </Button>
                    <Button
                        type='default'
                        onClick={() => handleDeleteButton(item)}
                    >
                        <DeleteOutlined />
                    </Button>
                </Space>
            ),
        },
    ]

    const tabContent = [
        {
            key: 1,
            label: 'Mahsulot nomi',
            children: (
                <ProductNameProperties
                    handleOnchange={handleOnchange}
                    productData={productData}
                />
            ),
        },
        {
            key: 2,
            label: 'Mahsulot narxlari',
            children: (
                <ProductPriceProperties
                    handleOnchange={handleOnchange}
                    productData={productData}
                />
            ),
        },
        {
            key: 3,
            label: 'Mahsulot rasmi',
            children: (
                <ProductPictureProperties handleOnchange={handleOnchange} />
            ),
        },
        {
            key: 4,
            label: 'Mahsulot kategoriyalari',
            children: (
                <ProductCategoriesProperties handleOnchange={handleOnchange} />
            ),
        },
    ]

    const handleDrawerClose = () => {
        setDrawerOpen(false)
        setProductData(initialProductData)
    }

    const hadnleDrawerOpen = () => {
        setDrawerOpen(true)
    }

    const handleAddButton = async () => {
        for (let item in deleteProps(initialProductData, [
            'id',
            'slug',
            'image',
            'attributes',
        ])) {
            if (productData[item] === initialProductData[item]) {
                return message.error(
                    `Mahsulot ${productErrorMessages[item]} ni to'ldiring!`
                )
            }
        }

        if (productData.id) {
        } else {
            const post_data = deleteProps(productData, ['id'])
            post_data.slug = slugify(post_data.name_uz) 
            post_data.image = post_data.images.split(',')[0]

            const { success, response } = await productAddRequest.request({
                data: post_data,
            })
            if (success && response.isOk) {
                handleDrawerClose() 
                request()
                message.success("Add a new product")
            }
        }
    }

    const handleDeleteModalOk = async () => {
        const { success, response } = await productDeleteRequest.request({
            url: getProductDeleteUrl(productData.id),
        })

        if (success && response.isOk) {
            request()
            handleDeleteModalClose()
            message.success("Mahsulot o'chirildi")
        }
    }

    const handleDeleteModalClose = () => {
        setDeleteModal(false)
        setProductData(initialProductData)
    }

    return (
        <>
            <Row className='container'>
                <PageHeader
                    title='Mahsulotlar'
                    btnTitle="Mahsulot qo'shish"
                    handleClick={hadnleDrawerOpen}
                />
                <Table
                    style={{ width: '100%' }}
                    columns={columns}
                    dataSource={response?.products}
                    loading={loading}
                />
            </Row>

            <Drawer
                width={'80%'}
                title="Mahsulot qo'shish"
                placement='right'
                extra={
                    <Space>
                        <Button type='primary' onClick={handleAddButton}>
                            Add
                        </Button>
                    </Space>
                }
                onClose={handleDrawerClose}
                open={drawerOpen}
            >
                <Tabs tabPosition='left' items={tabContent} />
            </Drawer>

            <Modal
                title="O'chirish"
                cancelText="Yo'q"
                okText='Ha'
                okType='danger'
                centered
                open={deleteModal}
                onOk={handleDeleteModalOk}
                onCancel={handleDeleteModalClose}
            >
                <p>Mahsulotni o'chirmoqchimisz?</p>
            </Modal>
        </>
    )
}

function ProductNameProperties({ handleOnchange, productData }) {
    return (
        <div>
            <Form layout='vertical'>
                <Form.Item label='Mahsulot nomi uz'>
                    <Input
                        placeholder=''
                        name='name_uz'
                        value={productData.name_uz}
                        onChange={handleOnchange}
                    ></Input>
                </Form.Item>
                <Form.Item label='Mahsulot nomi ru'>
                    <Input
                        placeholder=''
                        name='name_ru'
                        value={productData.name_ru}
                        onChange={handleOnchange}
                    ></Input>
                </Form.Item>
                <Form.Item label='Mahsulot tasnifi uz'>
                    <ReactQuill
                        theme='snow'
                        value={productData.description_uz}
                        onChange={(e) =>
                            handleOnchange({
                                target: { value: e, name: 'description_uz' },
                            })
                        }
                    />
                </Form.Item>
                <Form.Item label='Mahsulot tasnifi ru'>
                    <ReactQuill
                        theme='snow'
                        value={productData.description_ru}
                        onChange={(e) =>
                            handleOnchange({
                                target: { value: e, name: 'description_ru' },
                            })
                        }
                    />
                </Form.Item>
            </Form>
        </div>
    )
}

function ProductPriceProperties({ handleOnchange, productData }) {
    return (
        <div>
            <Form layout='vertical'>
                <Form.Item label='Mahsulot narxi'>
                    <Input
                        type='number'
                        name='price'
                        value={productData.price}
                        onChange={handleOnchange}
                        placeholder=''
                    ></Input>
                </Form.Item>
                <Form.Item label='Mahsulot soni'>
                    <Input
                        type='number'
                        placeholder=''
                        name='quantity'
                        value={productData.quantity}
                        onChange={handleOnchange}
                    ></Input>
                </Form.Item>
                <Form.Item label='Mahsulot avvalki narxi'>
                    <Input
                        type='number'
                        placeholder=''
                        name='previous_price'
                        value={productData.previous_price}
                        onChange={handleOnchange}
                    ></Input>
                </Form.Item>
                <Form.Item label='Mahsulot chegirmasi'>
                    <Input
                        type='number'
                        placeholder=''
                        name='discount'
                        value={productData.discount}
                        onChange={handleOnchange}
                    ></Input>
                </Form.Item>
            </Form>
        </div>
    )
}

function ProductPictureProperties({ handleOnchange }) {
    const [fileList, setFileList] = useState([])

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
                        setFileList([])
                        handleOnchange({
                            target: {
                                value: fileList
                                    .map((item) => item.url)
                                    .join(','),
                                name: 'images',
                            },
                        })
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
                        setFileList([
                            ...fileList,
                            {
                                uid: response.data.id,
                                name: file.name,
                                status: 'done',
                                url: response.data.url,
                            },
                        ])
                        handleOnchange({
                            target: {
                                value: fileList
                                    .map((item) => item.url)
                                    .join(','),
                                name: 'images',
                            },
                        })
                    }
                })
                .catch(function (error) {
                    message.error(error.data.message)
                })
        }
    }

    return (
        <>
            <Upload
                listType='picture-card'
                fileList={fileList}
                onChange={onChange}
                // onPreview={onPreview}
            >
                {fileList.length < 4 && '+ Upload'}
            </Upload>
        </>
    )
}

function ProductCategoriesProperties({ handleOnchange }) {
    const categoriesRequest = useLoad({ url: categoriesListUrl })
    const brandsRequest = useLoad({ url: bradndListUrl })
    const attributesRequest = useLoad({ url: attributeListUrl })

    const [selectedAttributes, setSelectedAttributes] = useState([])

    const handleAttributeSelectChange = (arr) => {
        const attributes = attributesRequest?.response?.attributes

        for (let item of attributes) {
            if (arr.includes(item.id)) {
                setSelectedAttributes([...selectedAttributes, item])
            }
        }
    }

    const handleBrandSelect = (e) => {
        handleOnchange({
            target: {
                value: e,
                name: 'brand_id',
            },
        })
    }

    const handleCategorySelect = (e) => {
        handleOnchange({
            target: {
                value: e,
                name: 'category_id',
            },
        })
    }

    return (
        <Space direction='vertical' size='middle' style={{ width: '100%' }}>
            <div>
                <h3>Kategoriya</h3>
                <Select
                    style={{ width: '100%' }}
                    defaultValue={0}
                    onChange={handleCategorySelect}
                    options={generateCategoriesList(
                        categoriesRequest?.response?.categories,
                        true
                    )}
                />
            </div>
            <div>
                <h3>Brand</h3>
                <Select
                    style={{ width: '100%' }}
                    defaultValue={0}
                    onChange={handleBrandSelect}
                    options={generateCategoriesList(
                        brandsRequest?.response?.brands
                    )}
                />
            </div>
            <div>
                <h3>Attributes</h3>
                <Select
                    style={{ width: '100%' }}
                    // defaultValue={0}
                    mode='multiple'
                    onChange={handleAttributeSelectChange}
                    options={generateCategoriesList(
                        attributesRequest?.response?.attributes
                    )}
                />
                <Row style={{ marginTop: '24px  ' }}>
                    {selectedAttributes.map((item) => (
                        <Space
                            direction='vertical'
                            size='middle'
                            style={{ width: '250px', marginRight: '16px' }}
                        >
                            <p>{item?.name_uz}:</p>
                            <Select
                                key={item.id}
                                style={{ width: '100%' }}
                                options={generateCategoriesList(
                                    item?.attributeValues
                                )}
                            />
                        </Space>
                    ))}
                </Row>
            </div>
        </Space>
    )
}

export default ProductsPage
