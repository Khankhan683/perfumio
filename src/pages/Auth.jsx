import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

function Auth() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const mode = searchParams.get("mode");

  const [isSignup, setIsSignup] = useState(mode !== "signin");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState("");

  // Keep form synchronized with URL
  useEffect(() => {
    setIsSignup(mode !== "signin");
    setError("");
  }, [mode]);

  // Switch between signup and signin
  function switchMode(signup) {
    setSearchParams({
      mode: signup ? "signup" : "signin",
    });

    setError("");
  }

  // Authentication
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (isSignup && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (isSignup && formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password,
        );

        await updateProfile(userCredential.user, {
          displayName: formData.fullName,
        });

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          discountPercent: 15,
          discountUsed: false,
          eligible: true,
          createdAt: serverTimestamp(),
        });

        setSuccessType("signup");
        setShowSuccess(true);
      } else {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password,
        );

        setSuccessType("signin");
        setShowSuccess(true);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-neutral-801/3550 px-4 py-12 text-white">
      <div className="mx-auto max-w-md">
        {/* Brand */}
        <h1 className="mb-3 text-center text-4xl font-bold tracking-widest text-amber-300">
          PERFUMIO
        </h1>

        {/* Discount Offer */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-amber-200">GET 15% OFF</h2>

          <p className="mt-2 text-sm text-neutral-400">
            Create your account and unlock an exclusive welcome discount on your
            first order.
          </p>
        </div>

        {/* Authentication Card */}
        <div className="rounded-2xl border border-amber-400/40 bg-neutral-801/355 p-6 shadow-2xl">
          {/* Signup / Signin Switch */}
          <div className="mb-8 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`rounded-lg py-3 font-semibold transition ${
                isSignup
                  ? "bg-amber-300 text-black"
                  : "border border-neutral-700 text-neutral-300"
              }`}
            >
              Sign Up
            </button>

            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`rounded-lg py-3 font-semibold transition ${
                !isSignup
                  ? "bg-amber-300 text-black"
                  : "border border-neutral-700 text-neutral-300"
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Heading */}
          <h2 className="mb-6 text-center text-2xl font-bold">
            {isSignup ? "Create Your Account" : "Welcome Back"}
          </h2>

          {/* Error Message */}
          {error && (
            <p className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            {isSignup && (
              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fullName: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-neutral-700 bg-black px-4 py-3 outline-none transition focus:border-amber-300"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm text-neutral-300">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-neutral-700 bg-black px-4 py-3 outline-none transition focus:border-amber-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm text-neutral-300">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-neutral-700 bg-black px-4 py-3 outline-none transition focus:border-amber-300"
              />
            </div>

            {/* Confirm Password */}
            {isSignup && (
              <div>
                <label className="mb-2 block text-sm text-neutral-300">
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="Confirm your password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-neutral-700 bg-black px-4 py-3 outline-none transition focus:border-amber-300"
                />
              </div>
            )}

            {/* Forgot Password */}
            {!isSignup && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-amber-300 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-amber-300 py-3 font-bold text-black transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "PLEASE WAIT..."
                : isSignup
                  ? "CREATE ACCOUNT"
                  : "SIGN IN"}
            </button>
          </form>

          {/* Google Login */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-700"></div>
            <span className="text-sm text-neutral-500">OR</span>
            <div className="h-px flex-1 bg-neutral-700"></div>
          </div>

          <button
            type="button"
            className="w-full rounded-lg border border-neutral-600 py-3 font-medium transition hover:border-amber-300 hover:text-amber-300"
          >
            Continue with Google
          </button>
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-black/80 px-3 py-4 backdrop-blur-md sm:px-5">
          <div className="my-auto w-full max-w-md animate-[popupEnter_0.6s_ease-out] rounded-2xl border border-amber-400/60 bg-neutral-950 p-5 text-center shadow-[0_0_60px_rgba(251,191,36,0.25)] sm:p-8">
            {/* Celebration Icon */}
            <div className="mx-auto mb-4 flex h-14 w-14 animate-bounce items-center justify-center rounded-full border-2 border-amber-300 bg-amber-300/10 text-3xl text-amber-300 sm:mb-5 sm:h-20 sm:w-20 sm:text-5xl">
              ✨
            </div>

            <p className="mb-2 text-xs tracking-[0.3em] text-amber-400 sm:mb-3 sm:text-sm sm:tracking-[0.4em]">
              PERFUMIO
            </p>

            <h2 className="mb-3 text-2xl font-bold text-amber-200 sm:mb-4 sm:text-3xl">
              {successType === "signup" ? "Congratulations!" : "Welcome Back!"}
            </h2>

            <p className="mb-5 text-sm leading-6 text-neutral-300 sm:mb-6 sm:text-base sm:leading-7">
              {successType === "signup"
                ? "Your account has been created successfully!"
                : "You have successfully signed in!"}
            </p>

            {/* Discount */}
            <div className="mb-5 rounded-xl border border-amber-400/40 bg-amber-400/5 px-3 py-5 sm:mb-7 sm:px-5 sm:py-6">
              <p className="text-xs font-semibold tracking-widest text-amber-300 sm:text-sm">
                YOUR WELCOME REWARD
              </p>

              <h3 className="my-2 text-5xl font-extrabold text-amber-300 sm:text-6xl">
                15%
              </h3>

              <p className="text-base font-bold text-white sm:text-lg">
                DISCOUNT UNLOCKED!
              </p>
            </div>

            {/* Continue Shopping */}
            <button
              onClick={() => navigate("/")}
              className="w-full rounded-full bg-amber-300 px-4 py-3 text-sm font-bold tracking-wider text-black transition duration-300 hover:bg-amber-200 sm:px-6 sm:py-4 sm:text-base sm:hover:scale-105"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Auth;
