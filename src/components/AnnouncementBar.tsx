import { TruckIcon } from "@/components/icons";

export function AnnouncementBar() {
  return (
    <div className="bg-blush-500 py-2.5 text-center text-white">
      <p className="container-page flex items-center justify-center gap-2 text-xs font-medium sm:text-sm">
        <TruckIcon className="h-4 w-4 shrink-0" />
        Envío gratis en compras superiores a $150.000
      </p>
    </div>
  );
}
