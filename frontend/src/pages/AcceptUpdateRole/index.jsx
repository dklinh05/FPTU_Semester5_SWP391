import React, { useEffect, useState } from 'react';
import {
  getRoleUpgradeRequestsByStatus,
  approveRoleUpgrade,
  rejectRoleUpgrade,
} from '../../services/adminService';
import './AcceptUpdateRole.scss'; // Import CSS styles

const AcceptUpgradeRole = () => {
  const [requests, setRequests] = useState([]);
  const [adminNotes, setAdminNotes] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await getRoleUpgradeRequestsByStatus('PENDING');
      console.log('Phản hồi từ API:', response);
      const data = response.data;
      console.log('Dữ liệu:', data);
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        console.error('Dữ liệu không đúng:', data);
        setRequests([]);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách:', err);
      setRequests([]);
    }
  };

  const handleApprove = async (requestId) => {
    const note = adminNotes[requestId] || '';
    try {
      setLoading(true);
      await approveRoleUpgrade(requestId, note);
      alert('Phê duyệt thành công');
      fetchPendingRequests();
    } catch (err) {
      alert('Không thể phê duyệt: ' + (err.message || 'Lỗi không xác định'));
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
      fetchPendingRequests();
    } catch (err) {
      alert('Không thể từ chối: ' + (err.message || 'Lỗi không xác định'));
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
    <div className="accept-upgrade-container">
      <h2 className="title-block">Duyệt Yêu Cầu Nâng Cấp Tài Khoản</h2>
      {requests.length === 0 && (
        <p className="no-requests">
          Không có yêu cầu nào đang chờ xử lý.
        </p>
      )}
      {requests.map((req) => (
        <div key={req.requestID} className="request-card">
          <p className="request-info">
            <strong>ID người dùng:</strong> {req.user.userID}
          </p>
          <p className="request-info">
            <strong>Tên doanh nghiệp:</strong> {req.businessName}
          </p>
          <p className="request-info">
            <strong>Trạng thái:</strong>{' '}
            <span className={req.status === 'PENDING' ? 'status-pending' : ''}>
              {req.status}
            </span>
          </p>

          {req.certification && (
            <div className="certification-section">
              <p className="certification-title">Chứng nhận:</p>
              <img
                src={req.certification}
                alt="Certification"
                className="certification-image"
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/path/to/fallback-image.jpg';
                  e.target.alt = 'Không thể tải ảnh chứng nhận';
                }}
              />
            </div>
          )}

          <textarea
            placeholder="Ghi chú của admin..."
            value={adminNotes[req.requestID] || ''}
            onChange={(e) => handleChangeNote(req.requestID, e.target.value)}
            className="admin-note"
          />

          <div className="button-group">
            <button
              onClick={() => handleApprove(req.requestID)}
              disabled={loading}
              className={`action-button approve-button ${loading ? 'disabled' : ''}`}
            >
              {loading ? 'Đang xử lý...' : 'Phê duyệt'}
            </button>
            <button
              onClick={() => handleReject(req.requestID)}
              disabled={loading}
              className={`action-button reject-button ${loading ? 'disabled' : ''}`}
            >
              {loading ? 'Đang xử lý...' : 'Từ chối'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AcceptUpgradeRole;