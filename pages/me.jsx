import { useEffect, useState } from "react";
// import TicketCard from "../components/card/TicketCard";
import { Meta } from "../layout/Meta";
import { serverUrl } from "../config";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import "swiper/css";
import "swiper/css/virtual";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper";

const TicketCard = dynamic(() => import("../components/card/TicketCard"));

const Me = () => {
  const { data: session } = useSession();
  const [ticketsList, setTicketsList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/signin");
    } else {
      (async () => {
        const res = await fetch(
          `${serverUrl}/my-tickets/?user=${session?.user.id}`
        );
        const data = await res.json();
        // console.log("data", data);
        if (res.status === 200) {
          setTicketsList(data.results);
        }
      })();
    }
  }, [session, router]);

  return (
    <Meta className="md:bg-inherit ">
      <div className="m-auto top-0 bottom-0">
        <div className="w-full px-10 py-40 m-auto sm:h-screen">
          <h1 className="pb-7 sm:text-black text-2xl sm:text-4xl font-bold">
            Tickets
          </h1>
          {ticketsList.length > 0 ? (
            <p className=" sm:hidden my-3 text-sm flex justify-center w-full">
              Swipe to see tickets
            </p>
          ) : (
            <p className=" sm:hidden my-3 text-sm flex justify-center w-full">
              {session?.user.name} You have no tickets
            </p>
          )}
          <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ticketsList?.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                image={session?.user.image}
              />
            ))}
          </div>
          <Swiper
            modules={[Virtual]}
            spaceBetween={50}
            slidesPerView={1}
            virtual
            className="sm:hidden my-7"
          >
            {ticketsList.map((item) => {
              return (
                <SwiperSlide key={item.id}>
                  <TicketCard ticket={item} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </Meta>
  );
};

export default Me;
