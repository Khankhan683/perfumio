import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ProductList from "./components/ProductList";
import WelcomePopup from "./components/WelcomePopup";
import Footer from "./components/Footer";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Kids from "./pages/Kids";
import SpecialItems from "./pages/SpecialItems";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Auth from "./pages/Auth";

function Home() {
  return (
    <>
      <HeroSection />
      <ProductList />
      <AboutUs showScratch={false} />
    </>
  );
}

export default function App() {
  const location = useLocation();

  const hideFooter = ["/auth", "/checkout", "/order-success"].includes(
    location.pathname,
  );
  return (
    <div className="relative min-h-screen bg-[url('/YOUR-IMAGE-NAME.png')] bg-cover bg-center bg-fixed bg-no-repeat">
      <Navbar />
      <WelcomePopup />

      <div className="relative min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/special-items" element={<SpecialItems />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          <Route
            path="*"
            element={
              <div className="flex min-h-[60vh] items-center justify-center px-4 text-center text-white">
                <div>
                  <h1 className="text-4xl font-bold text-amber-200">404</h1>
                  <p className="mt-3 text-neutral-400">
                    Sorry, this page was not found.
                  </p>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
}
