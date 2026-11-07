import { useState } from "react";
import { Link } from "react-router-dom";
import ScratchIntro from "../components/ScratchIntro";

const reviews = [
  {
    name: "Ahmed Khan",
    perfume: "Oud Wood",
    review:
      "Amazing fragrance and beautiful presentation. The luxury experience is impressive.",
    rating: 5,
  },
  {
    name: "Sara Ali",
    perfume: "Baccarat Rouge 540",
    review:
      "I love the elegant fragrance collection. Everything feels premium and special.",
    rating: 5,
  },
  {
    name: "Usman Malik",
    perfume: "Creed Aventus",
    review:
      "A great place to explore luxury fragrances. The collection has a premium feel.",
    rating: 5,
  },
];

export default function AboutUs({ showScratch = true }) {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {/* Scratch Intro - Only on About Page */}
      {showScratch && showIntro && (
        <ScratchIntro onComplete={() => setShowIntro(false)} />
      )}

      <main
        className={`min-h-screen overflow-hidden text-white ${
          showScratch ? "bg-neutral-801/355" : "bg-transparent"
        }`}
      >
        {/* About Hero Section */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-12">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[5px] text-amber-400">
              Discover Perfumio
            </p>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              The World of
              <span className="block text-amber-400">Luxury Fragrances.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-neutral-300">
              Welcome to Perfumio, where fragrance meets elegance. We believe
              that every scent tells a story and every fragrance creates a
              memorable impression.
            </p>

            <p className="mt-5 max-w-xl text-base leading-8 text-neutral-400">
              Our collection is inspired by luxury, style and individuality.
              Whether you prefer fresh, woody, floral or oriental fragrances,
              discover a scent that expresses your personality.
            </p>

            <Link
              to="/men"
              className="mt-8 inline-block rounded-full bg-amber-400 px-8 py-3 font-semibold text-black transition duration-300 hover:scale-105 hover:bg-amber-300"
            >
              Explore Collection
            </Link>
          </div>

          <div className="group overflow-hidden rounded-2xl border border-amber-400/20 shadow-2xl shadow-amber-500/10">
            <img
              src="/perfumio-aboutus-img.png"
              alt="Perfumio luxury fragrance"
              className="h-[350px] w-full object-cover transition duration-700 group-hover:scale-110 sm:h-[450px]"
            />
          </div>
        </section>

        {/* Our Story Section */}
        <section
          className={`border-y border-amber-400/10 px-6 py-20 ${
            showScratch ? "bg-neutral-900/70" : "bg-transparent"
          }`}
        >
          <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-amber-400">
                Our Story
              </p>

              <h2 className="text-3xl font-bold sm:text-4xl">
                The Art of Luxury Fragrance
              </h2>

              <p className="mt-6 leading-8 text-neutral-300">
                Perfume is more than just a fragrance. It is a reflection of
                your personality, your memories and your style.
              </p>

              <p className="mt-4 leading-8 text-neutral-400">
                At Perfumio, our vision is to make discovering beautiful
                fragrances an enjoyable and elegant experience.
              </p>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-amber-400">
                Our Goal
              </p>

              <h2 className="text-3xl font-bold sm:text-4xl">
                Find Your Signature Scent
              </h2>

              <p className="mt-6 leading-8 text-neutral-300">
                Our goal is to help fragrance lovers explore different scents
                and find the fragrance that feels truly personal to them.
              </p>

              <p className="mt-4 leading-8 text-neutral-400">
                We want every visit to Perfumio to feel simple, inspiring and
                luxurious.
              </p>
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-amber-400">
              Customer Experiences
            </p>

            <h2 className="text-3xl font-bold sm:text-4xl">What People Say</h2>

            <p className="mx-auto mt-4 max-w-2xl text-neutral-400">
              Discover what fragrance lovers think about the Perfumio
              experience.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {reviews.map((review, index) => (
              <div
                key={index}
                className={`rounded-2xl border border-amber-400/20 p-7 transition duration-300 hover:-translate-y-2 hover:border-amber-400/60 hover:shadow-xl hover:shadow-amber-500/10 ${
                  showScratch ? "bg-neutral-900" : "bg-neutral-950/70"
                }`}
              >
                <div className="mb-5 flex gap-1 text-xl text-amber-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>

                <p className="min-h-24 leading-7 text-neutral-300">
                  "{review.review}"
                </p>

                <div className="mt-7 border-t border-white/10 pt-5">
                  <h3 className="font-bold text-white">{review.name}</h3>

                  <p className="mt-1 text-sm text-amber-400">
                    {review.perfume}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-neutral-500">
            Sample reviews for demonstration. Replace with genuine customer
            feedback.
          </p>
        </section>

        {/* Bottom CTA */}
        <section
          className={`border-t border-amber-400/20 px-6 py-20 text-center ${
            showScratch
              ? "bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900"
              : "bg-transparent"
          }`}
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            Find a Fragrance That
            <span className="text-amber-400"> Defines You.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-neutral-400">
            Explore the world of fragrances and discover something that matches
            your personality.
          </p>

          <Link
            to="/men"
            className="mt-8 inline-block rounded-full bg-amber-400 px-9 py-3 font-semibold text-black transition duration-300 hover:scale-105 hover:bg-amber-300"
          >
            Shop Now
          </Link>
        </section>
      </main>
    </>
  );
}
