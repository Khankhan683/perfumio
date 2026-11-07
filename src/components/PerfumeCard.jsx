import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";

export default function PerfumeCard({ perfume }) {
  const cardRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState("50ml");
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart } = useCart();

  // Har perfume ki unique fixed base price
  function getPerfumePrice(perfume) {
    const storageKey = `perfumio-price-${perfume.page}`;

    const savedPrice = localStorage.getItem(storageKey);

    if (savedPrice) {
      return Number(savedPrice);
    }

    const randomPrice =
      Math.floor((Math.random() * (18000 - 5000 + 1)) / 100) * 100 + 5000;

    localStorage.setItem(storageKey, randomPrice);

    return randomPrice;
  }

  const basePrice = getPerfumePrice(perfume);

  // Size ke hisaab se price
  const prices = {
    "30ml": Math.round((basePrice * 0.4) / 100) * 100,
    "50ml": Math.round((basePrice * 0.7) / 100) * 100,
    "100ml": basePrice,
  };

  const selectedPrice = prices[selectedSize];

  // Scroll animation
  useEffect(() => {
    const element = cardRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [perfume.page]);

  const imageUrl = `https://tse2.mm.bing.net/th?q=${encodeURIComponent(
    `${perfume.house} ${perfume.name} perfume bottle`,
  )}&w=500&h=500&c=7&rs=1`;

  function handleAddToCart() {
    // Product, selected size aur selected price
    addToCart(
      {
        ...perfume,
        image: imageUrl,
      },
      selectedSize,
      selectedPrice,
    );

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  }

  return (
    <div
      ref={cardRef}
      className={`group h-full min-w-0 overflow-hidden rounded-2xl border border-neutral-800 bg-black
        transform-gpu transition-all duration-700 ease-out
        hover:-translate-y-1 hover:border-amber-300/60
        ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-14 opacity-0"
        }`}
    >
      {/* Perfume Image */}
      <div className="flex h-56 items-center justify-center overflow-hidden bg-white p-3 sm:h-60 sm:p-4 md:h-64">
        <img
          src={imageUrl}
          alt={perfume.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Perfume Details */}
      <div className="p-4 sm:p-5">
        <p className="text-xs uppercase tracking-widest text-amber-300">
          {perfume.house}
        </p>

        <h3 className="mt-2 break-words text-base font-semibold text-white sm:text-lg">
          {perfume.name}
        </h3>

        <p className="mt-2 text-sm text-neutral-400">
          {perfume.family || "Fragrance"}
        </p>

        {/* Size Selection */}
        <p className="mt-4 text-sm font-medium text-white">Select Size</p>

        <div className="mt-2 flex gap-2">
          {Object.keys(prices).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`flex-1 rounded-lg border px-2 py-2 text-xs font-semibold transition sm:text-sm ${
                selectedSize === size
                  ? "border-amber-300 bg-amber-300 text-black"
                  : "border-neutral-700 text-neutral-300 hover:border-amber-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Price */}
        <p className="mt-4 text-lg font-bold text-amber-300">
          Rs. {selectedPrice.toLocaleString("en-PK")}
        </p>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`mt-4 w-full cursor-pointer rounded-lg px-4 py-3 text-sm font-semibold transition duration-300 sm:text-base ${
            isAdded
              ? "bg-green-500 text-white"
              : "bg-amber-300 text-neutral-950 hover:bg-amber-100"
          }`}
        >
          {isAdded ? "✓ Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
