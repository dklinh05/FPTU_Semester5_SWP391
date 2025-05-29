import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Header from '../../components/Header';
import { useEffect, useState } from 'react';
import { getUserById } from '../../services/userService';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const [account_name, setAccountName] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('user');
        
         const fetchUser = async () => {
              try {
                const data = await getUserById(userId);
                setAccountName(data.fullName);
              } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
              }
            };
        
            if (userId) fetchUser();
    }, []);



    return (
        <div className={cx('wrapper')}>
            <Header account_name={account_name || undefined} />
            <div className={cx('container')}>
                <div className={cx('content')}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;
