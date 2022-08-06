// import { Stack } from "@nature-ui/core";
import { useRouter } from "next/router";
import { motion, useAnimion } from "framer-motion";
import moment from "moment";
import dynamic from "next/dynamic";
import Image from "next/image";

const Stack = dynamic(() =>
  import("@nature-ui/core").then((module) => module.Stack)
);

const Card = ({ event }) => {
  const router = useRouter();
  function showDetailsHandler() {
    router.push(`event/${event.id}`);
  }
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  return (
    <Stack
      onClick={showDetailsHandler}
      className="max-w-[380px] hover:shadow-md border overflow-hidden rounded-sm m-6"
    >
      <motion.div className="max-h-[200px] flex w-full overflow-hidden mb-1">
        <Image
          className="hover:scale-105 transition-all overflow-hidden duration-500"
          height={200}
          width={400}
          objectPosition="center"
          objectFit="cover"
          src={event.image}
          alt={event.title}
        />
      </motion.div>
      <div className="z-10 bg-white flex px-4 pt-2 flex-col">
        <Stack row className="items-center justify-between">
          <p
            style={{
              fontFamily: "Sans-serif",
            }}
            className="text-md text-gray-800 font-bold"
          >
            {event.title}
          </p>
        </Stack>

        <div className="flex flex-col h-10 py-1 justify-between mb-4">
          {event.paid === true ? (
            <div className="font-medium text-rose-500 text-sm">
              {event.lowest_price === event.highest_price ? (
                <div className="">{formatter.format(event.lowest_price)}</div>
              ) : (
                <>
                  {formatter.format(event.lowest_price)} -{" "}
                  {formatter.format(event.highest_price)}
                </>
              )}
            </div>
          ) : (
            <div className="font-medium text-sky-700 text-md">Free event</div>
          )}

          <p className="flex-1 text-xs">
            {moment(event.date).format("MMMM Do YYYY.")}{" "}
          </p>
        </div>
      </div>
    </Stack>
  );
};

export default Card;
