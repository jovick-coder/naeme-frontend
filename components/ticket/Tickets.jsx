import dynamic from "next/dynamic";
import { useDisclosure } from "@nature-ui/core";

const Modal = dynamic(
  () => import("@nature-ui/core").then((module) => module.Modal),
  {
    ssr: false,
  }
);
const ModalOverlay = dynamic(
  () => import("@nature-ui/core").then((module) => module.ModalOverlay),
  {
    ssr: false,
  }
);
const ModalContent = dynamic(
  () => import("@nature-ui/core").then((module) => module.ModalContent),
  {
    ssr: false,
  }
);
const ModalHeader = dynamic(
  () => import("@nature-ui/core").then((module) => module.ModalHeader),
  {
    ssr: false,
  }
);

const ModalFooter = dynamic(
  () => import("@nature-ui/core").then((module) => module.ModalFooter),
  {
    ssr: false,
  }
);
const ModalBody = dynamic(
  () => import("@nature-ui/core").then((module) => module.ModalBody),
  {
    ssr: false,
  }
);
const ModalCloseButton = dynamic(
  () => import("@nature-ui/core").then((module) => module.ModalCloseButton),
  {
    ssr: false,
  }
);
const Button = dynamic(
  () => import("@nature-ui/core").then((module) => module.Button),
  {
    ssr: false,
  }
);

import { useSession } from "next-auth/react";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Fade, ScaleFade, Slide, SlideFade } from "@nature-ui/core";
import { useRouter } from "next/router";
import {
  ErrorContext,
  EventContext,
  LoadingContext,
} from "../../context/Context";
import Spinner from "../Spinner";
import { serverUrl } from "../../config/index";

const Tickets = () => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paid, setPaid] = useState(true);
  const { loading, setLoading } = useContext(LoadingContext);
  const { event } = useContext(EventContext);
  const { error, setError } = useContext(ErrorContext);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { name, price, qty } = data;
    if (price === "" || qty === "") {
      setError("Please fill all the fields");
    }

    const formData = new FormData();
    formData.append("title", name);
    if (paid === true) {
      formData.append("paid", true);
    } else {
      formData.append("paid", false);
    }
    formData.append("quantity", qty);
    formData.append("price", price);
    formData.append("event", event);
    formData.append("owner", session?.user.id);

    const url = `${serverUrl}/tickets/`;

    try {
      setLoading(true);
      setError(false);
      await axios({
        method: "POST",
        url: url,
        data: formData,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((response) => {
          setError(false);
          setLoading(false);
          onOpen();
          // console.log("Response:", response);
        })
        .catch((errors) => {
          setLoading(false);
          setError(true);
          // console.log("Error:", errors);
        });
    } catch (errors) {
      setError(true);
      setLoading(false);
      // console.log("Error:", errors);
    }
    reset();
  };

  return (
    <div className="max-w-screen-lg ">
      <div className="text-2xl sm:text-3xl lg:text-4xl">Create Tickets</div>
      <div className="gap-10 w-full  flex justify-start my-5">
        <button
          onClick={() => setPaid(true)}
          className="rounded-xs bg-gray-200 py-1 px-2 text-gray-900 w-32"
        >
          Paid Ticket
        </button>
        <button
          onClick={() => setPaid(false)}
          className="rounded-xs  py-1 px-2 bg-gray-300 active:bg-emerald-600 w-32 "
        >
          Free Ticket
        </button>
      </div>
      <div className="gap-10 w-full  flex justify-start my-5"></div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row gap-7 w-full py-7 px-4 border rounded-sm">
            <div className="flex flex-col ">
              {errors.name && (
                <span className="text-red-500">Ticket name is required</span>
              )}
              <label className="text-sm">Ticket Type</label>
              <input
                className="outline-none border p-2 border-slate-300 bg-none my-2"
                type="text"
                placeholder={!paid ? "Free Ticket" : "Regular Ticket"}
                {...register("name", { required: true })}
                variant="none"
              />
            </div>
            {paid && (
              <div className="flex flex-col ">
                {errors.qty && (
                  <span className="text-red-500">Quantity required</span>
                )}
                <label className="text-sm">Ticket Quantity</label>
                <input
                  className="outline-none border p-2 border-slate-300 bg-none my-2"
                  type="number"
                  placeholder="0"
                  {...register("qty", { required: true })}
                  variant="none"
                />
              </div>
            )}

            {paid && (
              <div className="flex flex-col ">
                <label className="text-sm">Ticket Price</label>
                <input
                  className="outline-none border p-2 border-slate-300 bg-none my-2"
                  type="number"
                  step="0.0"
                  placeholder="price"
                  {...register("price", { required: false })}
                  variant="none"
                />
              </div>
            )}
          </div>

          {session?.user && (
            <div className="flex items-center cursor-pointer justify-center py-2 rounded-sm my-10 bg-gray-200 w-40">
              {loading ? (
                <Spinner />
              ) : (
                <input
                  type="submit"
                  className="flex items-center justify-center"
                />
              )}
            </div>
          )}
        </form>
      </div>

      <div className="mt-20">
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay>
            <ModalContent>
              <ModalHeader className="text-sky-500 text-4xl">
                Successful
              </ModalHeader>
              <ModalCloseButton className=" mt-4 mr-2" />
              <ModalBody>
                <p>
                  <span>Ticket Created Successfully</span> {""}
                  {!paid && (
                    <span>
                      do ensure to create just one ticket for this free event.
                    </span>
                  )}
                </p>
              </ModalBody>

              <ModalFooter>
                {paid && (
                  <button
                    className="rounded-sm text-xs bg-gray-200 py-1 px-2 mr-6"
                    onClick={onClose}
                  >
                    Add More
                  </button>
                )}
                <button
                  className="rounded-sm text-xs bg-gray-200 py-1 px-2 mr-6"
                  onClick={() => router.push(`/event/${event}`)}
                >
                  Done
                </button>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </div>
    </div>
  );
};

export default Tickets;
