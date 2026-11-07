import { useState } from "react";

export default function PerfumeDetailsModal({
  perfume,
  basePrice,
  onClose,
  onAddToCart,
}) {
  const [selectedSize, setSelectedSize] = useState("100ml");
  const [quantity, setQuantity] = useState(1);

  if (!perfume) return null;

  const prices = {
    "30ml": Math.round((basePrice * 0.4) / 100) * 100,
    "50ml": Math.round((basePrice * 0.7) / 100) * 100,
    "100ml": basePrice,
  };

  const selectedPrice = prices[selectedSize];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative grid w-full max-w-3xl grid-cols-1 overflow-y-auto rounded-2xl border border-amber-500/40 bg-neutral-950 sm:grid-cols-2"
        style={{ maxHeight: "calc(100dvh - 24px)" }}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close product details"
          className="absolute right-3 top-2 z-20 text-3xl text-white transition hover:text-amber-300 sm:right-4 sm:top-3"
        >
          ×
        </button>

        {/* Perfume image */}
        <div className="flex h-48 items-center justify-center bg-white p-5 sm:h-auto sm:min-h-80 sm:p-8">
          <img
            src={`https://tse1.mm.bing.net/th?q=${encodeURIComponent(
              `${perfume.house} ${perfume.name} perfume bottle`,
            )}&w=600&h=600`}
            alt={perfume.name}
            className="h-full max-h-40 w-full object-contain sm:max-h-80"
          />
        </div>

        {/* Perfume details */}
        <div className="p-5 text-white sm:p-6 md:p-8">
          <p className="text-xs uppercase tracking-widest text-amber-300 sm:text-sm">
            {perfume.house}
          </p>

          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            {perfume.name}
          </h2>

          <p className="mt-2 text-sm text-neutral-400 sm:mt-3">
            {perfume.family || "Premium Fragrance"}
          </p>

          <p className="mt-5 text-xl font-bold text-amber-300 sm:mt-6 sm:text-2xl">
            Rs. {selectedPrice.toLocaleString("en-PK")}
          </p>

          {/* Size selection */}
          <p className="mb-3 mt-5 text-sm text-neutral-300 sm:mt-6">
            Select Size
          </p>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {Object.keys(prices).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`rounded-lg border px-4 py-2 text-sm transition sm:text-base ${
                  selectedSize === size
                    ? "border-amber-300 bg-amber-300 text-black"
                    : "border-neutral-700 text-white hover:border-amber-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Quantity */}
          <p className="mb-3 mt-5 text-sm text-neutral-300 sm:mt-6">Quantity</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="rounded border border-neutral-700 px-4 py-2 transition hover:border-amber-300"
            >
              −
            </button>

            <span>{quantity}</span>

            <button
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="rounded border border-neutral-700 px-4 py-2 transition hover:border-amber-300"
            >
              +
            </button>
          </div>

          {/* Add to cart */}
          <button
            onClick={() =>
              onAddToCart(perfume, selectedSize, selectedPrice, quantity)
            }
            className="mt-6 w-full rounded-lg bg-amber-300 py-3 font-bold text-black transition hover:bg-amber-400 sm:mt-8"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
