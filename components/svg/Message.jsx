import React from "react";

const Message = ({ className }) => {
  return (
    <svg
      width="22"
      height="21"
      viewBox="0 0 22 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16.9235 7.50638C16.9235 7.50638 13.5368 11.571 11.0597 11.571C8.58369 11.571 5.15894 7.50638 5.15894 7.50638"
        stroke="#474042"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 10.6185C1 3.4041 3.51198 1 11.0479 1C18.5838 1 21.0958 3.4041 21.0958 10.6185C21.0958 17.8318 18.5838 20.237 11.0479 20.237C3.51198 20.237 1 17.8318 1 10.6185Z"
        stroke="#474042"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Message;
