import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import PerfumeDetailsModal from "./PerfumeDetailsModal";
const API_URL = "https://www.scento.com/api/perfume/v1/search";

const searchTerms = ["oud", "rose", "vanilla", "fresh"];

// Perfume image URL
function getImageSearchUrl(perfume) {
  const query = encodeURIComponent(
    `${perfume.house} ${perfume.name} perfume bottle`,
  );

  return `https://tse1.mm.bing.net/th?q=${query}&w=600&h=600&c=7&rs=1&p=0`;
}

// Har perfume ki unique price save karna
function getPerfumePrice(perfume) {
  const storageKey = `perfumio-price-${perfume.page}`;

  const savedPrice = localStorage.getItem(storageKey);

  if (savedPrice !== null) {
    return Number(savedPrice);
  }

  const randomPrice = Math.floor(Math.random() * 131) * 100 + 5000;

  localStorage.setItem(storageKey, String(randomPrice));

  return randomPrice;
}

// Individual perfume card
function ProductCard({ perfume, index, animationKey, onCardClick }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const basePrice = getPerfumePrice(perfume);

  useEffect(() => {
    const element = cardRef.current;

    if (!element) return;

    setIsVisible(false);

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
  }, [animationKey]);

  return (
    <div
      ref={cardRef}
      onClick={() => onCardClick(perfume)}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
      className={`group overflow-hidden rounded-2xl border border-neutral-800 bg-black/80
        transform-gpu transition-all duration-700 ease-out
        hover:-translate-y-2 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-300/5
        ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-10 scale-[0.97] opacity-0"
        }`}
    >
      {/* Perfume image */}
      <div className="flex h-64 items-center justify-center overflow-hidden bg-white p-4">
        <img
          src={getImageSearchUrl(perfume)}
          alt={`${perfume.house} ${perfume.name} perfume`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";

            event.currentTarget.parentElement.classList.add(
              "bg-gradient-to-br",
              "from-neutral-800",
              "to-neutral-950",
            );
          }}
          className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>

      {/* Perfume details */}
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-amber-300">
          {perfume.house}
        </p>

        <h3 className="mt-2 text-lg font-semibold text-white">
          {perfume.name}
        </h3>

        <p className="mt-2 text-sm text-neutral-400">
          {perfume.family || "Fragrance"}
        </p>

        {/* Price */}
        <p className="mt-4 text-xl font-bold text-amber-300">
          Rs. {basePrice.toLocaleString("en-PK")}
        </p>

        <p className="mt-3 text-xs text-neutral-500">
          100ml · Premium Collection
        </p>
      </div>
    </div>
  );
}

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [firstIndex, setFirstIndex] = useState(0);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [isChanging, setIsChanging] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const { addToCart } = useCart();
  const changingRef = useRef(false);

  // API se perfume data fetch karna
  useEffect(() => {
    async function fetchPerfumes() {
      try {
        const responses = await Promise.all(
          searchTerms.map((term) =>
            fetch(`${API_URL}?q=${encodeURIComponent(term)}&kind=perfume`),
          ),
        );

        if (responses.some((response) => !response.ok)) {
          throw new Error("Perfume data load nahi ho saka.");
        }

        const results = await Promise.all(
          responses.map((response) => response.json()),
        );

        // Sab searches ke perfumes ko ek array mein lana
        const allPerfumes = results.flatMap(
          (result) => result.detail?.matches ?? [],
        );

        console.log("API perfumes:", allPerfumes.slice(0, 3));
        console.log("sdsa");

        // Duplicate perfumes remove karna
        const uniquePerfumes = Array.from(
          new Map(
            allPerfumes.map((perfume) => [perfume.page, perfume]),
          ).values(),
        );

        setProducts(uniquePerfumes);
      } catch (err) {
        console.error("Scento API error:", err);
        setError("Perfumes load nahi hue. Dobara try karo.");
      } finally {
        setLoading(false);
      }
    }

    fetchPerfumes();
  }, []);

  // Cards change karna
  function changeCards(direction) {
    if (changingRef.current || products.length <= 12) return;

    changingRef.current = true;
    setIsChanging(true);

    setTimeout(() => {
      setFirstIndex((current) => {
        if (direction === "next") {
          return current + 12 >= products.length ? 0 : current + 12;
        }

        return current === 0
          ? Math.floor((products.length - 1) / 12) * 12
          : Math.max(current - 12, 0);
      });

      setAnimationKey((current) => current + 1);
      setIsChanging(false);

      setTimeout(() => {
        changingRef.current = false;
      }, 750);
    }, 350);
  }

  // Har 8 seconds baad next perfumes
  useEffect(() => {
    if (products.length <= 12) return;

    const timer = setInterval(() => {
      changeCards("next");
    }, 8000);

    return () => clearInterval(timer);
  }, [products.length]);

  // Next button
  function moveNext() {
    changeCards("next");
  }

  // Previous button
  function movePrevious() {
    changeCards("previous");
  }

  // Ek row render karna
  function renderRow(rowProducts, rowNumber) {
    return (
      <div
        key={`${animationKey}-${rowNumber}`}
        className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4
          transform-gpu transition-all duration-500 ease-in-out cursor-pointer
          ${
            isChanging ? "translate-x-5 opacity-0" : "translate-x-0 opacity-100"
          }`}
      >
        {rowProducts.map((perfume, index) => (
          <ProductCard
            key={perfume.page}
            perfume={perfume}
            index={index}
            animationKey={animationKey}
            onCardClick={setSelectedPerfume}
          />
        ))}
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <p className="bg-neutral-950 p-10 text-center text-white">
        Perfumes load ho rahe hain...
      </p>
    );
  }

  // Error state
  if (error) {
    return (
      <p className="bg-neutral-950 p-10 text-center text-red-400">{error}</p>
    );
  }

  // Agar koi perfume na mile
  if (products.length === 0) {
    return (
      <p className="bg-neutral-950 p-10 text-center text-white">
        Koi perfume nahi mila.
      </p>
    );
  }

  // Teen rows mein 4-4 perfumes
  const firstRow = products.slice(firstIndex, firstIndex + 4);
  const secondRow = products.slice(firstIndex + 4, firstIndex + 8);
  const thirdRow = products.slice(firstIndex + 8, firstIndex + 12);

  return (
    <section
      id="products"
      className="bg-transparent px-5 py-16 text-white md:px-10"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
          Discover Your Signature Scent
        </p>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold md:text-5xl">
              Our Perfume Collection
            </h2>

            <p className="mt-3 text-neutral-400">
              Discover fragrances from renowned perfume houses.
            </p>
          </div>

          {/* Previous / Next buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={movePrevious}
              disabled={isChanging || products.length <= 12}
              aria-label="Previous perfumes"
              className="rounded-full border border-amber-300 bg-transparent px-5 py-3 text-amber-300 transition duration-300 hover:bg-amber-300 hover:text-black disabled:opacity-50"
            >
              ←
            </button>

            <button
              type="button"
              onClick={moveNext}
              disabled={isChanging || products.length <= 12}
              aria-label="Next perfumes"
              className="rounded-full border border-amber-300 bg-transparent px-5 py-3 font-bold text-amber-300 transition duration-300 hover:bg-amber-300 hover:text-black disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>

        {/* Three rows of perfume cards */}
        <div className="mt-10 space-y-8">
          {renderRow(firstRow, 1)}

          {secondRow.length > 0 && renderRow(secondRow, 2)}

          {thirdRow.length > 0 && renderRow(thirdRow, 3)}
        </div>

        {/* Total perfume count */}
        <p className="mt-6 text-sm text-neutral-500">
          {products.length} perfumes · Auto-advance every 4 seconds
        </p>
      </div>

      {/* YAHAN MODAL CODE PASTE KARO */}
      <PerfumeDetailsModal
        perfume={selectedPerfume}
        basePrice={selectedPerfume ? getPerfumePrice(selectedPerfume) : 0}
        onClose={() => setSelectedPerfume(null)}
        onAddToCart={(perfume, size, price, quantity) => {
          addToCart(perfume, size, price, quantity);
          setSelectedPerfume(null);
        }}
      />
    </section>
  );
}
