import React from "react";
import { signIn } from "next-auth/react";

export const Button1 = ({ children }) => {
  return (
    <button className="text-gray-100 mx-4 varient-ghost hover:bg-gray-100 hover:text-wine-600 px-8 block rounded-4xl bg-wine-600 py-2 transition ease-in-out delay-150 duration-300">
      {children}
    </button>
  );
};

export const Button2 = ({ provider }) => {
  return (
    <button
      onClick={() => signIn(provider.id)}
      className="text-wine-600 mx-4 px-8 varient-ghost hover:bg-wine-600 hover:text-gray-100 transition ease-in-out delay-150 duration-300                                                                                                                                                                                                                             block rounded-full bg-gray-100 py-2"
    >
      Sign in with {provider}
    </button>
  );
};
