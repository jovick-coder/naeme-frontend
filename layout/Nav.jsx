import { useSession, signOut } from "next-auth/react";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/logo.svg";
import { Meta } from "./Meta";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const genericHamburgerLine = `h-[3px] w-7 my-1 rounded-full transition ease transform duration-300`;
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav
      className={
        "flex h-14 mx-auto sm:h-20 backdrop-blur-md z-40 top-0 right-0 left-0 fixed sm:sticky px-4 md:px-0 md:py-0 justify-between md:justify-between items-center"
      }
    >
      <Link href="/" className="flex items-center cursor-pointer">
        <Image
          className="sm:h-[17px] justify-center self-center"
          src={logo}
          height={23}
          width={90}
          alt="logo"
        />
      </Link>
      <div className="list-none hidden md:flex gap-10 my-auto">
        <li
          onClick={() => {
            router.push("/events");
          }}
          className="nav-list"
        >
          Events
        </li>
        <li
          onClick={() => {
            session ? router.push("/new-event") : router.push("/signin");
            setIsOpen(!isOpen);
          }}
          className="nav-list"
        >
          Create Event
        </li>
      </div>

      <div className="md:flex hidden items-center my-auto gap-4 ">
        {session?.user && (
          <div className="cursor-pointer mx-4 hidden sm:flex items-center justify-center h-9 w-9 ">
            <Image
              className="rounded-[100%]"
              src={session?.user.image}
              height={36}
              width={36}
              alt="profile"
            />
          </div>
        )}
        <button
          onClick={() => {
            session ? signOut() : router.push("/signin");
            setIsOpen(!isOpen);
          }}
          className="btn-brown text-sm px-7"
        >
          {session ? "Logout" : "Login"}
        </button>
      </div>
      {isOpen && (
        <div
          className={`md:hidden text-white bg-[#000000] overflow-hidden fixed w-full right-0 bottom-0 top-0 transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100" : "opacity-0"
          } h-screen  flex flex-col items-center`}
        >
          <div className="list-none flex flex-col gap-6 my-auto">
            <li
              onClick={() => {
                router.push("/events");
                setIsOpen(!isOpen);
              }}
              className="nav-list"
            >
              Browse Events
            </li>
            <li
              onClick={() => {
                session ? router.push("/new-event") : router.push("/signin");
                setIsOpen(!isOpen);
              }}
              className="nav-list"
            >
              Create Event
            </li>
          </div>

          <div className="flex items-center my-auto gap-4 ">
            {session?.user && (
              <div className="flex border-2 rounded-[100%] cursor-pointer mx-4 md:hidden items-center justify-center h-14 w-14 ">
                <Image
                  className="rounded-[100%]"
                  src={session?.user.image}
                  height={56}
                  width={56}
                  alt="profile"
                />
              </div>
            )}
            <button
              onClick={() => {
                session ? signOut() : router.push("/signin");
                setIsOpen(!isOpen);
              }}
              className="btn-brown text-sm px-7"
            >
              {session ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      )}

      <button
        className="flex md:hidden flex-col rounded justify-center items-center group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={`${genericHamburgerLine} ${
            isOpen
              ? "rotate-45 translate-y-3 bg-white"
              : !isOpen && router.pathname === "/"
              ? "bg-white"
              : "bg-black"
          }`}
        />
        <div
          className={`${genericHamburgerLine} ${
            isOpen
              ? "opacity-0"
              : !isOpen && router.pathname === "/"
              ? "bg-white"
              : "bg-black"
          } `}
        />
        <div
          className={`${genericHamburgerLine} ${
            isOpen
              ? "-rotate-45 -translate-y-3 bg-white"
              : !isOpen && router.pathname === "/"
              ? "bg-white"
              : "bg-black"
          }`}
        />
      </button>
    </nav>
  );
};

export default Nav;
