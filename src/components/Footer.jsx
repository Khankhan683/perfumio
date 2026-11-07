import { Link } from "react-router-dom";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contact" },
  { name: "My Cart", path: "/cart" },
];

const collections = [
  { name: "Men", path: "/men" },
  { name: "Women", path: "/women" },
  { name: "Kids", path: "/kids" },
  { name: "Special Items", path: "/special-items" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-20 overflow-hidden  bg-neutral-950/80 text-white">
      {/* Soft golden light from the bottom */}
      <div className="pointer-events-none absolute bottom-[-100px] left-1/2 h-40 w-[80%] -translate-x-1/2 rounded-full bg-amber-400/20 blur-[90px] footer-gold-glow" />

      <div className="relative mx-auto max-w-7xl px-5 pb-6 pt-14 sm:px-8 sm:pt-16 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-12">
          {/* Brand */}
          <div className="footer-fade-up">
            <Link
              to="/"
              onClick={scrollToTop}
              className="inline-block font-serif text-3xl font-bold tracking-[0.18em] text-amber-300 transition duration-300 hover:text-amber-200 sm:text-4xl"
            >
              PERFUMIO
            </Link>

            <p className="mt-2 text-[10px] font-medium tracking-[0.35em] text-amber-100/60">
              LUXURY YOU CAN FEEL.
            </p>

            <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-400">
              Discover fragrances that express your personality and leave a
              lasting impression. Find the scent that feels like you.
            </p>

            <p className="mt-5 text-xs tracking-wide text-amber-200/80">
              WHERE EVERY SCENT TELLS A STORY.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-fade-up">
            <h3 className="mb-5 font-serif text-lg text-amber-200">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className="footer-link text-sm text-neutral-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div className="footer-fade-up">
            <h3 className="mb-5 font-serif text-lg text-amber-200">
              Collections
            </h3>

            <ul className="space-y-3">
              {collections.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={scrollToTop}
                    className="footer-link text-sm text-neutral-400"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-fade-up">
            <h3 className="mb-5 font-serif text-lg text-amber-200">
              Get In Touch
            </h3>

            <p className="text-sm leading-6 text-neutral-400">
              Have a question about a fragrance or your order? We'd love to hear
              from you.
            </p>

            <Link
              to="/contact"
              onClick={scrollToTop}
              className="mt-5 inline-flex items-center gap-2 border-b border-amber-400/60 pb-1 text-sm font-medium text-amber-200 transition duration-300 hover:border-amber-200 hover:text-white"
            >
              Contact Our Team
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center sm:mt-14 sm:flex-row sm:text-left">
          <p className="text-xs leading-6 text-neutral-500">
            © {new Date().getFullYear()} PERFUMIO. All rights reserved.
          </p>

          <p className="text-xs tracking-wider text-neutral-500">
            CRAFTED WITH ELEGANCE
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="group flex items-center cursor-pointer
             gap-2 text-xs text-amber-200 transition hover:text-white"
          >
            BACK TO TOP
            <span className="transition-transform duration-300 group-hover:-translate-y-1">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
