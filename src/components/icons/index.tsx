import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1.6-3.4 4.4-5 7.5-5s5.9 1.6 7.5 5" />
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 8h11l1 12.5a1 1 0 01-1 1.1H6.5a1 1 0 01-1-1.1L6.5 8z" />
      <path d="M9 8V6.5a3 3 0 016 0V8" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20.2s-7.6-4.5-9.9-9.1C.7 7.7 2.4 4.5 5.7 4a4.7 4.7 0 016.3 2 4.7 4.7 0 016.3-2c3.3.5 5 3.7 3.6 7.1-2.3 4.6-9.9 9.1-9.9 9.1z" />
    </svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 19c-1.2-6.6 2-13 12-14 2 8-2.8 13-9.5 14" />
      <path d="M5 19c1-3 3-6.5 8-9" />
    </svg>
  );
}

export function BunnyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8.5 9.5C7 6 8 2.5 9.7 2c1.4-.4 2 1 2 3.3 0 1.6-.3 3-1 4.2" />
      <path d="M15.5 9.5C17 6 16 2.5 14.3 2c-1.4-.4-2 1-2 3.3 0 1.6.3 3 1 4.2" />
      <ellipse cx="12" cy="15" rx="6.5" ry="6" />
      <circle cx="9.7" cy="14" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="14.3" cy="14" r="0.6" fill="currentColor" stroke="none" />
      <path d="M11 16.3c.6.5 1.4.5 2 0" />
    </svg>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 6.5h11v10h-11z" />
      <path d="M13.5 10.5h4l3 3v3h-7z" />
      <circle cx="6.5" cy="18" r="1.7" />
      <circle cx="17" cy="18" r="1.7" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M12 3.3l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M8 5.3v13.4a1 1 0 001.53.85l10.6-6.7a1 1 0 000-1.7l-10.6-6.7A1 1 0 008 5.3z" fill="currentColor" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.3 2.3L16 9.5" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3.5 6.5L12 13l8.5-6.5" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s7-6.6 7-11.8A7 7 0 105 9.2C5 14.4 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 4.5h3.2l1.3 4-2 1.4a11 11 0 005.6 5.6l1.4-2 4 1.3V18a1.5 1.5 0 01-1.6 1.5A15 15 0 013.5 6.1 1.5 1.5 0 015 4.5z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 21v-7.2h2.4l.4-3H14V8.7c0-.9.3-1.6 1.6-1.6H17V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H8.5v3H10.8V21z" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 3v10.8a2.6 2.6 0 11-2.4-2.6" />
      <path d="M13 3c.4 2.3 2 3.9 4.3 4.2" />
    </svg>
  );
}

export function QuoteIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M9.5 6.5c-3.4.9-5.5 3.6-5.5 7.3 0 2.8 1.7 4.7 4 4.7 2 0 3.5-1.5 3.5-3.4 0-1.8-1.2-3.1-2.9-3.3.4-1.8 1.8-3.2 3.4-3.7z" />
      <path d="M18.5 6.5c-3.4.9-5.5 3.6-5.5 7.3 0 2.8 1.7 4.7 4 4.7 2 0 3.5-1.5 3.5-3.4 0-1.8-1.2-3.1-2.9-3.3.4-1.8 1.8-3.2 3.4-3.7z" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l1.4 4.8L18 9l-4.6 1.2L12 15l-1.4-4.8L6 9l4.6-1.2z" />
      <path d="M19 15l.6 2 2 .6-2 .6-.6 2-.6-2-2-.6 2-.6z" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7 3v5c0 5-3.4 8.4-7 10-3.6-1.6-7-5-7-10V6z" />
      <path d="M9 12l2 2 4-4.2" />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 11a8 8 0 0 0-14.9-4" />
      <path d="M4 4v5h5" />
      <path d="M4 13a8 8 0 0 0 14.9 4" />
      <path d="M20 20v-5h-5" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11.5L12 4l8 7.5" />
      <path d="M6 10v9.5a1 1 0 001 1h3.5v-6h3v6H17a1 1 0 001-1V10" />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M11.5 4H5a1 1 0 00-1 1v6.5a1 1 0 00.3.7l8.5 8.5a1 1 0 001.4 0l6.5-6.5a1 1 0 000-1.4L12.2 4.3a1 1 0 00-.7-.3z" />
      <circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20V10M10.5 20V4M17 20v-7" />
      <path d="M3 20h18" />
    </svg>
  );
}

export function PlugIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3v5M15 3v5M6.5 8h11l-.5 4a5 5 0 01-5 4.5 5 5 0 01-5-4.5z" />
      <path d="M12 16.5V21" />
    </svg>
  );
}

export function LogOutIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h3" />
      <path d="M15 16l4-4-4-4M19 12H9" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0l1 13a1 1 0 001 1h6a1 1 0 001-1l1-13" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
    </svg>
  );
}

export function ReceiptIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3.5h12v17l-2.2-1.4L14 20.5l-2-1.4-2 1.4-1.8-1.4L6 20.5z" />
      <path d="M9 8h6M9 11.5h6M9 15h3.5" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M2.8 19c.9-3 3.2-4.5 6.2-4.5s5.3 1.5 6.2 4.5" />
      <path d="M15.5 6a3 3 0 010 5.8" />
      <path d="M17.5 14.8c2.2.5 3.7 1.9 4.2 4.2" />
    </svg>
  );
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5l9.5 16.5H2.5z" />
      <path d="M12 9.5v4.2" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TrendUpIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 16l6.5-6.5L14 14l7-7" />
      <path d="M16 7h5v5" />
    </svg>
  );
}

export function TrendDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 8l6.5 6.5L14 10l7 7" />
      <path d="M16 17h5v-5" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 10a6 6 0 0112 0c0 4 1.2 5.5 1.8 6.2a.8.8 0 01-.6 1.3H4.8a.8.8 0 01-.6-1.3C4.8 15.5 6 14 6 10z" />
      <path d="M10 20a2 2 0 004 0" />
    </svg>
  );
}

export function DropletIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5c-2.7 3.9-5.5 7.7-5.5 11a5.5 5.5 0 0011 0c0-3.3-2.8-7.1-5.5-11z" />
      <path d="M8.7 15.3a3.3 3.3 0 003.3 3" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20.5 14.2A8.5 8.5 0 019.8 3.5a8.5 8.5 0 1010.7 10.7z" />
    </svg>
  );
}

export function CloudIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 18.5h10.2a4.3 4.3 0 00.6-8.6 5.8 5.8 0 00-11.1 1.4A3.6 3.6 0 007 18.5z" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function SpotIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="9.3" cy="10" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function HourglassIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 3.5h11M6.5 20.5h11" />
      <path d="M7.5 3.5v3c0 2 1.6 3.5 4.5 5 2.9-1.5 4.5-3 4.5-5v-3" />
      <path d="M7.5 20.5v-3c0-2 1.6-3.5 4.5-5 2.9 1.5 4.5 3 4.5 5v3" />
    </svg>
  );
}

export function ScrubIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <circle cx="7" cy="8" r="1.2" />
      <circle cx="12.5" cy="5.8" r="1.2" />
      <circle cx="17.5" cy="9" r="1.2" />
      <circle cx="8.5" cy="13" r="1.2" />
      <circle cx="15" cy="14" r="1.2" />
      <circle cx="10.5" cy="18" r="1.2" />
      <circle cx="16.5" cy="18.5" r="1.2" />
    </svg>
  );
}

export function BoxIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 8L12 3.5 20.5 8 12 12.5 3.5 8z" />
      <path d="M3.5 8v9L12 21.5 20.5 17V8" />
      <path d="M12 12.5V21.5" />
    </svg>
  );
}
