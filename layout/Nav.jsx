import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState, useRef } from "react";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import logo from "../public/logo.svg";
import { IoClose } from "react-icons/io5";
import { useSession, signOut } from "next-auth/react";
const Image = dynamic(
  () => import("next/image").then((module) => module.default),
  {
    ssr: false,
  }
);
const Link = dynamic(
  () => import("next/link").then((module) => module.default),
  {
    ssr: false,
  }
);
import { useRouter } from "next/router";

const Popover = dynamic(
  () => import("@nature-ui/core").then((module) => module.Popover),
  {
    ssr: false,
  }
);
const PopoverTrigger = dynamic(
  () => import("@nature-ui/core").then((module) => module.PopoverTrigger),
  {
    ssr: false,
  }
);
const PopoverContent = dynamic(
  () => import("@nature-ui/core").then((module) => module.PopoverContent),
  {
    ssr: false,
  }
);
const PopoverHeader = dynamic(
  () => import("@nature-ui/core").then((module) => module.PopoverHeader),
  {
    ssr: false,
  }
);

const PopoverBody = dynamic(
  () => import("@nature-ui/core").then((module) => module.PopoverBody),
  {
    ssr: false,
  }
);
const PopoverArrow = dynamic(
  () => import("@nature-ui/core").then((module) => module.PopoverArrow),
  {
    ssr: false,
  }
);
const PopoverCloseButton = dynamic(
  () => import("@nature-ui/core").then((module) => module.PopoverCloseButton),
  {
    ssr: false,
  }
);

import { AuthContext, UserContext } from "../context/Context";
import { Meta } from "./Meta";

const Nav = () => {
  const [loggout, setLoggout] = useState(false);
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  return (
    <Meta>
      <div
        className={`${
          isOpen
            ? "pt-7"
            : "flex pt-7 w-full justify-between py-4 sm:py-5 top-0 fixed right-0 left-0 backdrop-blur-sm z-40 sm:items-center px-3 sm:px-[40px]"
        }`}
      >
        <Link href="/" className="flex items-center mr-4 cursor-pointer">
          <Image
            className="sm:h-[17px] justify-center sm:mr-14 self-center"
            src={logo}
            height={17}
            width={90}
            alt="logo"
          />
        </Link>
        <div className="flex items-center ">
          {session?.user ? (
            <div
              onClick={() => {
                router.push("/me");
                setIsOpen(false);
              }}
              className="flex cursor-pointer mx-4 sm:hidden items-center justify-center h-9 w-9 "
            >
              <Image
                className="rounded-[100%]"
                src={session?.user.image}
                height={36}
                width={36}
                alt="profile"
              />
            </div>
          ) : (
            <Link href="/signin">
              <button
                onClick={() => {
                  setIsOpen(false);
                }}
                className="mx-4 sm:hidden px-5 text-rose-500 py-2 bg-gray-100 rounded-xs"
              >
                Sign in
              </button>
            </Link>
          )}

          <HiOutlineMenuAlt4
            className={` ${router.pathname === "/" && "text-white"} ${
              !isOpen
                ? "sm:hidden text-3xl  top-0 right-0 cursor-pointer"
                : "hidden cursor-pointer"
            }`}
            onClick={() => setIsOpen(true)}
          />
        </div>
        <div
          className={`${
            isOpen
              ? "fixed px-3 right-0 sm:hidden w-full  h-full py-5 top-0 bg-opacity-70 backdrop-blur-lg overflow-hidden sm:h-14 bg-black z-20"
              : "hidden sm:flex flex-row-reverse justify-between flex-1"
          }`}
        >
          <div className="flex justify-between  py-3 items-center">
            <div>
              {session?.user ? (
                <div className="flex items-center">
                  <div className="sm:px-3 text-sm">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        router.push("/me");
                        setIsOpen(false);
                      }}
                    >
                      <div
                        onClick={() => {
                          router.push("/me");
                          setIsOpen(false);
                        }}
                        className="hidden sm:flex cursor-pointer mx-4 items-center justify-center h-9 w-9 "
                      >
                        <Image
                          className="rounded-[100%]"
                          src={session?.user.image}
                          height={36}
                          width={36}
                          alt="profile"
                        />
                      </div>
                    </div>
                  </div>
                  {session && (
                    <li
                      onClick={() => signOut()}
                      className="pr-3 text-lg cursor-pointer"
                    >
                      <div className="text-black px-5 text-xs py-2 sm:px-3 sm:py-1 rounded-3xl bg-gray-300 text-md">
                        Sign out
                      </div>
                    </li>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => {
                    router.push("/signin");
                    setIsOpen(false);
                  }}
                  className="text-rose-500 hidden sm:block font-bold px-2 py-1 text-md sm:text-lg cursor-pointer shadow-xs"
                >
                  Sign In
                </div>
              )}
            </div>
            <IoClose
              className={`${
                isOpen ? "sm:hidden text-white text-3xl" : "hidden"
              }`}
              onClick={() => setIsOpen(false)}
            />
          </div>
          <hr />
          <div className="sm:justify-center text-white sm:text-black  text-sm sm:gap-14 pt-14 sm:pt-0 sm:flex sm:items-center">
            <li
              className="mb-5 sm:ml-10 sm:mb-0"
              onClick={() => setIsOpen(false)}
            >
              <Link href="/events/">Browse events</Link>
            </li>
            {session ? (
              <Link
                href={`${session ? "/new-event" : "/signin"}`}
                className="block"
              >
                <div
                  onClick={() => setIsOpen(false)}
                  className="text-white sm:text-black cursor-pointer"
                >
                  Create Event
                </div>
              </Link>
            ) : (
              <Popover>
                <PopoverTrigger>
                  <div className="cursor-pointer text-white sm:text-black">
                    Create Event
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>You are not logged in!</PopoverHeader>
                  <PopoverBody className="text-lg">
                    Please{" "}
                    <strong
                      className="text-rose-500 cursor-pointer"
                      onClick={() => {
                        router.push("/signin");
                        setIsOpen(false);
                      }}
                    >
                      Sign In
                    </strong>{" "}
                    to create an event.
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </Meta>
  );
};

export default Nav;
