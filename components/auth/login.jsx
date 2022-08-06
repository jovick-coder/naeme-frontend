import { Button, Modal, ModalBody, ModalOverlay } from "@nature-ui/core";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "../Spinner";
import {
  LoadingContext,
  ErrorContext,
  LogContext,
  UserContext,
  AuthContext,
} from "../../context/Context";
import { useForm } from "react-hook-form";
import Label from "../ui/Field";
import { Meta } from "../../layout/Meta";

const Login = ({ logToggle, setLogToggle }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { loading, setLoading } = useContext(LoadingContext);

  const toggle = () => {
    setLogToggle(!logToggle);
  };
  const { error, setError } = useContext(ErrorContext);
  const { login, setLogin } = useContext(LogContext);
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const [status, setStatus] = useState({
    message: null,
    status: null,
  });
  const router = useRouter();

  const onSubmit = async (data) => {
    const { email, password } = data;
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const LogData = await response.json();

      if (response.status === 200) {
        setAuthenticated(true);
        setLogin(true);
        setLoading(false);
        toggle();
        router.push("/events");
      } else {
        return setStatus({
          message: LogData.message,
          status: LogData.status,
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Meta>
      <div className="cursor-pointer" onClick={toggle}>
        Login
      </div>

      <Modal isCentered isOpen={logToggle}>
        <ModalOverlay className="flex items-center">
          <div
            style={{
              width: "400px",
            }}
            className="grid bg-white mx-7 rounded-xs"
          >
            <div className="flex justify-between items-center p-4">
              <div className="font-bold flex-1 text-2xl text-wine-500">
                Welcome Back
              </div>
              <Button
                className="cursor-pointer flex items-center justify-center text-2xl rounded-xs bg-slate-200"
                onClick={toggle}
              >
                x
              </Button>
            </div>
            <ModalBody className="grid items-center">
              <form onSubmit={handleSubmit(onSubmit)}>
                {errors.email && (
                  <span className="text-red-500">Email is required</span>
                )}
                <Label label="Email">
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    className="outline-none border h-10 p-2 rounded w-full border-slate-300 bg-none my-2"
                  />
                </Label>
                {errors.password && (
                  <span className="text-red-500">Password is required</span>
                )}
                <Label label="Password">
                  <input
                    type="password"
                    {...register("password", { required: true })}
                    className="outline-none p-2 border w-full rounded h-10 border-slate-300 bg-none my-2"
                  />
                </Label>
                {status.status === "error" && (
                  <p className="text-red-700">{status.message}</p>
                )}
                {status.status === "success" && (
                  <p className="text-green-500">{status.message}</p>
                )}
                <Button
                  className={`${
                    loading ? "bg-gray-300 rounded-xs w-full my-3" : ""
                  }rounded-xs w-full my-3 flex items-center justify-center`}
                >
                  {loading ? <Spinner /> : <span>Login</span>}
                </Button>
              </form>
            </ModalBody>
          </div>
        </ModalOverlay>
      </Modal>
    </Meta>
  );
};

export default Login;
