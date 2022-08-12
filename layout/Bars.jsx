import React from "react";
import { useRouter } from "next/router";

const Bars = ({ styles, isOpen, setIsOpen }) => {
  const router = useRouter();

  return (
    <button
      className="flex md:hidden flex-col z-50 rounded justify-center items-center group"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div
        className={`${styles} ${
          isOpen
            ? "rotate-45 translate-y-3 bg-white"
            : router.pathname === "/"
            ? "bg-white"
            : "bg-black"
        }`}
      />
      <div
        className={`${styles} ${
          isOpen
            ? "opacity-0"
            : router.pathname === "/"
            ? "bg-white"
            : "bg-black"
        } `}
      />
      <div
        className={`${styles} ${
          isOpen
            ? "-rotate-45 -translate-y-3 bg-white"
            : router.pathname === "/"
            ? "bg-white"
            : "bg-black"
        }`}
      />
    </button>
  );
};

export default Bars;
