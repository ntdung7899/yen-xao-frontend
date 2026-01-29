import { useState } from "react";
import { Table, Card, Button, Input, Space, Tag, Modal, Form, Select, message } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { News, NewsFormData } from "../../types/ecommerce.types";

const mockNews: News[] = [
    {
        id: "1",
        title: "News Title 1",
        category: "General",
        publishedDate: "2024-01-20",
        status: "published",
    },
    {
        id: "2",
        title: "Draft News",
        category: "Promotion",
        publishedDate: "-",
        status: "draft",
    },
];

const NewsList = () => {
    const [newsList, setNewsList] = useState<News[]>(mockNews);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<News | null>(null);
    const [form] = Form.useForm();

    const handleEdit = (news: News) => {
        setEditingNews(news);
        form.setFieldsValue({
            title: news.title,
            category: news.category,
            status: news.status,
        });
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingNews(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc muốn xóa tin tức này?",
            onOk: () => {
                setNewsList(newsList.filter((n) => n.id !== id));
                message.success("Xóa tin tức thành công");
            },
        });
    };

    const handleSubmit = (values: NewsFormData) => {
        if (editingNews) {
            // Update
            setNewsList(
                newsList.map((n) =>
                    n.id === editingNews.id ? { ...n, ...values } : n
                )
            );
            message.success("Cập nhật tin tức thành công");
        } else {
            // Create
            const newNews: News = {
                id: Date.now().toString(),
                ...values,
                publishedDate: values.status === 'published' ? new Date().toISOString().split('T')[0] : '-',
            };
            setNewsList([...newsList, newNews]);
            message.success("Thêm tin tức thành công");
        }
        setIsModalOpen(false);
        form.resetFields();
    };

    const columns: ColumnsType<News> = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
        },
        {
            title: "Published Date",
            dataIndex: "publishedDate",
            key: "publishedDate",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "published" ? "blue" : "default"}>
                    {status.toUpperCase()}
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
            title="Quản lý Tin Tức"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    Thêm Tin Tức
                </Button>
            }
        >
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Tìm kiếm tin tức..."
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                />
            </div>
            <Table columns={columns} dataSource={newsList} rowKey="id" />

            <Modal
                title={editingNews ? "Chỉnh sửa Tin tức" : "Thêm Tin tức"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                    >
                        <Input />
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
                            <Select.Option value="published">Published</Select.Option>
                            <Select.Option value="draft">Draft</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default NewsList;
