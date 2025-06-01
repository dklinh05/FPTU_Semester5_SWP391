import Header from "../../components/Header";
import TestimonialBanner from "../components/TestimonialBanner";
import Footer from "../../components/Footer";

function TestimonialLayout({ children }) {
    return (
        <div>
            <Header />
            <TestimonialBanner />
            <div className="row g-4">
                {children}
            </div>
            <Footer />
        </div>
    );
}

export default TestimonialLayout;