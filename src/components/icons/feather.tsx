import { type SVGProps } from "react";

export type FeatherIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function FeatherIcon({
  size = 16,
  color = "currentColor",
  strokeWidth = 2,
  children,
  ...props
}: FeatherIconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function FiX(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </FeatherIcon>
  );
}

export function FiPlus(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </FeatherIcon>
  );
}

export function FiCalendar(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </FeatherIcon>
  );
}

export function FiChevronDown(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <polyline points="6 9 12 15 18 9" />
    </FeatherIcon>
  );
}

export function FiChevronUp(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <polyline points="18 15 12 9 6 15" />
    </FeatherIcon>
  );
}

export function FiChevronLeft(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <polyline points="15 18 9 12 15 6" />
    </FeatherIcon>
  );
}

export function FiChevronRight(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <polyline points="9 18 15 12 9 6" />
    </FeatherIcon>
  );
}

export function FiChevronsLeft(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </FeatherIcon>
  );
}

export function FiChevronsRight(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </FeatherIcon>
  );
}

export function FiClock(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </FeatherIcon>
  );
}

export function FiCheck(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <polyline points="20 6 9 17 4 12" />
    </FeatherIcon>
  );
}

export function FiFile(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </FeatherIcon>
  );
}

export function FiFileText(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </FeatherIcon>
  );
}

export function FiFilm(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </FeatherIcon>
  );
}

export function FiImage(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </FeatherIcon>
  );
}

export function FiMusic(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </FeatherIcon>
  );
}

export function FiMenu(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </FeatherIcon>
  );
}

export function FiMoreVertical(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </FeatherIcon>
  );
}

export function FiEye(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </FeatherIcon>
  );
}

export function FiEdit3(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
    </FeatherIcon>
  );
}

export function FiTrash2(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </FeatherIcon>
  );
}

export function FiExternalLink(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </FeatherIcon>
  );
}

export function FiLink2(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <path d="M15 7h3a5 5 0 0 1 0 10h-3" />
      <path d="M9 17H6A5 5 0 0 1 6 7h3" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </FeatherIcon>
  );
}

export function FiUploadCloud(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.4 18.4A5 5 0 0 0 18 9h-1.3A8 8 0 1 0 4 16.3" />
      <path d="M16 16h1a3 3 0 0 0 0-6h-1" />
    </FeatherIcon>
  );
}

export function FiFilter(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </FeatherIcon>
  );
}

export function FiGrid(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </FeatherIcon>
  );
}

export function FiList(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1" />
      <circle cx="4" cy="12" r="1" />
      <circle cx="4" cy="18" r="1" />
    </FeatherIcon>
  );
}

export function FiColumns(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </FeatherIcon>
  );
}

export function FiDownload(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </FeatherIcon>
  );
}

export function FiMaximize2(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </FeatherIcon>
  );
}

export function FiMinimize2(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </FeatherIcon>
  );
}

export function FiRefreshCw(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.5 9a9 9 0 0 1 14.1-3.4L23 10" />
      <path d="M20.5 15a9 9 0 0 1-14.1 3.4L1 14" />
    </FeatherIcon>
  );
}

export function FiSearch(props: FeatherIconProps): JSX.Element {
  return (
    <FeatherIcon {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </FeatherIcon>
  );
}
