import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { LoadingContext } from "../context/Context";
import { Meta } from "../layout/Meta";
import Spinner from "../components/Spinner";
import { useSession, getProviders, getSession, signIn } from "next-auth/react";
import Image from "next/image";

const Signin = ({ providers }) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push("/events");
    }
  }, [session, router]);
  return (
    <Meta title="Add new event" content="welcome" className="">
      <div className="h-screen px-10 flex-col m-auto flex items-center justify-center">
        <div className="mx-auto text-center text-xl my-7 font-bold">
          Lets get you started with your account
        </div>
        <div className="bg-white border p-4 hover:shadow-lg grid sm:w-[400px] w-full">
          <div className="flex mt-4 flex-col content-center gap-4">
            {/* <div className="rounded-xs  py-3 bg-slate-200 w-full flex items-center px-8">
              <Login logToggle={logToggle} setLogToggle={setLogToggle} />
            </div> */}

            <div
              className={`${
                loading ? "rounded-xs  w-full my-3" : ""
              }rounded-xs w-full my-3 cursor-pointer flex justify-center items-center py-3 bg-slate-200`}
            >
              {loading ? (
                <Spinner />
              ) : (
                <div
                  key={providers.google.id}
                  href={`${providers.google.signinUrl}`}
                  onClick={() => {
                    setLoading(true);
                    signIn("google").catch((error) => {
                      setLoading(false);
                      console.error(error);
                    });
                  }}
                  className="gap-4 flex items-center justify-between  px-4"
                >
                  <Image
                    height={20}
                    width={20}
                    src="/Google.svg"
                    alt="google-logo"
                  />
                  <span className="px-4">
                    Sign in with {providers.google.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Meta>
  );
};

export default Signin;

export async function getServerSideProps(context) {
  const providers = await getProviders();
  const session = await getSession(context);
  return {
    props: {
      providers: providers,
      session: session,
    },
  };
}
