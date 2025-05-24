import config from '../config';

import Home from '../pages/Home';
import Profile from '../pages/Profile';


const publicRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.profile, component: Profile },
];

const privateRoutes = [];

export { privateRoutes, publicRoutes };