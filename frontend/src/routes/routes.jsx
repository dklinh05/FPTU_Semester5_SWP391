import config from "../config";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ChangePassword from "../pages/ChangePassword";
import ForgotPassword from "../pages/ForgotPassword";
import CompleteGoogleProfile from "../pages/UpdateLoginGG";
import Product from "../pages/Product";
import Shop from "../pages/Shop";
import Contact from "../pages/Contact";
import Cart from "../pages/Cart";
import Testimonial from "../pages/Testimonial";
import CustomerManagement from "../pages/CustomerManagement";
import Dashboard from "../pages/Dashboard";
import AddProduct from "../pages/AddProduct";
import ListProduct from "../pages/ListProduct";
import TestimonialLayout from "../layouts/TestimonialLayout";
import ProfileLayout from "../layouts/ProfileLayout";
import ShopLayout from "../layouts/ShopLayout";
import ContactLayout from "../layouts/ContactLayout";
import ProductLayout from "../layouts/ProductLayout";
import CartLayout from "../layouts/CartLayout";
import AdminLayout from "../layouts/AdminLayout";
import OrdersLayout from "../layouts/OrdersLayout"
import OrderList from "../pages/OrderList";
import UserList from "../pages/UserList";
import RequestUpdateRole from '../pages/RequestUpdateRole/index.jsx';
import Checkout from '../pages/Checkout';
import RequestProduct from '../pages/RequestProduct';
import Feedback from '../pages/Feedback';
import Orders from '../pages/Orders';
import OrdersNotPayment from '../pages/OrdersNotPayment';
import CustomerList from "../pages/CustomerList";
import SupplierList from "../pages/SupplierList";
import ShipperList from "../pages/ShipperList";
import ProductSearch from "../pages/ProductSearch";
import SearchResultLayout from "../layouts/SearchResultLayout/index.js";



const publicRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.profile, component: Profile, layout: ProfileLayout },
  { path: config.routes.login, component: Login, layout: null },
  { path: config.routes.register, component: Register, layout: null },
  {
    path: config.routes.changePassword,
    component: ChangePassword,
    layout: ProfileLayout,
  },
  {
    path: config.routes.forgotPassword,
    component: ForgotPassword,
    layout: null,
  },
  {
    path: config.routes.completeGoogleProfile,
    component: CompleteGoogleProfile,
  },
  { path: config.routes.shop, component: Shop, layout: ShopLayout },
  { path: config.routes.cart, component: Cart, layout: CartLayout },
  {
    path: config.routes.testimonial,
    component: Testimonial,
    layout: TestimonialLayout,
  },
  { path: config.routes.contact, component: Contact, layout: ContactLayout },
  { path: config.routes.product, component: Product, layout: ProductLayout },
  {
    path: config.routes.customerManagement,
    component: CustomerManagement,
    layout: AdminLayout,
  },
  { path: config.routes.dashboard, component: Dashboard, layout: AdminLayout },
  {
    path: config.routes.addProduct,
    component: AddProduct,
    layout: AdminLayout,
  },
  {
    path: config.routes.listProduct,
    component: ListProduct,
    layout: AdminLayout,
  },
  { path: config.routes.orderList, component: OrderList, layout: AdminLayout },
  { path: config.routes.userList, component: UserList, layout: AdminLayout },
  { path: config.routes.requestupdaterole, component: RequestUpdateRole, layout: AdminLayout },
  { path: config.routes.checkout, component: Checkout, layout: null },
  {
    path: config.routes.requestProduct,
    component: RequestProduct,
    layout: AdminLayout,
  },
  { path: config.routes.feedback, component: Feedback, layout: null },

  { path: config.routes.orders, component: Orders, layout: OrdersLayout },
  {
    path: config.routes.ordersPending,
    component: OrdersNotPayment,
    layout: OrdersLayout,
  },
  {
    path: config.routes.shipperList,
    component: ShipperList,
    layout: AdminLayout,
  },
  {
    path: config.routes.customerList,
    component: CustomerList,
    layout: AdminLayout,
  },
  {
    path: config.routes.supplierList,
    component: SupplierList,
    layout: AdminLayout,
  },
  { path: config.routes.productSearch, component: ProductSearch, layout: null },
];

const privateRoutes = [];

export { privateRoutes, publicRoutes };
