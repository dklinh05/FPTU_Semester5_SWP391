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
   

    return (
        <div className={cx('wrapper')}>
            {/* <Spinner/> */}
            <Header />
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
