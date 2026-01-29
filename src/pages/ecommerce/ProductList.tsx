import { useState } from "react";
import { Table, Card, Button, Input, Space, Tag, Modal, Form, Select, message, InputNumber } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Product, ProductFormData } from "../../types/ecommerce.types";

const mockProducts: Product[] = [
    {
        id: "1",
        name: "Product A",
        price: 100000,
        category: "Category 1",
        status: "active",
    },
    {
        id: "2",
        name: "Product B",
        price: 250000,
        category: "Category 2",
        status: "out_of_stock",
    },
];

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form] = Form.useForm();

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        form.setFieldsValue({
            name: product.name,
            price: product.price,
            category: product.category,
            status: product.status,
        });
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingProduct(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc muốn xóa sản phẩm này?",
            onOk: () => {
                setProducts(products.filter((p) => p.id !== id));
                message.success("Xóa sản phẩm thành công");
            },
        });
    };

    const handleSubmit = (values: ProductFormData) => {
        if (editingProduct) {
            // Update
            setProducts(
                products.map((p) =>
                    p.id === editingProduct.id ? { ...p, ...values } : p
                )
            );
            message.success("Cập nhật sản phẩm thành công");
        } else {
            // Create
            const newProduct: Product = {
                id: Date.now().toString(),
                ...values,
            };
            setProducts([...products, newProduct]);
            message.success("Thêm sản phẩm thành công");
        }
        setIsModalOpen(false);
        form.resetFields();
    };

    const columns: ColumnsType<Product> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "active" ? "green" : "red"}>
                    {status === "active" ? "Còn hàng" : "Hết hàng"}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                </Space>
            ),
        },
    ];

    return (
        <Card
            title="Quản lý Sản Phẩm"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    Thêm Sản Phẩm
                </Button>
            }
        >
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                />
            </div>
            <Table columns={columns} dataSource={products} rowKey="id" />

            <Modal
                title={editingProduct ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="name"
                        label="Tên sản phẩm"
                        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Giá"
                        rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                    >
                        <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value?.replace(/\$\s?|(,*)/g, '') as any} />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Danh mục"
                        rules={[{ required: true, message: "Vui lòng nhập danh mục" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                    >
                        <Select>
                            <Select.Option value="active">Còn hàng</Select.Option>
                            <Select.Option value="out_of_stock">Hết hàng</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default ProductList;
