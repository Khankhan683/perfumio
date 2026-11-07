import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { useCart } from "../context/CartContext";
import { auth } from "../firebase";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navbarRef = useRef(null);
  const location = useLocation();
  const { cartCount } = useCart();

  const categories = [
    { name: "Men", path: "/men" },
    { name: "Women", path: "/women" },
    { name: "Kids", path: "/kids" },
    { name: "Special Items", path: "/special-items" },
  ];

  // Firebase authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Route change par dropdown close
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Outside click par dropdown close
  useEffect(() => {
    function handleOutsideClick(event) {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  // Sign Out
  async function handleSignOut() {
    try {
      await signOut(auth);
      setIsProfileOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Sign out error:", error.message);
    }
  }

  // User initial
  const userInitial =
    user?.displayName?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  // User color based on Firebase UID
  function getUserColor(uid) {
    const colors = [
      "bg-purple-600",
      "bg-blue-600",
      "bg-emerald-600",
      "bg-rose-600",
      "bg-orange-600",
      "bg-indigo-600",
      "bg-pink-600",
      "bg-teal-600",
    ];

    let hash = 0;

    for (let i = 0; i < uid.length; i++) {
      hash = uid.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  }

  const userColor = user ? getUserColor(user.uid) : "bg-neutral-900";

  const linkClass =
    "block w-full rounded-lg px-4 py-3 text-sm transition duration-200 hover:bg-neutral-800 hover:text-amber-200";

  return (
    <nav
      ref={navbarRef}
      className="relative z-50 w-full bg-transparent px-3 py-3 text-white sm:px-5 md:px-6"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
        {/* Logo */}
        <Link to="/" aria-label="Perfumio Home" className="shrink-0">
          <img
            src="/perfumio-logo.png"
            alt="Perfumio - Luxury You Can Feel"
            className="h-auto w-28 object-contain sm:w-36 lg:w-44"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center lg:flex">
          <Link
            to="/"
            className={`border-r border-neutral-600 px-4 text-sm transition hover:text-amber-300 ${
              location.pathname === "/" ? "text-amber-300" : ""
            }`}
          >
            Home
          </Link>

          <Link
            to="/about"
            className="border-r border-neutral-600 px-4 text-sm transition hover:text-amber-300"
          >
            About Us
          </Link>

          <Link
            to="/contact"
            className="px-4 text-sm transition hover:text-amber-300"
          >
            Contact
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Desktop Authentication */}
          {!user ? (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                to="/auth?mode=signup"
                className="rounded-full bg-amber-300 px-4 py-2 text-sm font-bold text-black transition hover:bg-amber-200"
              >
                Sign Up
              </Link>

              <Link
                to="/auth?mode=signin"
                className="rounded-full border border-amber-400 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-400 hover:text-black"
              >
                Sign In
              </Link>
            </div>
          ) : (
            /* User Profile */
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen((prev) => !prev);
                  setIsMenuOpen(false);
                }}
                aria-expanded={isProfileOpen}
                aria-label="Open user profile"
                className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-amber-300 sm:h-10 sm:w-10 ${userColor} text-base font-bold text-white shadow-lg transition hover:scale-105 sm:text-lg`}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  userInitial
                )}
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="fixed right-3 top-[75px] z-[100] w-64 max-w-[calc(100vw-24px)] max-h-[calc(100dvh-90px)] overflow-y-auto rounded-xl border border-amber-400/40 bg-neutral-950/80 p-4 shadow-2xl sm:absolute sm:right-0 sm:top-full sm:mt-3 sm:w-72 sm:max-h-[70dvh]">
                  <div className="mb-4 border-b border-neutral-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-amber-300 ${userColor} font-bold text-white`}
                      >
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          userInitial
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-amber-200">
                          {user.displayName || "Perfumio User"}
                        </p>

                        <p className="truncate text-xs text-neutral-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link to="/" className={linkClass}>
                    Home
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-2 w-full rounded-lg px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            aria-label={`Shopping cart with ${cartCount} items`}
            className="relative flex items-center gap-1.5 rounded-full border border-amber-400 px-2.5 py-2 text-amber-300 transition hover:bg-amber-400 hover:text-black sm:px-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>

            <span className="hidden text-sm font-semibold sm:inline">Cart</span>

            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-300 px-1 text-xs font-bold text-black">
              {cartCount}
            </span>
          </Link>

          {/* Menu Button */}
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
              setIsProfileOpen(false);
            }}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="flex items-center gap-2 rounded-full border border-amber-400 px-2.5 py-2 text-amber-300 transition hover:bg-amber-400 hover:text-black sm:px-3"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>

            <span className="hidden text-sm lg:inline">Menu</span>

            <span className="hidden lg:inline">{isMenuOpen ? "⌃" : "⌄"}</span>
          </button>
        </div>
      </div>

      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute right-3 top-full z-50 mt-2 max-h-[75vh] w-64 max-w-[calc(100vw-24px)] overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-950 p-2 shadow-2xl sm:right-6 sm:w-72">
          {/* Mobile Navigation */}
          <div className="border-b border-neutral-700 pb-2 lg:hidden">
            <Link to="/" className={linkClass}>
              Home
            </Link>

            <Link to="/about" className={linkClass}>
              About Us
            </Link>

            <Link to="/contact" className={linkClass}>
              Contact
            </Link>
          </div>

          {/* Mobile Authentication */}
          {!user && (
            <div className="grid grid-cols-2 gap-2 border-b border-neutral-700 py-3 lg:hidden">
              <Link
                to="/auth?mode=signup"
                className="rounded-lg bg-amber-300 px-3 py-2.5 text-center text-sm font-bold text-black transition hover:bg-amber-200"
              >
                Sign Up
              </Link>

              <Link
                to="/auth?mode=signin"
                className="rounded-lg border border-amber-400 px-3 py-2.5 text-center text-sm font-semibold text-amber-300 transition hover:bg-amber-400 hover:text-black"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Categories */}
          <div className="pt-2">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className={linkClass}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
