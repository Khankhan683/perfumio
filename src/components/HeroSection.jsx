import { useEffect, useState } from "react";

import perfumeImg1 from "../assets/img.png";
import perfumeImg2 from "../assets/img2.png";
import perfumeImg3 from "../assets/img3.png";
import perfumeImg4 from "../assets/img4.png";

const perfumeImages = [
  {
    id: 1,
    src: perfumeImg1,
    alt: "Luxury perfume collection",
  },
  {
    id: 2,
    src: perfumeImg2,
    alt: "Premium perfume bottle",
  },
  {
    id: 3,
    src: perfumeImg3,
    alt: "Elegant fragrance",
  },
  {
    id: 4,
    src: perfumeImg4,
    alt: "Luxury fragrance bottle",
  },
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Automatically change image every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(
        (previousSlide) => (previousSlide + 1) % perfumeImages.length,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Previous image
  function showPreviousSlide() {
    setActiveSlide(
      (previousSlide) =>
        (previousSlide - 1 + perfumeImages.length) % perfumeImages.length,
    );
  }

  // Next image
  function showNextSlide() {
    setActiveSlide(
      (previousSlide) => (previousSlide + 1) % perfumeImages.length,
    );
  }

  return (
    <section className="overflow-hidden bg-transparent text-white">
      <div
        className="mx-auto grid w-full max-w-7xl
grid-cols-1 items-center
gap-10 px-4 py-10
sm:gap-12 sm:px-6 sm:py-14
md:px-8
lg:grid-cols-2 lg:gap-12 lg:px-12 lg:py-16
xl:gap-16 xl:px-16
        "
      >
        {/* LEFT SIDE: LOGO AND SLOGAN */}
        <div className="relative z-10 min-w-0 text-center lg:text-left">
          <p
            className="
              mb-4 text-xs uppercase tracking-[0.25em]
              text-amber-300
              sm:mb-5 sm:text-sm sm:tracking-[0.4em]
            "
          >
            Discover Your Signature Scent
          </p>

          <h1
            className="
              mb-5 break-words text-4xl font-bold
              tracking-[0.08em] text-amber-300
              min-[400px]:text-5xl
              sm:mb-6 sm:text-6xl sm:tracking-[0.15em]
              lg:text-6xl xl:text-7xl
            "
          >
            PERFUMIO
          </h1>

          <h2
            className="
              mb-5 text-2xl font-light leading-tight
              sm:mb-6 sm:text-4xl
              lg:text-4xl xl:text-5xl
            "
          >
            Luxury You Can Feel.
          </h2>

          <p
            className="
mx-auto mb-7 max-w-md text-sm leading-6
text-neutral-300
sm:mb-8 sm:text-base sm:leading-7
lg:mx-0
            "
          >
            Discover exceptional fragrances that express your personality and
            make every moment unforgettable.
          </p>

          <p
            className="
              mt-7 text-[10px] uppercase tracking-[0.2em]
              text-neutral-400
              sm:mt-10 sm:text-xs sm:tracking-[0.3em]
            "
          >
            Elegance in Every Drop
          </p>
        </div>

        {/* RIGHT SIDE: PREMIUM COLLECTION CTA */}
        <div className="relative z-10 flex w-full justify-center lg:justify-end">
          <div className="relative w-full max-w-sm border-l-2 border-amber-400/60 py-5 pl-6 text-center shadow-[-8px_0_25px_-15px_rgba(251,191,36,0.8)] sm:pl-8 lg:text-left">
            <p className="text-xs font-semibold tracking-[0.3em] text-amber-300">
              DISCOVER THE ART OF FRAGRANCE
            </p>

            <h3 className="mt-4 font-serif text-3xl font-light leading-tight tracking-wide text-white sm:text-4xl lg:text-5xl">
              Find Your
              <span className="mt-1 block font-normal text-amber-300">
                Signature Scent.
              </span>
            </h3>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Explore our exclusive collection and discover a scent that makes
              every moment unforgettable.
            </p>

            <a
              href="#products"
              className="group mt-7 inline-flex cursor-pointer items-center gap-4 rounded-full border border-amber-300/70 px-7 py-3.5 text-sm font-semibold text-amber-200 transition-all duration-300 hover:bg-amber-300 hover:text-black hover:shadow-[0_0_25px_rgba(251,191,36,0.2)]"
            >
              Shop Collection
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </a>

            <p className="mt-6 text-[10px] tracking-[0.25em] text-neutral-500">
              ELEGANCE • QUALITY • LUXURY
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
