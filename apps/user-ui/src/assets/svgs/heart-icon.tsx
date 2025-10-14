import React from "react";

interface HeartIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
}

const HeartIcon: React.FC<HeartIconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  filled = false,
  ...props
}) => {
  if (filled) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path d="M12 21s-1-.45-2.5-1.55C6.54 17.54 2 13.86 2 8.9 2 6.02 4.02 4 6.9 4c1.74 0 3.41.81 4.44 2.09C12.69 4.81 14.36 4 16.1 4 18.98 4 21 6.02 21 8.9c0 4.96-4.54 8.64-7.5 10.55C13 20.55 12 21 12 21z" />
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
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
};

export default HeartIcon;
