// import Card from "../card/Card";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import { motion, useAnimation } from "framer-motion";
const Card = dynamic(() => import("../card/Card"));
import { useEffect } from "react";
import AOS from "aos";

const EventList = ({ events }) => {
  useEffect(() => {
    AOS.init({ duration: 2000 });
    AOS.refresh();
  }, []);

  return (
    <>
      <div className="pt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 place-items-center lg:place-items-center">
        {events?.map((event) => (
          <div data-aos="zoom-in-up" key={event.id}>
            <Card event={event} />
          </div>
        ))}
      </div>
    </>
  );
};

export default EventList;
