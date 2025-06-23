// src/components/AcceptUpgradeRole.jsx
import React, { useEffect, useState } from 'react';
import {
  getRoleUpgradeRequestsByStatus,
  approveRoleUpgrade,
  rejectRoleUpgrade,
} from '../../services/adminService';

const AcceptUpgradeRole = () => {
  const [requests, setRequests] = useState([]);
  const [adminNotes, setAdminNotes] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const data = await getRoleUpgradeRequestsByStatus('PENDING');
      setRequests(data);
    } catch (err) {
      console.error('Lỗi tải danh sách yêu cầu:', err);
    }
  };

  const handleApprove = async (requestId) => {
    const note = adminNotes[requestId] || '';
    try {
      setLoading(true);
      await approveRoleUpgrade(requestId, note);
      alert('Phê duyệt thành công');
      fetchPendingRequests(); // Làm mới danh sách
    } catch (err) {
      alert('Không thể phê duyệt yêu cầu: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    const note = adminNotes[requestId] || '';
    try {
      setLoading(true);
      await rejectRoleUpgrade(requestId, note);
      alert('Từ chối thành công');
      fetchPendingRequests(); // Làm mới danh sách
    } catch (err) {
      alert('Không thể từ chối yêu cầu: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNote = (requestId, value) => {
    setAdminNotes((prev) => ({
      ...prev,
      [requestId]: value,
    }));
  };

  return (
    <div className="accept-upgrade-role">
      <h2>Duyệt yêu cầu nâng cấp tài khoản</h2>
      {requests.length === 0 && <p>Không có yêu cầu nào đang chờ xử lý.</p>}
      {requests.map((req) => (
        <div key={req.requestID} className="request-card">
          <p><strong>ID người dùng:</strong> {req.user.userID}</p>
          <p><strong>Tên doanh nghiệp:</strong> {req.businessName}</p>
          <p><strong>Trạng thái:</strong> {req.status}</p>

          <textarea
            placeholder="Ghi chú của admin..."
            value={adminNotes[req.requestID] || ''}
            onChange={(e) => handleChangeNote(req.requestID, e.target.value)}
            style={{ width: '100%', height: '60px', marginBottom: '10px' }}
          />

          <button onClick={() => handleApprove(req.requestID)} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Phê duyệt'}
          </button>
          <button onClick={() => handleReject(req.requestID)} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Từ chối'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AcceptUpgradeRole;