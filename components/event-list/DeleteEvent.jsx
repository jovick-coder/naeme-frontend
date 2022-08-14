import { Fade, SlideFade, useDisclosure } from "@nature-ui/core";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useContext, useRef } from "react";
import { useRouter } from "next/router";
import { LoadingContext } from "../../context/Context";
import Spinner from "../Spinner";

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

import { serverUrl } from "../../config/index";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

function DeleteEvent({ event }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();
  const cancelRef = useRef();
  const { loading, setLoading } = useContext(LoadingContext);
  const router = useRouter();
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${serverUrl}/events/${event.id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (response.status === 204) {
        setLoading(false);
        onClose();
        router.push("/events");
      } else {
        setLoading(false);
      }
    } catch (err) {
      return err;
    }
  };

  return (
    <div>
      <RiDeleteBin6Line className="text-rose-500 text-2xl" onClick={onOpen} />
      <Modal isOpen={isOpen} isCentered onClose={onClose}>
        <ModalOverlay>
          <ModalContent className="rounded-sm">
            <ModalHeader> Please Confirm Delete!</ModalHeader>
            <ModalCloseButton />
            <ModalBody className="text-sm">
              Are you sure you want to{" "}
              <span className="text-red-500 font-bold">Delete </span>
              <span className="text-gray-900 font-bold">{event.title}? </span>
              This action is permanent and cannot be undone.
            </ModalBody>

            <ModalFooter className="">
              <Button
                className="rounded-sm mr-4"
                ref={cancelRef}
                onClick={onClose}
              >
                Cancel
              </Button>
              {loading ? (
                <Spinner />
              ) : (
                <Button
                  onClick={handleDelete}
                  color="rose-500"
                  className="rounded-sm"
                >
                  Delete
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </div>
  );
}

export default DeleteEvent;
