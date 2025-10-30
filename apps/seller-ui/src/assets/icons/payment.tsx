import * as React from "react";
const Payments = (props?: any) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    id="mobile-payment-2"
    data-name="Flat Color"
    xmlns="http://www.w3.org/2000/svg"
    className="icon flat-color"
    {...props}
  >
    <path
      id="secondary"
      d="M10,12v5a1,1,0,0,1-1,1H4a2,2,0,0,1-2-2V12Zm0-2V7A1,1,0,0,0,9,6H4A2,2,0,0,0,2,8v2Z"
      style={{
        fill: "rgb(44, 169, 188)",
      }}
    />
    <rect
      id="primary"
      x={8}
      y={2}
      width={14}
      height={20}
      rx={2}
      style={{
        fill: "rgb(0, 0, 0)",
      }}
    />
    <path
      id="secondary-2"
      data-name="secondary"
      d="M12,2l.31,1.24a1,1,0,0,0,1,.76h3.44a1,1,0,0,0,1-.76L18,2"
      style={{
        fill: "rgb(44, 169, 188)",
      }}
    />
  </svg>
);
export default Payments;
