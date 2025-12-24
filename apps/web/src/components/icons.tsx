import type { ComponentProps } from "react";

type IconProps = ComponentProps<"svg"> & { title?: string };

function Svg({ title, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function IconPin(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 9V4l2-1v6" />
      <path d="M10 9V4L8 3v6" />
      <path d="M8 9h8l-1.5 5H9.5L8 9Z" />
      <path d="M12 14v7" />
    </Svg>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21s-7-4.6-9.2-8.6C1.1 9 3.1 6 6.5 6c1.9 0 3.1 1 3.5 1.6C10.4 7 11.6 6 13.5 6 16.9 6 18.9 9 21.2 12.4 19 16.4 12 21 12 21Z" />
    </Svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </Svg>
  );
}

export function IconZap(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />
    </Svg>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v7" />
      <path d="M12 7h.01" />
    </Svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m10 6 6 6-6 6" />
    </Svg>
  );
}

export function IconKeyboard(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M7 11h.01M10 11h.01M13 11h.01M16 11h.01" />
      <path d="M7 14h10" />
    </Svg>
  );
}
