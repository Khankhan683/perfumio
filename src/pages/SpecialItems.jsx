import { useEffect, useState } from "react";
import PerfumeCard from "../components/PerfumeCard";
import PerfumeLoader from "../components/PerfumeLoader";

const API_URL = "https://www.scento.com/api/perfume/v1/search";

const defaultSearchTerms = [
  "Tom Ford Oud Wood",
  "Creed Aventus",
  "Baccarat Rouge 540",
  "Maison Francis Kurkdjian",
  "Le Labo Santal 33",
  "Byredo Bal d'Afrique",
  "Amouage Interlude",
  "Xerjoff Naxos",
];

const randomTerms = [
  "Luxury",
  "Unisex",
  "Niche",
  "Oud",
  "Amber",
  "Exclusive",
  "Woody",
  "Oriental",
];

export default function SpecialItems() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // Default special perfumes load karna
  useEffect(() => {
    async function fetchDefaultPerfumes() {
      try {
        const responses = await Promise.all(
          defaultSearchTerms.map((term) =>
            fetch(`${API_URL}?q=${encodeURIComponent(term)}&kind=perfume`),
          ),
        );

        if (responses.some((response) => !response.ok)) {
          throw new Error("Default perfumes load nahi ho sake.");
        }

        const results = await Promise.all(
          responses.map((response) => response.json()),
        );

        const allPerfumes = results.flatMap(
          (result) => result.detail?.matches ?? [],
        );

        const uniquePerfumes = Array.from(
          new Map(
            allPerfumes.map((perfume) => [perfume.page, perfume]),
          ).values(),
        );

        setProducts(uniquePerfumes.slice(0, 10));
      } catch (err) {
        console.error(err);
        setError("Perfumes load nahi ho sake.");
      } finally {
        setLoading(false);
      }
    }

    fetchDefaultPerfumes();
  }, []);

  // Search functionality
  async function handleSearch(e) {
    e.preventDefault();

    if (!search.trim()) return;

    setSearchLoading(true);
    setError("");
    setSearched(true);
    setSearchResults([]);

    try {
      const response = await fetch(
        `${API_URL}?q=${encodeURIComponent(search.trim())}&kind=perfume`,
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const result = await response.json();

      let matches = result.detail?.matches ?? [];

      // Search result na mile toh random terms search karna
      if (matches.length === 0) {
        const shuffledTerms = [...randomTerms].sort(() => Math.random() - 0.5);

        const randomResponses = await Promise.all(
          shuffledTerms
            .slice(0, 3)
            .map((term) =>
              fetch(`${API_URL}?q=${encodeURIComponent(term)}&kind=perfume`),
            ),
        );

        const randomResults = await Promise.all(
          randomResponses.filter((res) => res.ok).map((res) => res.json()),
        );

        matches = randomResults.flatMap((item) => item.detail?.matches ?? []);
      }

      const uniquePerfumes = Array.from(
        new Map(matches.map((perfume) => [perfume.page, perfume])).values(),
      );

      setSearchResults(uniquePerfumes.slice(0, 3));
    } catch (err) {
      console.error(err);
      setError("Perfumes load nahi ho sake.");
    } finally {
      setSearchLoading(false);
    }
  }

  // Search clear karna
  function handleClear() {
    setSearch("");
    setSearched(false);
    setSearchResults([]);
    setError("");
  }

  const displayedProducts = searched ? searchResults : products;

  return (
    <section className="min-h-screen bg-neutral-801/355 px-4 py-10 text-white sm:px-6 sm:py-14 md:px-8 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <p className="text-xs uppercase tracking-[0.2em] text-amber-300 sm:text-sm sm:tracking-[0.3em]">
          Discover Something Extraordinary
        </p>

        <h1 className="mt-3 text-3xl font-bold sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">
          Special Collection
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-400 sm:mt-4 sm:text-base sm:leading-7">
          Explore exclusive fragrances and discover extraordinary luxury scents.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mt-7 flex w-full max-w-2xl flex-col gap-3 sm:mt-8 sm:flex-row"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search special perfumes..."
            className="min-w-0 w-full flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300 sm:px-5 sm:py-4 sm:text-base"
          />

          <button
            type="submit"
            disabled={searchLoading}
            className="w-full rounded-xl bg-amber-300 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-100 disabled:opacity-50 sm:w-auto sm:px-7 sm:py-4 sm:text-base"
          >
            {searchLoading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Clear Search */}
        {searched && (
          <button
            type="button"
            onClick={handleClear}
            className="mt-3 text-sm text-amber-300 transition hover:text-amber-100 hover:underline"
          >
            Clear Search ×
          </button>
        )}

        {/* Default Loading Animation */}
        {loading && !searched && <PerfumeLoader />}

        {/* Search Loading Animation */}
        {searchLoading && <PerfumeLoader />}

        {/* Error Message */}
        {error && (
          <p className="mt-10 text-center text-sm text-red-400 sm:text-base">
            {error}
          </p>
        )}

        {/* Products Heading */}
        {!loading && !error && !searchLoading && (
          <h2 className="mt-10 text-xl font-bold sm:mt-12 sm:text-2xl md:text-3xl">
            {searched ? "Search Results" : "Exclusive Fragrances"}
          </h2>
        )}

        {/* Perfume Cards */}
        {!loading &&
          !searchLoading &&
          !error &&
          displayedProducts.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {displayedProducts.map((perfume, index) => (
                <div key={perfume.page} className="min-w-0">
                  {searched && (
                    <p className="mb-3 text-sm font-semibold text-amber-300">
                      {index === 0 ? "Search Match" : "Related Fragrance"}
                    </p>
                  )}

                  <PerfumeCard perfume={perfume} />
                </div>
              ))}
            </div>
          )}

        {/* No Results */}
        {searched && !searchLoading && !error && searchResults.length === 0 && (
          <p className="mt-10 text-sm text-neutral-300 sm:text-base">
            Abhi koi perfume available nahi mila. Dobara search karein.
          </p>
        )}
      </div>
    </section>
  );
}
