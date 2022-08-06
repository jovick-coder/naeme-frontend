import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { Button, Modal, ModalBody, ModalOverlay } from "@nature-ui/core";
import { LoadingContext, UserContext } from "../../context/Context";
import { useForm } from "react-hook-form";
import Spinner from "../Spinner";

function Register({ regToggle, setRegToggle }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { user, setUser } = useContext(UserContext);

  const [status, setStatus] = useState({
    success: "",
    email: "",
    password: "",
  });

  const [Error, setError] = useState({
    emailError: "",
    passwordError: "",
  });
  // console.log("err:", Error);

  const router = useRouter();

  const { loading, setLoading } = useContext(LoadingContext);

  const toggle = () => {
    setRegToggle(!regToggle);
  };
  const onSubmit = async (data) => {
    const { email, password, password2 } = data;
    try {
      setStatus({ success: "", email: "", password: "" });
      setError({ emailError: "", passwordError: "" });
      setLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          password2,
        }),
      });
      const data = await response.json();
      if (response.status === 201) {
        setStatus({
          success: "success",
          email: data?.email,
          id: data?.id,
        });
        setLoading(false);
        toggle();
      } else if (response.ok !== true) {
        setError({
          emailError: data?.email,
          passwordError: data?.password,
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  setUser(status);
  return (
    <>
      <div className="cursor-pointer" onClick={toggle}>
        Register
      </div>

      <Modal isCentered isOpen={regToggle}>
        <ModalOverlay className="flex items-center">
          <div className="grid max-w-lg bg-white rounded-xs">
            <div className="flex justify-between items-center p-4">
              <div className="font-bold flex-1 text-xl sm:text-2xl">
                Create Account
              </div>
              <Button
                className="cursor-pointer flex items-center justify-center text-2xl rounded-xs bg-slate-200"
                onClick={toggle}
              >
                x
              </Button>
            </div>
            <ModalBody className="flex  items-center">
              <form
                className="bg-transparent flex flex-col gap-2 w-full max-w-md"
                onSubmit={handleSubmit(onSubmit)}
              >
                {errors.email && (
                  <span className="text-red-500">Email is required</span>
                )}
                <input
                  className="outline-none rounded-xs  border sm:w-96  p-2 h-10 border-slate-300 bg-none my-2"
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: true })}
                  variant="none"
                />

                {errors.password && (
                  <span className="text-red-500">Password is required</span>
                )}
                <input
                  className="outline-none  rounded-xs  border h-10 p-2 border-slate-300 bg-none my-2"
                  type="password"
                  placeholder="Password*"
                  {...register("password", { required: true })}
                  variant="none"
                />
                {errors.password2 && (
                  <span className="text-red-500">
                    Confirm Password is required
                  </span>
                )}
                <input
                  className="outline-none border  rounded-xs  h-10 p-2 border-slate-300 bg-none my-2"
                  type="password"
                  placeholder="Confirm Password*"
                  {...register("password2", { required: true })}
                  variant="none"
                />
                {status.success === "success" && (
                  <span className="text-green-500">{status.success}</span>
                )}

                {Error.emailError && (
                  <span className="text-red-500">{Error.emailError}</span>
                )}
                {Error.passwordError && (
                  <span className="text-red-500">{Error.passwordError}</span>
                )}
                <Button
                  className={`${
                    loading ? "bg-gray-300 rounded-xs w-full my-3" : ""
                  }rounded-xs w-full my-3 flex items-center justify-center`}
                >
                  {loading ? <Spinner /> : <span>Sign Up</span>}
                </Button>
              </form>
            </ModalBody>
          </div>
        </ModalOverlay>
      </Modal>
    </>
  );
}
export default Register;
