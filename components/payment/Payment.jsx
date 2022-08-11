import React, { useState } from "react";
import { PaystackButton } from "react-paystack";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { serverUrl, paymentKey } from "../../config";

const PayNow = ({ cartItems, className }) => {
  const { data: session } = useSession();

  const router = useRouter();

  const total = cartItems.reduce((acc, item) => {
    return acc + item.price * item.count;
  }, 0);

  const paymentProps = {
    email: session?.user.email,
    amount: total * 100,
    publicKey: paymentKey,
    text: "Pay Now",
    onSuccess: async (reference) => {
      cartItems?.map((item) => {
        console.log("url", `${serverUrl}/api/cart/remove/${item.id}`);
        if (reference.message === "Approved") {
          const postTicket = async () => {
            const response = await fetch(`${serverUrl}/my-tickets/`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                price: item.price,
                event: item.event?.title,
                title: item.title,
                ticket: item.id,
                user: session?.user.id,
                quantity: item.count,
                transactionId: reference.transaction,
              }),
            });
            // console.log("response", response);
            if (response.status === 201) {
              // console.log("ticket created");
              router.push("/me");
            } else {
              // console.log("ticket not created");
            }
          };
          postTicket();
        }
      });
    },
    onClose: () => {
      return;
    },
  };
  return (
    <div className="App">
      <button className={`pay-button text-xs px-3 ${className}`}>
        <PaystackButton {...paymentProps} />
      </button>
    </div>
  );
};

export default PayNow;
