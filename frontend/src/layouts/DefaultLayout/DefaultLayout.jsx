import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import ModalSearch from '../components/ModalSearch';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import ShopStart from '../components/ShopStart';
import Footer from '../../components/Footer';
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
            {/* <Spinner/> */}
            <Header account_name={account_name || undefined} />
            <ModalSearch/>
            <Hero/>
            <FeatureSection/>
            <ShopStart/>
            <div className={cx('container')}>
                <div className={cx('content')}>
                    {children}
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default DefaultLayout;
