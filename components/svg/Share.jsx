import React from "react";

const Share = ({ className }) => {
  return (
    <svg
      width="17"
      height="21"
      viewBox="0 0 17 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="14.1982" cy="2.50561" r="2.00555" stroke="#474042" />
      <circle cx="14.1982" cy="17.5389" r="2.00555" stroke="#474042" />
      <circle cx="2.50555" cy="9.74386" r="2.00555" stroke="#474042" />
      <line
        x1="5.19118"
        y1="7.66807"
        x2="11.0089"
        y2="4.27442"
        stroke="#474042"
        strokeLinecap="round"
      />
      <line
        x1="5.13817"
        y1="12.0695"
        x2="10.9559"
        y2="15.4631"
        stroke="#474042"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Share;
