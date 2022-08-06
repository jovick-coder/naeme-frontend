import "../styles/global.css";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { SessionProvider } from "next-auth/react";
import { motion } from "framer-motion";
import { Meta } from "../layout/Meta";
import dynamic from "next/dynamic";
import "aos/dist/aos.css";
const Shared = dynamic(() => import("../layout/shared"));
const Nav = dynamic(() => import("../layout/Nav"));

const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  {
    ssr: false,
  }
);

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  router,
}) {
  return (
    <SessionProvider session={session}>
      <Shared>
        <Meta>
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
              <Nav />
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </Meta>
      </Shared>
    </SessionProvider>
  );
}
