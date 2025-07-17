import React, { useState } from 'react';
import styles from './RequestUpgradeRole.module.scss';
import { submitRoleUpgradeRequest } from '../../services/userService';

const RequestUpgradeRole = () => {
  const [businessName, setBusinessName] = useState('');
  const [certification, setCertification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    <div className={styles['background-wrapper']}>
      <div className={styles.card}>
        <h2 className={styles.title}>Yêu cầu nâng cấp tài khoản</h2>
        
        {error && (
          <p className={styles.message} style={{ color: 'red' }}>
            {error}
          </p>
        )}
        
        {success && (
          <p className={styles.message} style={{ color: 'green' }}>
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <label>Tên doanh nghiệp:</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles['form-group']}>
            <label>Giấy phép kinh doanh:</label>
            <input
              type="file"
              onChange={(e) => setCertification(e.target.files[0])}
              required
              className={styles.input}
            />
          </div>

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestUpgradeRole;