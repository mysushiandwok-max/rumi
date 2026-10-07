import Image from "next/image";

export function HeroPodium() {
  return (
    <div className="relative mx-auto aspect-[6/5] w-full max-w-xl overflow-hidden rounded-[3rem]">
      <Image
        src="/uploads/banners/banner3.webp"
        alt="Rumí K-Beauty"
        fill
        priority
        quality={95}
        sizes="(max-width: 1024px) 90vw, 576px"
        className="object-cover"
      />

      <div className="absolute right-2 top-4 flex h-20 w-20 rotate-6 flex-col items-center justify-center rounded-full bg-blush-500 text-center text-white shadow-pop sm:h-24 sm:w-24">
        <span className="flex items-baseline gap-1 font-display font-bold leading-none">
          <span className="text-xl sm:text-2xl">10%</span>
          <span className="text-xs uppercase tracking-wide sm:text-sm">OFF</span>
        </span>
        <span className="mt-1 max-w-[60px] font-display text-[8px] font-semibold leading-tight sm:text-[9px]">
          en tu primera compra
        </span>
      </div>
    </div>
  );
}
