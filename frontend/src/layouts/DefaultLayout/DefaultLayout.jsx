import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Header from '../../components/Header';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const [account_name, setAccountName] = useState(null);

    useEffect(() => {
        const userJSON = localStorage.getItem('user');
        if (userJSON) {
            try {
                const user = JSON.parse(userJSON);
                setAccountName(user.username);
            } catch {
                setAccountName(null);
            }
        } else {
            setAccountName(null);
        }
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
