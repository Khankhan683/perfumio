export default function PerfumeLoader() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center">
      <div className="relative h-44 w-28">
        {/* Bottle cap */}
        <div className="absolute -top-3 left-1/2 z-10 h-4 w-12 -translate-x-1/2 rounded-sm bg-gradient-to-r from-amber-700 via-amber-300 to-amber-700" />

        {/* Bottle neck */}
        <div className="absolute left-1/2 top-0 h-8 w-10 -translate-x-1/2 rounded-t-md border-2 border-amber-300/70 bg-neutral-900" />

        {/* Bottle body */}
        <div className="absolute bottom-0 h-36 w-28 overflow-hidden rounded-[28px] border-2 border-amber-300/70 bg-neutral-900 shadow-[0_0_35px_rgba(251,191,36,0.2)]">
          {/* Golden liquid */}
          <div className="perfume-liquid absolute bottom-0 w-full bg-gradient-to-t from-amber-700 via-amber-400 to-yellow-200">
            <div className="absolute -top-1 h-3 w-full rounded-[50%] bg-yellow-200/80" />
          </div>

          {/* Bottle label */}
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 border-y border-amber-300/50 py-2 text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-amber-200">
              PERFUMIO
            </p>
            <p className="mt-1 text-[7px] tracking-widest text-amber-100/70">
              LUXURY FRAGRANCE
            </p>
          </div>

          {/* Bottle shine */}
          <div className="absolute left-3 top-4 h-24 w-2 rounded-full bg-white/10 blur-sm" />
        </div>
      </div>

      <h2 className="mt-8 text-sm font-semibold tracking-[0.25em] text-amber-300">
        PERFUMIO
      </h2>

      <p className="mt-2 text-xs tracking-wider text-neutral-400">
        Preparing your fragrances...
      </p>
    </div>
  );
}
