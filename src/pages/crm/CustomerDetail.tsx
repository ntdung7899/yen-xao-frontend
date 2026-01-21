import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockCustomers, mockCustomerHistory } from '../../data/mockAuthData';
import { PermissionGuard } from '../../components/guards/PermissionGuard';

export const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer] = useState(() => mockCustomers.find((c) => c.id === id));
  const [history] = useState(() => mockCustomerHistory.filter((h) => h.customerId === id));

  if (!customer) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          Không tìm thấy khách hàng
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chi tiết khách hàng</h1>
        <p className="text-gray-600">{customer.code}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Tên khách hàng</label>
              <p className="text-gray-900 font-medium">{customer.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{customer.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Điện thoại</label>
              <p className="text-gray-900">{customer.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Công ty</label>
              <p className="text-gray-900">{customer.company || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Trạng thái</label>
              <p className="text-gray-900 capitalize">{customer.status}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Ưu tiên</label>
              <p className="text-gray-900 capitalize">{customer.priority}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Người phụ trách</label>
              <p className="text-gray-900">{customer.assignedToName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Tổng giá trị</label>
              <p className="text-gray-900 font-bold">{customer.totalValue.toLocaleString('vi-VN')} đ</p>
            </div>
          </div>

          {customer.notes && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-500">Ghi chú</label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded">{customer.notes}</p>
            </div>
          )}

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-500">Tags</label>
            <div className="flex gap-2 mt-1">
              {customer.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <PermissionGuard requiredPermissions={['crm:edit_customer']}>
            <div className="mt-6 flex gap-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                ✏️ Chỉnh sửa
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                📧 Gửi email
              </button>
            </div>
          </PermissionGuard>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Thống kê</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Tổng giao dịch</p>
              <p className="text-2xl font-bold text-blue-600">{customer.totalValue.toLocaleString('vi-VN')} đ</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Lịch sử</p>
              <p className="text-2xl font-bold text-green-600">{history.length} hoạt động</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Ngày tạo</p>
              <p className="text-sm font-medium text-purple-600">
                {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <PermissionGuard requiredPermissions={['crm:view_customer_history']}>
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📜 Lịch sử hoạt động</h2>
          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{h.description}</p>
                      <p className="text-sm text-gray-600">
                        Bởi: {h.performedByName} • {new Date(h.timestamp).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{h.action}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Chưa có lịch sử hoạt động</p>
          )}
        </div>
      </PermissionGuard>
    </div>
  );
};
