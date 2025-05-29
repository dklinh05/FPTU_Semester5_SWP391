import config from '../config';

import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ChangePassword from '../pages/ChangePassword';
import ForgotPassword from '../pages/ForgotPassword';
import ProfileLayout from '../layouts/ProfileLayout';
import CompleteGoogleProfile from '../pages/UpdateLoginGG';

const publicRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.profile, component: Profile },
  { path: config.routes.login, component: Login },
  { path: config.routes.register, component: Register },
  { path: config.routes.changePassword, component: ChangePassword , layout: ProfileLayout},
  { path: config.routes.forgotPassword, component: ForgotPassword },
  { path: config.routes.completeGoogleProfile, component: CompleteGoogleProfile },
];

const privateRoutes = [];

export { privateRoutes, publicRoutes };