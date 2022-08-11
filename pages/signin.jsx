import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { LoadingContext } from "../context/Context";
import { Meta } from "../layout/Meta";
import Spinner from "../components/Spinner";
import { useSession, getProviders, getSession, signIn } from "next-auth/react";

const Signin = ({ providers }) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const { data: session } = useSession();
  const router = useRouter();

  console.log("session", session);

  console.log("providers", providers);
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
        <em>Please login with your prefered social media,</em>
        <div className="bg-white p-4 hover:shadow-lg grid sm:w-[500px] w-full">
          <div className="flex mt-4 flex-col content-center gap-4">
            <div
              className={`${
                loading ? "rounded-xs  w-full my-3" : ""
              }rounded-xs w-full my-3 cursor-pointer flex flex-col gap-y-4 justify-center items-center py-3`}
            >
              {loading ? (
                <Spinner />
              ) : (
                <div>
                  <div
                    onClick={() => {
                      setLoading(true);
                      signIn(providers.google.id).catch((error) => {
                        setLoading(false);
                        console.error(error);
                      });
                    }}
                    className="gap-4 hover:bg-slate-200 py-2 text-xs rounded-sm flex items-center justify-between"
                  >
                    <span className="px-10 py-3 rounded-2xl border bg-gray-50">
                      Sign in with {providers.google.id}
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      setLoading(true);
                      signIn(providers.twitter.id).catch((error) => {
                        setLoading(false);
                        console.error(error);
                      });
                    }}
                    className="gap-4 hover:bg-slate-200 py-2 text-xs rounded-sm flex items-center justify-between"
                  >
                    <span className="px-10 py-3 rounded-2xl border bg-gray-50">
                      Sign in with {providers.twitter.id}
                    </span>
                  </div>
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
