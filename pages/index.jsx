import hero from "../public/mobile.png";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getEvents } from "../lib/events";
import { Meta } from "../layout/Meta";
import { useEffect } from "react";
const Image = dynamic(() => import("next/image").then((mod) => mod.default));
const Card = dynamic(() => import("../components/card/Card"));
const Footer = dynamic(() => import("../components/Footer"));
import AOS from "aos";

export async function getServerSideProps() {
  const events = await getEvents();
  return {
    props: { events },
  };
}

const Index = ({ events }) => {
  useEffect(() => {
    AOS.init({ duration: 2000 });
    AOS.refresh();
  }, []);
  return (
    <Meta
      title="BOOK YOUR TICKETS SEEMLESLY"
      description="Your One Stop Event Application"
    >
      <div className="items-center bg-[url('/hero.jpg')] sm:bg-[url('/le.jpg')] bg-cover bg-center bg-no-repeat bg-fixed h-screen grid sm:mt-20 lg:mt-0 ">
        <div
          data-aos="zoom-in"
          className="relative sm:mt-0 sm:flex mx-10 items-center xl:p-0 overflow-hidden"
        >
          <div className="flex-1 text-white sm:text-black sm:leading-tight font-extrabold sm:mt-32 lg:mt-0 mx-auto text-wine-700 text-[45px] sm:text-[70px]">
            BOOK <p>YOUR</p>
            <span className="text-rose-500 font-font-black">TICKETS </span>{" "}
            SEAMLESLY
          </div>
          <div className="hidden flex-1 lg:grid place-items-end w-full overflow-hidden ">
            <Image
              src={hero}
              height={646}
              width={342}
              className="scale-75 rotate-12 top-0 overflow-hidden"
              alt="hero"
            />
          </div>
          <Link href="/events">
            <button className="text-rose-500 sm:hidden text-lg mt-3 px-4 py-2 rounded-xs bg-white">
              HAPPENING NOW <span className="text-wine-700">&rarr;</span>
            </button>
          </Link>
        </div>
      </div>
      <div className="mb-10 hidden sm:block">
        <div className="mt-14 px-7 flex justify-between items-center">
          <h2 className="font-bold text-lg sm:text-2xl">Upcoming Event</h2>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 place-items-center">
          {events?.results.slice(0, 3).map((event) => (
            <div key={event.id}>
              <Card event={event} />
            </div>
          ))}
        </div>
        <div className="mt-14 px-7 flex justify-end items-center">
          <Link href="/events/">
            <button className="rounded-xs bg-gray-200 text-black px-2 py-1 block text-xs sm:text-lg">
              See More
            </button>
          </Link>
        </div>
      </div>
      <Footer className="" />
    </Meta>
  );
};

export default Index;