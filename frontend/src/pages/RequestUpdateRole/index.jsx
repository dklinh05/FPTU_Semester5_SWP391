// RequestUpgradeRole.jsx
import React, { useState } from 'react';
import { submitRoleUpgradeRequest } from '../../services/userService';
import { getUserById } from '../../services/userService';
import { getUserIdFromToken } from '../../services/authService';
// Import userService để kiểm tra user tồn tại

const RequestUpgradeRole = () => {
  const [businessName, setBusinessName] = useState('');
  const [certification, setCertification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // index.jsx
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append("businessName", businessName);
    if (certification) {
        formData.append("certification", certification);
    }

    try {
        await submitRoleUpgradeRequest(formData);
        setSuccess('Yêu cầu nâng cấp đã được gửi thành công! Hãy chờ phê duyệt từ quản trị viên.');
    } catch (err) {
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu.');
    } finally {
        setLoading(false);
    }
};

  return (
    <div>
      <h2>Yêu cầu nâng cấp tài khoản</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên doanh nghiệp:</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Giấy phép kinh doanh:</label>
          <input
            type="file"
            onChange={(e) => setCertification(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </button>
      </form>
    </div>
  );
};

export default RequestUpgradeRole;