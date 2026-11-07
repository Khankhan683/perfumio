import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const {
    cartItems,
    cartTotal,
    finalTotal,
    discountAmount,
    isDiscountApplied,
    discountUsed,
    markDiscountUsed,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;

    setSubmitError("");
    setIsSubmitting(true);

    try {
      if (cartItems.length === 0) {
        throw new Error("Your cart is empty.");
      }

      const order = {
        customer: { ...formData },
        items: cartItems.map((item) => ({ ...item })),
        subtotal: cartTotal,
        discount: discountAmount,
        discountApplied: isDiscountApplied,
        total: finalTotal,
        paymentMethod: "Cash on Delivery",
        orderDate: new Date().toLocaleString(),
      };

      if (isDiscountApplied) {
        await markDiscountUsed();
      }

      clearCart();

      navigate("/order-success", {
        state: { order },
      });
    } catch (error) {
      console.error("Order error:", error);

      setSubmitError(
        error?.message ||
          "Order complete nahi ho saka. Please dobara try karein.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const formatPrice = (price) => Number(price || 0).toLocaleString("en-PK");

  const inputClass =
    "w-full min-w-0 rounded-xl border border-neutral-700 bg-black/50 px-4 py-3.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-all duration-300 focus:border-amber-400 focus:bg-neutral-950 focus:ring-2 focus:ring-amber-400/10 sm:text-base";

  if (cartItems.length === 0) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-neutral-950/40 px-4 py-12 text-center text-white">
        <div className="checkout-enter w-full max-w-md rounded-2xl border border-amber-400/20 bg-neutral-950/90 p-7 shadow-2xl sm:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 text-3xl text-amber-300">
            🛍️
          </div>

          <h1 className="mb-3 text-2xl font-bold text-amber-300 sm:text-3xl">
            Your Cart Is Empty
          </h1>

          <p className="mb-7 text-sm leading-6 text-neutral-400">
            Your shopping bag is waiting for something special. Discover your
            signature fragrance today.
          </p>

          <Link
            to="/"
            className="inline-flex w-full items-center justify-center rounded-full bg-amber-300 px-6 py-3 font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-amber-200 hover:shadow-lg hover:shadow-amber-300/20"
          >
            Continue Shopping
          </Link>
        </div>

        <style>{`
          @keyframes checkoutFadeUp {
            from {
              opacity: 0;
              transform: translateY(25px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .checkout-enter {
            animation: checkoutFadeUp 0.7s ease-out both;
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="min-h-screen overflow-hidden bg-neutral-950/40 px-3 py-8 text-white sm:px-6 sm:py-12">
      <style>{`
        @keyframes checkoutFadeUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .checkout-enter {
          animation: checkoutFadeUp 0.7s ease-out both;
        }

        .checkout-summary {
          animation-delay: 0.15s;
        }

        @media (prefers-reduced-motion: reduce) {
          .checkout-enter {
            animation: none;
          }
        }
      `}</style>

      <div className="mx-auto max-w-6xl">
        {/* Page Heading */}
        <div className="checkout-enter mb-9 text-center sm:mb-12">
          <p className="mb-2 text-xs font-semibold tracking-[0.35em] text-amber-400 sm:text-sm">
            PERFUMIO LUXURY EXPERIENCE
          </p>

          <h1 className="text-3xl font-bold tracking-wide text-amber-300 sm:text-4xl md:text-5xl">
            Checkout
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-400">
            Complete your details and let your favourite fragrance make its way
            to you.
          </p>

          <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        </div>

        {/* Main Layout */}
        <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          {/* Customer Information */}
          <form
            onSubmit={handleSubmit}
            className="checkout-enter min-w-0 rounded-2xl border border-amber-400/20 bg-neutral-950/90 p-4 shadow-2xl shadow-black/30 transition duration-300 hover:border-amber-400/40 sm:p-7 md:p-8"
          >
            <div className="mb-7 flex items-center gap-3 border-b border-neutral-800 pb-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-xl text-amber-300">
                ♙
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-bold text-white sm:text-xl">
                  Customer Information
                </h2>

                <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
                  Enter your delivery details
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Full Name <span className="text-amber-400">*</span>
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className={inputClass}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Phone Number <span className="text-amber-400">*</span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03XXXXXXXXX"
                  pattern="03[0-9]{9}"
                  title="Enter a valid Pakistani phone number"
                  autoComplete="tel"
                  className={inputClass}
                  required
                />

                <p className="mt-2 text-xs text-neutral-500">
                  Enter your 11-digit Pakistani mobile number.
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Email Address <span className="text-amber-400">*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className={inputClass}
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  City <span className="text-amber-400">*</span>
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  autoComplete="address-level2"
                  className={inputClass}
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Complete Address <span className="text-amber-400">*</span>
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House number, street, area and nearby landmark..."
                  rows={4}
                  autoComplete="street-address"
                  className={`${inputClass} resize-y`}
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-7 rounded-xl border border-neutral-800 bg-black/40 p-4 transition duration-300 hover:border-amber-400/40 sm:p-5">
              <p className="mb-4 text-sm font-bold text-amber-300 sm:text-base">
                Payment Method
              </p>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  defaultChecked
                  className="h-4 w-4 accent-amber-400"
                />

                <span className="text-sm font-medium text-white sm:text-base">
                  Cash on Delivery
                </span>

                <span className="ml-auto rounded-full border border-green-500/20 bg-green-500/10 px-2 py-1 text-[10px] font-semibold text-green-400 sm:text-xs">
                  AVAILABLE
                </span>
              </label>

              <p className="mt-3 pl-7 text-xs text-neutral-500">
                Pay when your perfume is delivered.
              </p>
            </div>

            {/* Error */}
            {submitError && (
              <p className="mt-5 break-words rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {submitError}
              </p>
            )}

            {/* Place Order */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 px-5 py-4 text-sm font-extrabold tracking-wider text-black shadow-lg shadow-amber-400/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-400/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  PROCESSING ORDER...
                </>
              ) : (
                <>
                  PLACE ORDER
                  <span className="text-lg">→</span>
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs text-neutral-500">
              Your order details will be shown after confirmation.
            </p>
          </form>

          {/* Order Summary */}
          <div className="checkout-enter checkout-summary h-fit min-w-0 rounded-2xl border border-amber-400/20 bg-neutral-950/90 p-4 shadow-2xl shadow-black/30 transition duration-300 hover:border-amber-400/40 sm:p-7 md:p-8 lg:sticky lg:top-8">
            <div className="mb-7 flex items-center gap-3 border-b border-neutral-800 pb-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-xl text-amber-300">
                ♧
              </div>

              <div>
                <h2 className="text-lg font-bold text-white sm:text-xl">
                  Order Summary
                </h2>

                <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
                  Review your selected fragrances
                </p>
              </div>
            </div>

            {/* Products */}
            <div className="mb-6 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.page || item.name}-${item.size}-${index}`}
                  className="flex min-w-0 flex-col gap-2 rounded-xl border border-neutral-800 bg-black/30 p-3 transition duration-300 hover:border-amber-400/30 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4"
                >
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-white sm:text-base">
                      {item.name || item.title || item.page}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
                      {item.size} × {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-bold text-amber-300 sm:text-base">
                    Rs.{" "}
                    {formatPrice(
                      Number(item.price || 0) * Number(item.quantity || 1),
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Details */}
            <div className="space-y-4 border-t border-neutral-800 pt-5">
              <div className="flex justify-between gap-3 text-sm text-neutral-400">
                <span>Subtotal</span>

                <span className="shrink-0 text-white">
                  Rs. {formatPrice(cartTotal)}
                </span>
              </div>

              {isDiscountApplied && (
                <div className="flex justify-between gap-3 text-sm text-green-400">
                  <span>15% Welcome Discount</span>

                  <span className="shrink-0">
                    - Rs. {formatPrice(discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-3 border-t border-neutral-800 pt-5">
                <span className="text-base font-bold text-white sm:text-lg">
                  Total
                </span>

                <span className="shrink-0 text-xl font-extrabold text-amber-300 sm:text-2xl">
                  Rs. {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            {/* Discount Message */}
            {isDiscountApplied && (
              <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-center">
                <div className="mb-2 text-2xl">🎉</div>

                <p className="text-sm font-bold text-green-400">
                  15% Discount Applied!
                </p>

                <p className="mt-1 text-xs leading-5 text-neutral-400">
                  Your welcome reward has been deducted from your total.
                </p>
              </div>
            )}

            {/* Discount Already Used Message */}
            {discountUsed && !isDiscountApplied && (
              <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 text-center">
                <div className="mb-2 text-2xl">🎁</div>

                <p className="text-sm font-bold text-amber-300">
                  Welcome Discount Already Used
                </p>

                <p className="mt-2 text-xs leading-5 text-neutral-400">
                  You have already used your 15% welcome discount on a previous
                  order. This discount can only be used once.
                </p>
              </div>
            )}

            {/* Secure Checkout */}
            <div className="mt-6 flex items-center justify-center gap-2 border-t border-neutral-800 pt-5 text-xs text-neutral-500">
              <span className="text-amber-400">✦</span>
              Premium fragrance shopping experience
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
