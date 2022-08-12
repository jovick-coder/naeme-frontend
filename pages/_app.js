import "../styles/global.css";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { SessionProvider } from "next-auth/react";
import { motion } from "framer-motion";
import { Meta } from "../layout/Meta";
import "swiper/css";
import "swiper/css/virtual";
import dynamic from "next/dynamic";
import "aos/dist/aos.css";
const Shared = dynamic(() => import("../layout/shared"));
const Nav = dynamic(() => import("../layout/Nav"), { ssr: true });

const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  {
    ssr: true,
  }
);

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  router,
}) {
  return (
    <main className="max-w-screen-xl md:px-7 mx-auto">
      <SessionProvider session={session}>
        <Shared>
          <AnimatePresence>
            <motion.div
              key={router.route}
              initial="pageInitial"
              animate="pageAnimate"
              exit="pageExit"
              variants={{
                pageInitial: {
                  opacity: 0,
                },
                pageAnimate: {
                  opacity: 1,
                },
                pageExit: {
                  backgroundColor: "inherit",
                  opacity: 0,
                  filter: "ease-out",
                },
              }}
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </Shared>
      </SessionProvider>
    </main>
  );
}
