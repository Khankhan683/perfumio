import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    discountAmount,
    finalTotal,

    isDiscountApplied,
    discountClaimed,
    discountAvailable,
    discountUsed,
    discountLoading,

    applyDiscount,
    removeDiscount,
    removeFromCart,
    updateQuantity,
  } = useCart();

  function getProductId(item) {
    return item.id ?? item.productId ?? item.page ?? item.title ?? item.name;
  }

  return (
    <div className="min-h-screen bg-neutral-801/355 px-4 py-10 text-white sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs tracking-[0.4em] text-amber-400 sm:text-sm">
            PERFUMIO
          </p>

          <h1 className="text-3xl font-bold tracking-wide text-amber-200 sm:text-4xl md:text-5xl">
            Your Shopping Cart
          </h1>

          <p className="mt-3 text-sm text-neutral-400 sm:text-base">
            Review your selected fragrances before checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty cart */
          <div className="mx-auto max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900/60 px-5 py-12 text-center sm:px-10">
            <div className="mb-5 text-5xl text-amber-300">🛍</div>

            <h2 className="mb-3 text-2xl font-semibold text-amber-200">
              Your Cart is Empty
            </h2>

            <p className="mb-7 text-sm leading-6 text-neutral-400">
              You haven't added any fragrances to your cart yet. Explore our
              collection and find your signature scent.
            </p>

            <Link
              to="/"
              className="inline-block rounded-full bg-amber-300 px-8 py-3 font-bold text-black transition hover:bg-amber-200"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
            {/* Cart products */}
            <div className="space-y-5 lg:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-4">
                <h2 className="text-xl font-semibold text-amber-200">
                  Shopping Items
                </h2>

                <span className="text-sm text-neutral-400">
                  {cartCount} {cartCount === 1 ? "Item" : "Items"}
                </span>
              </div>

              {cartItems.map((item, index) => {
                const productId = getProductId(item);
                const productName = item.name || item.title || "Perfume";

                const productImage =
                  item.image || item.thumbnail || item.imageUrl;

                const quantity = Number(item.quantity) || 1;

                return (
                  <div
                    key={`${productId}-${item.size || "default"}-${index}`}
                    className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 sm:flex-row sm:items-center sm:p-5"
                  >
                    {/* Product image */}
                    <div className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-800 sm:h-32 sm:w-32">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={productName}
                          className="h-full w-full object-contain p-2 transition duration-500 hover:scale-110"
                        />
                      ) : (
                        <span className="text-4xl text-amber-300">✦</span>
                      )}
                    </div>

                    {/* Product details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="min-w-0">
                        <h3 className="break-words text-lg font-semibold text-amber-200">
                          {productName}
                        </h3>

                        {item.house && (
                          <p className="mt-1 text-sm text-neutral-400">
                            {item.house}
                          </p>
                        )}

                        {item.size && (
                          <p className="mt-1 text-sm text-neutral-400">
                            Size: {item.size}
                          </p>
                        )}

                        <p className="mt-2 font-semibold text-white">
                          Rs. {Number(item.price || 0).toLocaleString("en-PK")}
                        </p>
                      </div>

                      {/* Quantity and remove */}
                      <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                        <div className="flex items-center overflow-hidden rounded-full border border-neutral-700">
                          <button
                            onClick={() =>
                              updateQuantity(productId, item.size, quantity - 1)
                            }
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                            className="px-4 py-2 text-lg text-amber-300 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            −
                          </button>

                          <span className="min-w-10 text-center text-sm">
                            {quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(productId, item.size, quantity + 1)
                            }
                            aria-label="Increase quantity"
                            className="px-4 py-2 text-lg text-amber-300 transition hover:bg-neutral-800"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(productId, item.size)}
                          className="text-sm text-red-400 transition hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <Link
                to="/"
                className="inline-block pt-2 text-sm text-amber-300 transition hover:text-amber-200"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order summary */}
            <div className="rounded-2xl border border-amber-400/30 bg-neutral-900/60 p-5 sm:p-7 lg:sticky lg:top-24">
              <h2 className="mb-6 text-xl font-bold text-amber-200">
                Order Summary
              </h2>

              {/* Subtotal */}
              <div className="flex justify-between gap-3 text-sm text-neutral-300">
                <span>Subtotal ({cartCount} items)</span>

                <span className="font-medium text-white">
                  Rs. {cartTotal.toLocaleString("en-PK")}
                </span>
              </div>

              {/* Discount */}
              <div className="my-5 border-y border-neutral-800 py-5">
                {discountLoading ? (
                  <p className="text-sm text-neutral-400">
                    Checking your discount...
                  </p>
                ) : isDiscountApplied ? (
                  <div>
                    <div className="flex justify-between gap-3 text-sm text-green-400">
                      <span>15% Discount Applied</span>

                      <span>
                        - Rs. {discountAmount.toLocaleString("en-PK")}
                      </span>
                    </div>

                    <button
                      onClick={removeDiscount}
                      className="mt-3 text-sm text-red-400 transition hover:text-red-300"
                    >
                      Remove Discount
                    </button>
                  </div>
                ) : (
                  <>
                    {discountClaimed && (
                      <p className="mb-3 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-sm leading-6 text-amber-300">
                        🎉 You have already claimed your 15% discount!
                      </p>
                    )}

                    {discountUsed ? (
                      <p className="text-sm leading-6 text-neutral-400">
                        Your 15% discount has already been used on a previous
                        order.
                      </p>
                    ) : discountAvailable ? (
                      <button
                        onClick={applyDiscount}
                        className="w-full rounded-full border border-amber-400 py-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-300 hover:text-black"
                      >
                        Apply 15% Discount
                      </button>
                    ) : (
                      <p className="text-sm text-neutral-400">
                        Sign in to check your discount eligibility.
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Total */}
              <div className="mb-6 flex justify-between gap-3">
                <span className="text-lg font-semibold text-white">Total</span>

                <span className="text-xl font-bold text-amber-300">
                  Rs. {finalTotal.toLocaleString("en-PK")}
                </span>
              </div>

              {/* Checkout */}
              <Link
                to="/checkout"
                className="block w-full rounded-full bg-amber-300 px-6 py-4 text-center text-sm font-bold tracking-wider text-black transition duration-300 hover:scale-[1.02] hover:bg-amber-200"
              >
                PROCEED TO CHECKOUT
              </Link>

              <p className="mt-4 text-center text-xs text-neutral-500">
                Secure checkout • Cash on Delivery
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
