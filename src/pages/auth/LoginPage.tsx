import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { TEST_CREDENTIALS } from '../../data/mockAuthData';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
      }
      setLoading(false);
    }, 500);
  };

  const quickLogin = (role: keyof typeof TEST_CREDENTIALS) => {
    const cred = TEST_CREDENTIALS[role];
    setUsername(cred.username);
    setPassword(cred.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏢</div>
          <h1 className="text-3xl font-bold text-gray-800">CRM + HR System</h1>
          <p className="text-gray-600 mt-2">Đăng nhập để tiếp tục</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                🚫 {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '🔄 Đang đăng nhập...' : '🔐 Đăng nhập'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-4 text-center">
              📝 Tài khoản demo (Click để điền nhanh):
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => quickLogin('admin')}
                className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 text-sm font-medium transition-colors"
              >
                👑 Admin
              </button>
              <button
                onClick={() => quickLogin('crm_manager')}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 text-sm font-medium transition-colors"
              >
                👔 CRM Manager
              </button>
              <button
                onClick={() => quickLogin('sale')}
                className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm font-medium transition-colors"
              >
                💼 Sale
              </button>
              <button
                onClick={() => quickLogin('hr_manager')}
                className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 text-sm font-medium transition-colors"
              >
                🧑‍💼 HR Manager
              </button>
              <button
                onClick={() => quickLogin('hr_staff')}
                className="px-4 py-2 bg-pink-100 text-pink-800 rounded-lg hover:bg-pink-200 text-sm font-medium col-span-2 transition-colors"
              >
                📋 HR Staff
              </button>
            </div>
          </div>

          {/* Test Credentials Table */}
          <div className="mt-6">
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-800 font-medium">
                Xem thông tin đăng nhập
              </summary>
              <div className="mt-3 bg-gray-50 rounded-lg p-4 space-y-2">
                {Object.entries(TEST_CREDENTIALS).map(([role, cred]) => (
                  <div key={role} className="flex justify-between text-xs">
                    <span className="font-mono font-medium">{cred.username}</span>
                    <span className="font-mono text-gray-600">{cred.password}</span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>© 2026 CRM + HR System • Mock Data Only</p>
        </div>
      </div>
    </div>
  );
};
