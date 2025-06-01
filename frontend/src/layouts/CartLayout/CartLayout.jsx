import Header from "../../components/Header";
import CartBanner from "../components/CartBanner";
import Footer from "../../components/Footer";

function CartLayout({ children }) {
    return (
        <div>
            <Header />
            <CartBanner />
            <div className="row g-4">
                {children}
            </div>
            <Footer />
        </div>
    );
}

export default CartLayout;