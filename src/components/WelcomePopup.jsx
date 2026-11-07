import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { auth, db } from "../firebase";
import { useCart } from "../context/CartContext";

export default function WelcomePopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [popupType, setPopupType] = useState("welcome");

  const { refreshDiscountStatus } = useCart();

  useEffect(() => {
    let timer;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(timer);

      setIsLoggedIn(!!user);
      setShowPopup(false);

      if (!user) {
        // Logout par next login ke liye popup allow karo
        sessionStorage.removeItem("perfumio-discount-popup-shown");

        const hasSeenWelcome = localStorage.getItem("perfumio-welcome-seen");

        if (!hasSeenWelcome) {
          timer = setTimeout(() => {
            setPopupType("welcome");
            setShowPopup(true);
          }, 5000);
        }

        return;
      }

      // Same login session mein refresh par popup dobara nahi dikhana
      const popupAlreadyShown = sessionStorage.getItem(
        "perfumio-discount-popup-shown",
      );

      if (popupAlreadyShown === user.uid) {
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          console.error("User document not found in Firestore.");
          return;
        }

        const userData = userDoc.data();

        if (userData.discountClaimed === true) {
          setPopupType("alreadyClaimed");
        } else {
          await updateDoc(userRef, {
            discountClaimed: true,
          });

          setPopupType("offer");
        }

        await refreshDiscountStatus();

        sessionStorage.setItem("perfumio-discount-popup-shown", user.uid);

        setShowPopup(true);
      } catch (error) {
        console.error("Discount popup error:", error);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [refreshDiscountStatus]);

  function closePopup() {
    setShowPopup(false);

    if (!isLoggedIn) {
      localStorage.setItem("perfumio-welcome-seen", "true");
    }
  }

  if (isLoggedIn === null || !showPopup) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 px-3 py-6 backdrop-blur-md sm:px-5">
      <div className="relative my-auto w-full max-w-md animate-[popupEnter_0.6s_ease-out] overflow-hidden rounded-2xl border border-amber-400/50 bg-neutral-950 p-5 text-center shadow-[0_0_50px_rgba(251,191,36,0.2)] sm:p-8">
        {/* Close button */}
        <button
          onClick={closePopup}
          aria-label="Close popup"
          className="absolute right-4 top-3 text-2xl text-neutral-400 transition hover:text-amber-300"
        >
          ×
        </button>

        <p className="mb-3 text-xs tracking-[0.4em] text-amber-400 sm:text-sm">
          PERFUMIO
        </p>

        {/* First-time discount */}
        {popupType === "offer" && (
          <>
            <div className="mb-4 text-4xl text-amber-300">✦</div>

            <h2 className="mb-3 text-2xl font-bold tracking-wide text-amber-200 sm:text-3xl">
              CONGRATULATIONS!
            </h2>

            <p className="mb-6 text-sm leading-6 text-neutral-400">
              Your exclusive welcome discount has been claimed successfully.
            </p>

            <div className="mb-6 rounded-xl border border-amber-400/40 bg-amber-400/5 px-4 py-6 sm:mb-7 sm:py-7">
              <p className="text-xs font-semibold tracking-widest text-amber-300 sm:text-sm">
                YOUR EXCLUSIVE OFFER
              </p>

              <h3 className="my-2 text-6xl font-extrabold text-amber-300 sm:text-7xl">
                15%
              </h3>

              <p className="text-base font-semibold text-white sm:text-lg">
                OFF YOUR FIRST ORDER
              </p>

              <p className="mt-3 text-xs text-neutral-400">
                Apply your discount in the cart.
              </p>
            </div>
          </>
        )}

        {/* Already claimed */}
        {popupType === "alreadyClaimed" && (
          <>
            <div className="mb-4 text-4xl text-amber-300">✓</div>

            <h2 className="mb-4 text-2xl font-bold text-amber-200 sm:text-3xl">
              DISCOUNT ALREADY CLAIMED!
            </h2>

            <div className="mb-6 rounded-xl border border-amber-400/40 bg-amber-400/5 px-4 py-6 sm:mb-7">
              <h3 className="mb-3 text-6xl font-extrabold text-amber-300">
                15%
              </h3>

              <p className="text-base font-semibold text-white sm:text-lg">
                You have already claimed your 15% discount!
              </p>

              <p className="mt-3 text-sm leading-6 text-neutral-400">
                Your discount is waiting for you in your cart, as long as it has
                not been used.
              </p>
            </div>
          </>
        )}

        {/* Guest welcome popup */}
        {popupType === "welcome" && (
          <>
            <h2 className="mb-3 text-2xl font-bold tracking-wide text-amber-200 sm:text-3xl">
              WELCOME TO LUXURY
            </h2>

            <p className="mb-6 text-sm leading-6 text-neutral-400">
              Discover your signature fragrance and experience the luxury you
              deserve.
            </p>

            <div className="mb-6 rounded-xl border border-amber-400/40 bg-amber-400/5 px-4 py-6 sm:mb-7">
              <p className="text-xs font-semibold tracking-widest text-amber-300 sm:text-sm">
                EXCLUSIVE WELCOME OFFER
              </p>

              <h3 className="my-2 text-6xl font-extrabold text-amber-300 sm:text-7xl">
                15%
              </h3>

              <p className="text-base font-semibold text-white sm:text-lg">
                OFF YOUR FIRST ORDER
              </p>
            </div>

            <Link
              to="/auth?mode=signup"
              onClick={closePopup}
              className="block w-full rounded-full bg-amber-300 px-6 py-3.5 text-sm font-bold tracking-wider text-black transition duration-300 hover:scale-[1.02] hover:bg-amber-200 sm:py-4"
            >
              SIGN UP NOW
            </Link>
          </>
        )}

        <button
          onClick={closePopup}
          className="mt-5 text-sm text-neutral-400 transition hover:text-white"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
