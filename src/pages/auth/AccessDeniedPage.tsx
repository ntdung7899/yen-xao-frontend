import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const AccessDeniedPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl mb-6">🚫</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Truy cập bị từ chối</h1>
        <p className="text-lg text-gray-600 mb-8">
          Bạn không có quyền truy cập trang này
        </p>

        {user && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <p className="text-sm text-gray-600">Đang đăng nhập với vai trò:</p>
            <p className="text-lg font-bold text-gray-800 mt-1">
              {user.fullName} ({user.role})
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            🏠 Về trang chủ
          </Link>
          <Link
            to="/login"
            className="block w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700"
          >
            🔐 Đăng nhập lại
          </Link>
        </div>
      </div>
    </div>
  );
};
