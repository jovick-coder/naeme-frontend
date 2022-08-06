import React from "react";
import { BsArrowUpCircle } from "react-icons/bs";

const Footer = ({ className }) => {
  return (
    <div
      className={`flex right-0 left-0 py-5 bottom-0 pt-3 bg-gray-200 items-center justify-around${className}`}
    >
      <div className="text-xs">
        Copyright © {new Date().getFullYear()}, Naeme Events.
      </div>
      <BsArrowUpCircle
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
        className="cursor-pointer text-2xl text-rose-500"
      />
    </div>
  );
};

export default Footer;
