import React from "react";

interface CartIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
}

const CartIcon: React.FC<CartIconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 1.5,
  filled = false,
  ...props
}) => {
  if (filled) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <defs>
          <linearGradient id="cartGradient" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="0.65" />
          </linearGradient>
        </defs>
        <path
          d="M3 4.5h2.2l1.6 6.4a2 2 0 0 0 1.95 1.55h7.4a2 2 0 0 0 1.96-1.6l1.05-6.3H6.1"
          fill="url(#cartGradient)"
          opacity="0.98"
        />
        <path
          d="M6.8 14.5h8.3"
          stroke="#fff"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <circle cx="10.5" cy="18" r="1.4" fill="#111" opacity="0.12" />
        <circle cx="17.5" cy="18" r="1.4" fill="#111" opacity="0.12" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="11" fill={color} opacity="0.03" />
      <path d="M3 4.75h2.6l1.9 7.2a2.2 2.2 0 0 0 2.15 1.7h6.95a2.2 2.2 0 0 0 2.16-1.76l1.02-6.12H6.1" />
      <path d="M16 6.2l2-1.4" />
      <path d="M7.3 14.4h8.1" />
      <circle cx="10.5" cy="18" r="1.2" fill={color} opacity="0.95" />
      <circle cx="17.5" cy="18" r="1.2" fill={color} opacity="0.95" />
    </svg>
  );
};

export default CartIcon;
