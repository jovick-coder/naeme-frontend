import { useDisclosure } from "@nature-ui/core";

const Modal = dynamic(
  () => import("@nature-ui/core").then((module) => module.Modal),
  {
    ssr: false,
  }
);
const ModalOverlay = dynamic(
  () => import("@nature-ui/core").then((module) => module.ModalOverlay),
  {
    ssr: false,
  }
);
const ModalContent = dynamic(
  () => import("@nature-ui/core").then((module) => module.ModalContent),
  {
    ssr: false,
  }
);
const ModalHeader = dynamic(
  () => import("@nature-ui/core").then((module) => module.ModalHeader),
  {
    ssr: false,
  }
);

const ModalFooter = dynamic(
  () => import("@nature-ui/core").then((module) => module.ModalFooter),
  {
    ssr: false,
  }
);
const ModalBody = dynamic(
  () => import("@nature-ui/core").then((module) => module.ModalBody),
  {
    ssr: false,
  }
);
const ModalCloseButton = dynamic(
  () => import("@nature-ui/core").then((module) => module.ModalCloseButton),
  {
    ssr: false,
  }
);
const Button = dynamic(
  () => import("@nature-ui/core").then((module) => module.Button),
  {
    ssr: false,
  }
);

// Alert Dynamic imports

const AlertDialog = dynamic(
  () => import("@nature-ui/core").then((module) => module.AlertDialog),
  {
    ssr: false,
  }
);
const AlertDialogBody = dynamic(
  () => import("@nature-ui/core").then((module) => module.AlertDialogBody),
  {
    ssr: false,
  }
);
const AlertDialogFooter = dynamic(
  () => import("@nature-ui/core").then((module) => module.AlertDialogFooter),
  {
    ssr: false,
  }
);
const AlertDialogHeader = dynamic(
  () => import("@nature-ui/core").then((module) => module.AlertDialogHeader),
  {
    ssr: false,
  }
);

const AlertDialogContent = dynamic(
  () => import("@nature-ui/core").then((module) => module.AlertDialogContent),
  {
    ssr: false,
  }
);
const AlertDialogOverlay = dynamic(
  () => import("@nature-ui/core").then((module) => module.AlertDialogOverlay),
  {
    ssr: false,
  }
);

const Image = dynamic(() =>
  import("next/image").then((module) => module.default)
);
const EditEvent = dynamic(() => import("./EditEvent"), { ssr: false });
const DeleteEvent = dynamic(() => import("./DeleteEvent"), { ssr: false });
import PayNow from "../payment/Payment.jsx";

import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import Calendar from "../svg/Calendar";
import Location from "../svg/Location";
import { BiTime } from "react-icons/bi";
import { RiFacebookCircleLine } from "react-icons/ri";
import { Countdown } from "../CountDown";
import { BsGlobe, BsInstagram } from "react-icons/bs";
import { FiTwitter } from "react-icons/fi";
import moment from "moment";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { serverUrl } from "../../config";
import dynamic from "next/dynamic";

let easing = [0.6, -0.05, 0.01, 0.99];
const fadeInUp = {
  hidden: {
    y: 600,
    opacity: 0,
    transition: { duration: 0.7, ease: easing },
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
};

const EventDetail = ({ event }) => {
  const dt = moment(event?.end_date + " " + event?.end_time);
  const cart = event?.tickets.map((ticket) => ({
    ...ticket,
    count: 0,
  }));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cartItems, setCartItems] = useState([...cart]);
  const [toggle, setToggle] = useState(false);
  const [toggleMobile, setToggleMobile] = useState(false);
  const [checkoutToggle, setChectoutToggle] = useState(false);
  const { data: session } = useSession();
  const targetTime = moment(dt);
  const [currentTime, setCurrentTime] = useState(moment());
  const timeBetween = moment.duration(targetTime.diff(currentTime));
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  // paid ticket
  const [open, setOpen] = useState(false);
  const onopen = () => setOpen(true);
  const onclose = () => setOpen(false);
  const cancelRef = useRef();

  // paid ticket

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const total = cartItems.reduce((acc, item) => {
    return acc + item.price * item.count;
  }, 0);

  const cartLength = cartItems.reduce((acc, item) => {
    return acc + item.count;
  }, 0);

  const addTicket = (item, event) => {
    const exists = cartItems.find((i) => i.id === item.id);
    if (exists) {
      setCartItems(
        cartItems.map((ticket) =>
          ticket.id === item.id
            ? { ...ticket, count: ticket.count + 1, event: event }
            : ticket
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, count: 1, event: event }]);
    }
  };

  const removeTicket = (item) => {
    const exists = cartItems.find((i) => i.id === item.id);
    if (exists.count > 0) {
      setCartItems(
        cartItems.map((ticket) =>
          ticket.id === item.id
            ? { ...ticket, count: ticket.count - 1 }
            : ticket
        )
      );
    } else {
      setCartItems(cartItems);
    }
  };

  // post ticket free event
  const postTicket = async () => {
    const freeTicket = event.tickets[0];
    const response = await fetch(`${serverUrl}/my-tickets/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: event?.title,
        title: "Free",
        ticket: freeTicket?.id,
        user: session?.user.id,
        quantity: 1,
      }),
    });
    // console.log("response", response);
    if (response.status === 201) {
      // console.log("ticket created");
      router.push("/me");
    }
  };

  // free event end

  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });
  // console.log("Cart", cartItems);
  return (
    <div className="grid place-content-center bg-white flex-col my-2 mb-10 mx-auto sm:px-10 pt-24 sm:pt-32 overflow-x-hidden">
      <div className="max-w-[1007px] sm:shadow-md min-h-[225px] max-h-[566px] mx-auto mb-19 sm:rounded-sm overflow-hidden">
        <Image
          height={600}
          width={1010}
          objectFit="cover"
          alt={event.title}
          className=""
          src={event.image}
        />
      </div>
      <div className="relative mb-14">
        <div className="mx-auto max-w-xl sm:my-7 sm:border sm:first-letter sm:mt-10 py-5 rounded-xs px-[30px] sm:place-content-center">
          <h2 className="text-wine-700 my-2 text-rose-500 leading-tight font-extrabold text-[24px] sm:text-[38px] text-start ">
            {event.title}
          </h2>

          <div className="flex justify-between">
            {isMounted ? <Countdown datetime={dt?._i} /> : null}
            <div className="flex items-center my-2 gap-4">
              {session?.user?.id === event.owner && (
                <EditEvent
                  event={event}
                  toggle={toggle}
                  setToggle={setToggle}
                />
              )}

              {session?.user.id === event.owner && (
                <DeleteEvent event={event} />
              )}
            </div>
          </div>
          <div className="my-5 w-full flex  text-[14px] justify-between items-center">
            <Calendar className="mr-5" />
            <p className="flex-1 text-md">
              {moment(event.date).format("MMMM Do YYYY.")}
            </p>
          </div>
          <div className="my-5 w-full flex justify-between items-center">
            <Location className="mr-5" />
            {event.online ? (
              <p className="flex-1 text-md">Online</p>
            ) : (
              <p className="flex-1 text-[14px]">{event.location}</p>
            )}
          </div>
          <div className="my-3 flex items-center justify-between">
            <div className="flex">
              <BiTime className="mr-4 text-gray-400 h-6 w-6" />
              <p>{moment(event.start_time, "HH:mm").format("h:mm A")}</p>
            </div>
            <div className="flex items-center justify-between py-2">
              {event.facebook && (
                <a href={event.facebook}>
                  <RiFacebookCircleLine className="text-2xl mx-2 hover:text-rose-300 text-rose-500" />
                </a>
              )}
              {event.twitter && (
                <a href={event.twitter}>
                  <FiTwitter className="text-2xl mx-2 hover:text-rose-300 text-rose-500" />
                </a>
              )}
              {event.instagram && (
                <a href={event.instagram}>
                  <BsInstagram className="text-xl mx-2 hover:text-rose-300 text-rose-500" />
                </a>
              )}
              {event.website && (
                <a href={event.website}>
                  <BsGlobe className="text-xl mx-2 hover:text-rose-300 text-rose-500" />
                </a>
              )}
            </div>
          </div>

          {event?.paid === null && (
            <div className="my-5">
              <p className="text-green-500 text-md">Free Event</p>
            </div>
          )}
          {event?.paid === true && (
            <span className="hidden sm:block text-wine-700 font-medium text-[24px] my-5">
              {event?.lowest_price === event?.highest_price ? (
                <div className="text-[20px]">
                  {formatter.format(event.lowest_price)}
                </div>
              ) : (
                <>
                  {formatter.format(event.lowest_price)} -{" "}
                  {formatter.format(event.highest_price)}
                </>
              )}
            </span>
          )}
          <div className="sm:flex hidden  items-center gap-10">
            {timeBetween.asSeconds() < 0 ? (
              <div className="sm:text-xl text-center justify-center">
                <button className="flex bg-[#dfdede]  rounded-2xl text-gray-400 items-center p-3 px-6 my-2">
                  Ticket+
                </button>
              </div>
            ) : event?.paid === true ? (
              <button
                onClick={
                  session?.user ? () => onOpen() : () => router.push("/signin")
                }
                color="rose-500"
                className="flex bg-[#ff4170] text-white rounded-2xl items-center p-3 px-6 my-2"
              >
                Ticket+
              </button>
            ) : (
              <button
                onClick={
                  session?.user ? () => onopen() : () => router.push("/signin")
                }
                className="flex bg-[#ff4170]   text-white rounded-2xl items-center p-3 px-6 my-2"
              >
                Get Free Ticket+
              </button>
            )}
          </div>

          <div className="mt-6 mb-10">
            <hr />
            <p className="mt-5 text-[15px] leading-relaxed">
              {event.description}
            </p>
            <em className="text-xs">
              {" "}
              This event is organized by {event.organizer}
            </em>
          </div>
        </div>

        <AlertDialog
          isOpen={open}
          leastDestructiveRef={cancelRef}
          onClose={onclose}
          isCentered
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>Please Confirm!</AlertDialogHeader>
              <AlertDialogBody>
                We will be creating a free ticket attached to your email address
                and will send it to your user dashboard for this event.
                <span className="text-xs">
                  <br /> <strong className="text-rose-500">Naeme </strong>
                  isn&#39;t responsible for the health and safety of this event.
                  Please follow the organizer&#39;s safety policies as well as
                  local laws and restrictions.
                </span>
              </AlertDialogBody>
              <AlertDialogFooter>
                <button
                  ref={cancelRef}
                  onClick={onclose}
                  className="bg-gray-200 rounded-sm px-3 py-2 hover:bg-gray-300"
                >
                  Nevermind
                </button>
                <button
                  onClick={postTicket}
                  color="red-500"
                  className="ml-3 px-3 py-2 rounded-sm text-white bg-rose-500"
                >
                  Yes, Book
                </button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <div className="sm:hidden bg-white p-5 flex flex-col left-0 right-0 fixed w-full rounded-tr-xl rounded-tl-xl bottom-0">
          {event.paid === true && (
            <div className="text-wine-700 mx-auto font-sans text-[14px] font-medium">
              {event.lowest_price === event.highest_price ? (
                <div className="text-[20px]">
                  {formatter.format(event.lowest_price)}
                </div>
              ) : (
                <>
                  {formatter.format(event.lowest_price)} -{" "}
                  {formatter.format(event.highest_price)}
                </>
              )}
            </div>
          )}
          {timeBetween.asSeconds() < 0 ? (
            <div className="sm:text-xl text-center justify-center">
              Event Expired🙂
            </div>
          ) : event.paid === true ? (
            <Button
              color="rose-500"
              onClick={
                session?.user
                  ? () => setToggleMobile(true)
                  : () => router.push("/signin")
              }
              className="flex text-white  absolute bg-[#F05279] mx-auto w-full rounded-xs items-center p-3 px-6 my-2"
            >
              Book now+
            </Button>
          ) : (
            <Button
              color="rose-500"
              onClick={
                session?.user ? () => onopen() : () => router.push("/signin")
              }
              className="flex text-white  absolute bg-[#F05279] mx-auto w-full rounded-xs items-center p-3 px-6 my-2"
            >
              Get free ticket+
            </Button>
          )}
        </div>

        {/* checkout mobile */}
        <div
          className={
            toggleMobile
              ? "bottom-0 sm:hidden top-0 p-4 right-0 left-0  h-screen w-screen fixed bg-white z-40"
              : "hidden"
          }
        >
          <div className={toggleMobile ? "relative" : ""}>
            <Image
              alt="close"
              height={20}
              width={20}
              src="/bclose.svg"
              onClick={() => setToggleMobile(false)}
            />
            <div className="items-center flex-col justify-center mx-auto flex  h-[120px] top-0 right-0 left-0">
              <div className="mx-auto font-sans text-gray-800 text-lg font-bold">
                {event.title.toUpperCase()}
              </div>
              <div className="flex items-center mx-auto">
                <Image
                  height={20}
                  width={20}
                  src="/Calendar.svg"
                  className="px-1"
                  alt="date"
                />
                <div className="px-4 text-[14px]">
                  {moment(event.date).format("MMMM Do YYYY")}
                  {", "}
                  {moment(event.time, "HH:mm").format("h:mm A")}
                </div>
              </div>
            </div>
            <hr />
          </div>
          {checkoutToggle ? (
            <motion.div
              initial="hidden"
              variants={fadeInUp}
              animate={checkoutToggle ? "visible" : "hidden"}
              transition={{
                delay: 0.06,
                duration: 0.2,
              }}
              whileInView={{ opacity: 1, y: 0 }}
              className="px-4 pt-5 bg-[#13090C] text-white bottom-0 top-0 absolute right-0 left-0"
            >
              <h2 className="text-lg my-5 font-semibold">Order Summary</h2>
              <div className="text-white">
                <div>
                  {cartItems.map((item) => {
                    return (
                      item.count > 0 && (
                        <div
                          key={item.id}
                          className="flex items-center justify-between my-3 0 font-medium"
                        >
                          <div className="flex gap-[4px] text-gray-700 text-xs">
                            <div className="text-white">
                              {item.count} x {item.title}
                            </div>
                            <div className="text-white text-xs">
                              {event.title}
                            </div>
                          </div>

                          <div className="text-white text-xs">
                            {formatter.format(item.price)}
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
                <hr className="mx-4 my-5" />
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <div className="text-white text-xs">Subtotal:</div>
                <span className="text-xs text-white font-semibold">
                  {formatter.format(total)}
                </span>
              </div>
              <hr className="mx-4 my-7" />

              <div className="flex mb-5 justify-between items-center my-2 text-xs text-gray-700">
                <div className="text-white font-bold">Total:</div>
                <span className="text-rose-400 font-semibold">
                  {formatter.format(total)}
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="">
              {cartItems?.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="flex flex-col mx-2 flex-1 justify-center py-3 border-b font-medium"
                  >
                    <div className="flex items-center">
                      {item.price && (
                        <div className="block flex-1 text-xs">
                          <a className="border rounded-xs border-rose-300 text-rose-600 p-1 px-2">
                            {" "}
                            {formatter.format(item.price)}
                          </a>
                        </div>
                      )}
                      <div className="text-xs font-semibold flex-1 justify-start">
                        {item.title}
                      </div>
                      <div className="flex flex-1 justify-end items-center ml-2">
                        <AiOutlineMinusCircle
                          onClick={() => removeTicket(item, event)}
                          className="text-2xl h-6 w-6 text-gray-400 hover:text-rose-300"
                        />
                        <div className="px-2 text-sm">{item.count}</div>
                        <AiOutlinePlusCircle
                          onClick={() => addTicket(item, event)}
                          className="text-2xl h-6 w-6 text-gray-400 hover:text-rose-300"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div
            className={
              toggleMobile
                ? "sm:hidden bg-[#13090C] p-5 flex flex-col left-0 right-0 fixed w-full rounded-tr-xl rounded-tl-xl bottom-0"
                : "hidden"
            }
          >
            {timeBetween.asSeconds() < 0 ? (
              <div className="sm:text-xl text-center justify-center">
                Event Expired🙂
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex">
                  <Image height={20} width={20} src="/Buy.svg" alt="buy" />
                  <div className="top-0 mb-7 text-white rounded-[100%] px-2 bg-[#F05279]">
                    {cartLength}
                  </div>
                  <div
                    onClick={() => setChectoutToggle(!checkoutToggle)}
                    className="mx-1 mt-5"
                  >
                    {checkoutToggle ? (
                      <Image
                        height={20}
                        width={20}
                        src="/ArrowUp.svg"
                        className="h-5 w-5 text-white"
                        alt="arrow"
                      />
                    ) : (
                      <Image
                        height={20}
                        width={20}
                        src="/ArrowDown.svg"
                        className="h-5 w-5 text-white"
                        alt="arrow"
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-white text-xs block mx-4">
                    NGN {total.toLocaleString()}
                  </div>
                  {cartLength > 0 && (
                    <PayNow
                      onClick={
                        session?.user
                          ? () => setToggleMobile(true)
                          : () => router.push("/signin")
                      }
                      className="flex text-white"
                      cartItems={cartItems}
                    />
                  )}
                </div>
              </div>
            )}
            {/*  */}
          </div>
        </div>

        {/* checkout mobile */}
        <Modal isOpen={isOpen} isCentered onClose={onClose}>
          <ModalOverlay>
            <ModalContent className="sm:rounded-xs hidden sm:block relative  mx-4 sm:h-fit overflow-x-hidden sm:overflow-hidden min-w-[805px] sm:bg-white">
              <div className="backdrop-blur-2xl sm:backdrop-blur-none sticky right-0 left-0 top-0">
                <div className="flex flex-col px-5 justify-start items-start pt-3 border-b font-medium">
                  <p className="text-3xl font-bold font-['Open_Sans']  text-rose-500">
                    {event.title}
                  </p>
                  <p className="text-xs my-2 font-medium text-gray-900">
                    {moment(event.date).format("MMMM Do YYYY.")}
                  </p>
                </div>
                <ModalCloseButton className="mr-2 mt-3 sm:hidden" />
              </div>

              <div className="grid sm:flex items-start flex-row">
                <div className="w-[540px] p-5">
                  {cartItems?.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="flex flex-col flex-1 justify-center py-3 border-b font-medium"
                      >
                        <div className="flex items-center justify-between">
                          {item.price && (
                            <div className="border text-rose-600 rounded-xs p-1 text-xs mr-9 border-rose-300">
                              N {item.price}
                            </div>
                          )}
                          <div className="flex-1 text-xs">{item.title}</div>
                          <div className="flex gap-1 items-center ml-2">
                            <AiOutlineMinusCircle
                              onClick={() => removeTicket(item, event)}
                              className="text-2xl h-6 w-6 text-gray-400 hover:text-rose-300"
                            />
                            <div className="flex-1 text-sm">{item.count}</div>
                            <AiOutlinePlusCircle
                              onClick={() => addTicket(item, event)}
                              className="text-2xl h-6 w-6 text-gray-400 hover:text-rose-300"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {cartLength > 0 && (
                    <PayNow className="hidden sm:block" cartItems={cartItems} />
                  )}
                </div>
                <div className="w-[405px] px-10  bg-gray-100">
                  <div className="hidden sm:flex my-7 h-[106px] w-[317px] mx-auto rounded-xl self-center overflow-hidden">
                    <Image
                      alt={event.title}
                      className="object-cover h-full w-full"
                      src={event.image}
                      height={105}
                      width={317}
                      objectFit="cover"
                    />
                  </div>
                  <div className="my-3 mx-auto">
                    <h2 className="text-sm font-bold">Order Summary</h2>
                    <div className="">
                      <div>
                        {cartItems.map((item) => {
                          return (
                            item.count > 0 && (
                              <div
                                key={item.id}
                                className="flex items-center justify-between my-2 0 font-medium"
                              >
                                <div className="flex gap-[4px] text-gray-700 text-xs">
                                  <div className="">
                                    {item.count} x {item.title}
                                  </div>
                                  <div className="">{event.title}</div>
                                </div>

                                <div className="text-gray-700 text-xs">
                                  {formatter.format(item.price)}
                                </div>
                              </div>
                            )
                          );
                        })}
                      </div>
                      <hr />
                    </div>
                    <div className="flex justify-between items-center my-2 text-xs text-gray-700">
                      <div className="text-black">Subtotal:</div>
                      <span className="text-black font-bold">
                        {" "}
                        {formatter.format(total)}
                      </span>
                    </div>
                    <div className="border-b border-gray-300 my-5"></div>

                    <div className="flex mb-5 justify-between items-center my-2 text-xs text-gray-700">
                      <div className="text-black font-bold">Total:</div>
                      <span className="text-rose-400 font-bold">
                        {formatter.format(total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </div>
    </div>
  );
};

export default EventDetail;
