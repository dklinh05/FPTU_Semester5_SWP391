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
import Contact from '../pages/Contact';
import Cart from '../pages/Cart';
import Testimonial from '../pages/Testimonial';
import TestimonialLayout from '../layouts/TestimonialLayout';
import ProfileLayout from '../layouts/ProfileLayout';
import ShopLayout from '../layouts/ShopLayout';
import ContactLayout from '../layouts/ContactLayout';
import ProductLayout from '../layouts/ProductLayout';
import CartLayout from '../layouts/CartLayout';



const publicRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.profile, component: Profile , layout: ProfileLayout},
  { path: config.routes.login, component: Login,  layout: null },
  { path: config.routes.register, component: Register, layout: null },
  { path: config.routes.changePassword, component: ChangePassword },
  { path: config.routes.forgotPassword, component: ForgotPassword },
  { path: config.routes.completeGoogleProfile, component: CompleteGoogleProfile },
  { path: config.routes.shop, component: Shop, layout: ShopLayout },
  { path: config.routes.cart, component: Cart, layout: CartLayout},
  { path: config.routes.testimonial, component: Testimonial, layout: TestimonialLayout},
  { path: config.routes.contact, component: Contact, layout: ContactLayout},
  { path: config.routes.product, component: Product, layout: ProductLayout },
];

const privateRoutes = [];

export { privateRoutes, publicRoutes };