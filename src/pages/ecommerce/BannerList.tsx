import { useState } from "react";
import { Table, Card, Button, Input, Space, Tag, Modal, Form, Select, message } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Banner, BannerFormData } from "../../types/ecommerce.types";

const mockBanners: Banner[] = [
    {
        id: "1",
        title: "Summer Sale",
        imageUrl: "https://via.placeholder.com/150",
        status: "active",
    },
    {
        id: "2",
        title: "New Arrivals",
        imageUrl: "https://via.placeholder.com/150",
        status: "active",
    },
];

const BannerList = () => {
    const [banners, setBanners] = useState<Banner[]>(mockBanners);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [form] = Form.useForm();

    const handleEdit = (banner: Banner) => {
        setEditingBanner(banner);
        form.setFieldsValue({
            title: banner.title,
            imageUrl: banner.imageUrl,
            status: banner.status,
        });
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingBanner(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc muốn xóa banner này?",
            onOk: () => {
                setBanners(banners.filter((b) => b.id !== id));
                message.success("Xóa banner thành công");
            },
        });
    };

    const handleSubmit = (values: BannerFormData) => {
        if (editingBanner) {
            // Update
            setBanners(
                banners.map((b) =>
                    b.id === editingBanner.id ? { ...b, ...values } : b
                )
            );
            message.success("Cập nhật banner thành công");
        } else {
            // Create
            const newBanner: Banner = {
                id: Date.now().toString(),
                ...values,
            };
            setBanners([...banners, newBanner]);
            message.success("Thêm banner thành công");
        }
        setIsModalOpen(false);
        form.resetFields();
    };

    const columns: ColumnsType<Banner> = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Image",
            dataIndex: "imageUrl",
            key: "imageUrl",
            render: (url) => <img src={url} alt="banner" style={{ height: 50 }} />,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "active" ? "green" : "red"}>
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
            title="Quản lý Banner"
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    Thêm Banner
                </Button>
            }
        >
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Tìm kiếm banner..."
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                />
            </div>
            <Table columns={columns} dataSource={banners} rowKey="id" />

            <Modal
                title={editingBanner ? "Chỉnh sửa Banner" : "Thêm Banner"}
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
                        name="imageUrl"
                        label="URL Hình ảnh"
                        rules={[{ required: true, message: "Vui lòng nhập URL hình ảnh" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                    >
                        <Select>
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="inactive">Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default BannerList;
