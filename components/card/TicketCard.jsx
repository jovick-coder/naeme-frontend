import { useState, useEffect } from "react";
import { IoTicketOutline } from "react-icons/io5";
// import { Stack } from "@nature-ui/core";
import { Countdown } from "../CountDown";
import moment from "moment";
import Image from "next/image";
import dynamic from "next/dynamic";
const Stack = dynamic(() =>
  import("@nature-ui/core").then((module) => module.Stack)
);

const TicketCard = ({ ticket }) => {
  const dt = moment(ticket.end_date + " " + ticket.end_time);
  const [isMounted, setIsMounted] = useState(false);

  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // console.log("ticket", dt);
  return (
    <Stack
      col
      className="py-7 bg-gray-100 sm:w-[310px] px-2 sm:my-7 border mx-auto rounded-3xl flex flex-col"
    >
      <div className="mx-auto flex h-56 w-56">
        <Image
          src={ticket.qr_code}
          alt="ticket owner"
          height={224}
          width={224}
        />
      </div>
      <div
        style={{
          fontFamily: "Montserrat Condensed",
        }}
        className="font-semibold text-gray-900 px-4 text-lg"
      >
        {ticket.event}
      </div>
      <div className="text-white flex mx-4">
        <div className="bg-rose-500 items-center px-3 flex rounded-4xl ">
          <IoTicketOutline size={25} className="px-1" />
          <p className="text-sm px-1">{ticket.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 grid-rows-2 gap-3">
        <div className="flex flex-col pl-4 place-content-center">
          <div className="text-gray-500 text-xs">Date</div>
          <div className="font-semibold text-sm">
            {moment(ticket.start_date).format("MMMM Do YYYY.")}
          </div>
        </div>
        <div className="flex flex-col pl-4 place-content-center">
          <div className="text-gray-500 text-xs">Time</div>
          <div className="font-semibold text-sm">
            {moment(ticket.start_time, "HH:mm").format("h:mm A")}
          </div>
        </div>
        <div className="flex flex-col pl-4 place-content-center">
          <div className="text-gray-500 text-xs">QTY</div>
          <div className="font-semibold text-sm">{ticket.quantity}</div>
        </div>
        <div className="flex flex-col pl-4 place-content-center">
          <div className="text-gray-500 text-xs">Cost</div>
          {ticket.price ? (
            <div className="font-semibold text-sm">
              {formatter.format(ticket.price)}
            </div>
          ) : (
            <div className="font-semibold text-sm">Free</div>
          )}
        </div>
      </div>
      <div className="grid px-4">
        {isMounted ? <Countdown datetime={dt?._i} /> : null}
      </div>
    </Stack>
  );
};

export default TicketCard;
