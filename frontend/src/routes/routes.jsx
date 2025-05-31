import config from '../config';

import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ChangePassword from '../pages/ChangePassword';
import ForgotPassword from '../pages/ForgotPassword';
import CompleteGoogleProfile from '../pages/UpdateLoginGG';
import Product from '../pages/Product';
import Shop from '../pages/Shop';
import ProfileLayout from '../layouts/ProfileLayout';
import ShopLayout from '../layouts/ShopLayout';
import ProductLayout from '../layouts/ProductLayout';


const publicRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.profile, component: Profile },
  { path: config.routes.login, component: Login },
  { path: config.routes.register, component: Register },
  { path: config.routes.changePassword, component: ChangePassword },
  { path: config.routes.forgotPassword, component: ForgotPassword },
  { path: config.routes.completeGoogleProfile, component: CompleteGoogleProfile },
  { path: config.routes.shop, component: Shop , layout: ShopLayout},
  { path: config.routes.product, component: Product , layout: ProductLayout},
];

const privateRoutes = [];

export { privateRoutes, publicRoutes };