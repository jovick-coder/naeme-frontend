import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
import { Button } from "@nature-ui/core";
import {
  ErrorContext,
  EventContext,
  LoadingContext,
  UserContext,
} from "../../context/Context";
import Spinner from "../Spinner";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import { serverUrl } from "../../config/index";
import Footer from "../Footer";

const EditEvent = ({ event, toggle, setToggle }) => {
  const [startdate, setStartDate] = useState(null);
  const [enddate, setEndDate] = useState(null);
  const [startdateError, setStartDateError] = useState(false);
  const [enddateError, setEndDateError] = useState(false);
  const [eventState, setEventState] = useState(false);
  const [online, setOnline] = useState(event.online);
  const { loading, setLoading } = useContext(LoadingContext);
  const [error, setError] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [state, setState] = React.useState({
    title: event.title,
    organizer: event.organizer,
    description: event.description,
    image: event.image,
    location: event.location,
    start_date: event.start_date,
    end_date: event.end_date,
    start_time: event.start_time,
    end_time: event.end_time,
    facebook: event.facebook,
    twitter: event.twitter,
    instagram: event.instagram,
    website: event.website,
    virtual_link: event.virtual_link,
  });

  const toggleModal = () => {
    setToggle(!toggle);
  };

  const renderStartDate = ({ ref }) => (
    <input
      readOnly
      ref={ref}
      placeholder="enter start date"
      required
      value={
        startdate ? `${startdate.year}-${startdate.month}-${startdate.day}` : ""
      }
      className="text-xs border w-full h-10 rounded-xs px-4 my-2" // a styling class
    />
  );

  const renderEndDate = ({ ref }) => (
    <input
      readOnly
      ref={ref}
      placeholder="enter end date"
      required
      value={enddate ? `${enddate.year}-${enddate.month}-${enddate.day}` : ""}
      className="text-xs border w-full h-10 rounded-xs px-4 my-2" // a styling class
    />
  );

  const onSubmit = async (data) => {
    // console.log("data:", data);
    setLoading(true);
    const formData = new FormData();
    formData.append("id", event.id);
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.image[0] !== undefined) {
      formData.append("image", data.image[0]);
    }
    formData.append("location", data.location);
    formData.append("online", online);
    formData.append("start_date", data.start_date);
    if (startdate !== null) {
      const start_date = `${startdate.year}-${startdate.month}-${startdate.day}`;
      formData.append("start_date", start_date);
    } else {
      setStartDateError(true);
      // console.log("startdate", startdate);
    }
    if (enddate !== null) {
      const end_date = `${enddate.year}-${enddate.month}-${enddate.day}`;
      // console.log("end_date", end_date);
      formData.append("end_date", end_date);
    } else {
      setEndDateError(true);
      // console.log("enddate", enddate);
    }
    formData.append("start_time", data.start_time);
    formData.append("end_time", data.end_time);
    formData.append("facebook", data.facebook);
    formData.append("twitter", data.twitter);
    formData.append("instagram", data.instagram);
    formData.append("website", data.website);
    if (online === true) {
      formData.append("virtual_link", data.virtual_link);
    }
    formData.append("organizer", data.organizer);
    formData.append("owner", session?.user.id);

    if (session?.user.id === event.owner) {
      try {
        if (startdate !== null && enddate !== null) {
          setLoading(true);
          const response = await axios.put(
            `${serverUrl}/events/${event.id}/`,
            formData,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );

          // console.log("response", response);
          if (response.status === 200) {
            setLoading(false);
            setToggle(!toggle);
            router.push(`/event/${response.data.id}`);
          } else {
            setLoading(false);
            setError(true);
          }
        }
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        return error;
      }
    }
  };

  return (
    <div className="">
      <FiEdit onClick={toggleModal} className="text-2xl text-green-700" />

      <div
        style={{
          zIndex: "100",
        }}
        className={`${
          toggle ? "block" : "hidden"
        } lg:px-60 pb-7 px-5 bg-white z-50 fixed top-0 right-0 left-0 h-screen w-screen overflow-x-hidden `}
      >
        <div className="flex fixed lg:px-60 top-0 backdrop-blur-xl left-0 right-0 justify-between items-center py-7 p-4 px-4">
          <div className="font-bold flex-1 sm:text-xl text-wine-500">
            Edit <span className="text-rose-500">{event.title}</span>
          </div>
          <Button
            className="cursor-pointer flex items-center justify-center text-2xl rounded-xs bg-slate-200"
            onClick={toggleModal}
          >
            x
          </Button>
        </div>
        <>
          <form
            className="grid m-auto mt-28 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="bg-gray-50 px-4 py-4 rounded-lg">
              <h1 className="text-xl mb-4 sm:text-2xl font-bold text-gray-900">
                Basic Event Info
              </h1>
              <div className="mb-5">
                <label className="text-sm semi-bold">Title</label>
                <div className="flex mb-4 flex-col ">
                  <input
                    className={`${
                      errors.title ? "border-red-500" : "border-slate-200"
                    } outline-none border p-2 h-14 text-xs rounded-xs bg-none my-2`}
                    type="text"
                    value={state.title}
                    placeholder="Be descriptive about your event"
                    {...register("title", {
                      onChange: (e) => {
                        setState({ ...state, title: e.target.value });
                      },
                    })}
                    variant="none"
                  />
                </div>

                <label className="text-sm semi-bold">Organizer</label>
                <div className="flex flex-col mb-4 ">
                  <input
                    className={`${
                      errors.organizer ? "border-red-500" : "border-slate-200"
                    } outline-none border p-2 h-14 text-xs rounded-xs bg-none my-2`}
                    type="text"
                    value={state.organizer}
                    placeholder="let people know who is organizing"
                    {...register("organizer", {
                      onChange: (e) => {
                        setState({ ...state, organizer: e.target.value });
                      },
                    })}
                    variant="none"
                  />
                </div>
              </div>
            </div>
            <hr className="my-20" />
            <div className="bg-gray-50 px-4 py-4 rounded-lg">
              <h1 className="text-xl mb-4 sm:text-2xl font-bold text-gray-900">
                Event Details
              </h1>
              <label className="text-sm semi-bold">
                Event Image (Leave blank to use previous image)
              </label>
              <div className="flex justify-center mt-2 mb-10">
                <div className="rounded-lg w-full shadow-lg bg-gray-50">
                  <div className="m-4">
                    <br />

                    <div className="flex items-center bg-white justify-center w-full">
                      <label className="flex flex-col w-full h-24 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-200">
                        <div className="flex flex-col items-center justify-center pt-7">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-gray-500 group-hover:text-gray-100"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                            Add event image
                          </p>
                        </div>
                        <input
                          className="w-full opacity-0 px-3 py-1.5 text-base font-normal"
                          type="file"
                          {...register("image", {
                            onChange: (e) => {
                              setState({ ...state, image: e.target.files });
                            },
                            required: false,
                          })}
                          variant="none"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <label className="text-sm semi-bold">Description</label>
              <div className="flex flex-col mb-4 ">
                <textarea
                  className="outline-none text-xs border p-2 h-20 rounded-xs sm:h-36  border-slate-300 bg-none my-2"
                  type="text"
                  placeholder="Tell people about your event"
                  value={state.description}
                  {...register("description", {
                    onChange: (e) => {
                      setState({ ...state, description: e.target.value });
                    },
                  })}
                  variant="none"
                />
              </div>
            </div>
            <hr className="sm:my-20 my-10 " />
            <div className="bg-gray-50 px-4 py-4 text-gray-700 rounded-lg">
              <h1 className="text-xl sm:text-2xl font-bold">Location</h1>
              <label className="text-xs">
                Help people in the area discover your event&apos;s venue
              </label>
              <div className="flex w-full text-xs items-center my-4 justify-start">
                <div
                  onClick={() => setOnline(false)}
                  className={`${
                    online === false ? "text-sky-600 border-sky-600" : ""
                  } border px-3 py-2 mr-3 cursor-pointer active:border-1 rounded-xs`}
                >
                  Offline event
                </div>
                <div
                  onClick={() => setOnline(true)}
                  className={`${
                    online === true ? "text-emerald-600 border-emerald-600" : ""
                  } border px-3 py-2 mr-3 cursor-pointer active:border-1 rounded-xs`}
                >
                  Online event
                </div>
              </div>

              {!online ? (
                <div className="flex text-xs flex-col">
                  <label className="mt-7">Venue Location</label>

                  <input
                    className="outline-none rounded-xs border px-2 h-12 w-full border-slate-300 bg-none my-2"
                    type="text"
                    placeholder="event venue location"
                    value={!state?.location ? "" : state.location}
                    {...register("location", {
                      onChange: (e) => {
                        setState({ ...state, location: e.target.value });
                      },
                    })}
                    variant="none"
                  />
                </div>
              ) : (
                <div className="text-xs mt-10 flex flex-col">
                  <label className="mt-7 font-medium">
                    Connect your event with your prefered virtual venue
                    provider, add a link that could be used to validate your
                    event attendies within your virtual venue e.g Google meet,
                    Zoom, etc.
                  </label>
                  <div className="flex mt-4 flex-col">
                    <input
                      className="outline-none border p-2 h-10 w-full  border-slate-200 bg-none my-2 rounded-xs"
                      type="url"
                      value={!state?.virtual_link ? "" : state.virtual_link}
                      placeholder="enter your virtual venue link"
                      {...register("virtual_link", {
                        onChange: (e) => {
                          setState({ ...state, virtual_link: e.target.value });
                        },
                      })}
                      variant="none"
                    />
                  </div>
                </div>
              )}
            </div>
            <hr className="my-20" />
            <div className="bg-gray-50 text-gray-700 text-xs px-4 py-2 rounded-lg">
              <h1 className="text-xl mb-2 sm:text-2xl font-bold text-gray-900">
                Social Media Platforms
              </h1>
              <label className="text-gray-900 text-xs leading-tight">
                Connect your event with your prefered social media platform to
                help people connect with you.{" "}
                <span>
                  <em>Optional</em>
                </span>
              </label>
              <div className="grid md:grid-cols-2 sm:gap-7 my-5 ">
                <input
                  className="outline-none border p-2 h-10 w-full  border-slate-200 bg-none my-2 rounded-xs"
                  type="url"
                  placeholder="facebook url"
                  value={!state?.facebook ? "" : state.facebook}
                  {...register("facebook", {
                    onChange: (e) => {
                      setState({ ...state, facebook: e.target.value });
                    },
                  })}
                  variant="none"
                />
                <input
                  className="outline-none border p-2 h-10 w-full  border-slate-300 bg-none my-2 rounded-xs"
                  type="url"
                  placeholder="twitter url"
                  value={!state?.twitter ? "" : state.twitter}
                  {...register("twitter", {
                    onChange: (e) => {
                      setState({ ...state, twitter: e.target.value });
                    },
                  })}
                  variant="none"
                />
                <input
                  className="outline-none border p-2 h-10 w-full  border-slate-300 bg-none my-2 rounded-xs"
                  type="url"
                  placeholder="instagram url"
                  value={!state?.instagram ? "" : state.instagram}
                  {...register("instagram", {
                    onChange: (e) => {
                      setState({ ...state, instagram: e.target.value });
                    },
                  })}
                  variant="none"
                />

                <input
                  className="outline-none border p-2 h-10 w-full  border-slate-300 bg-none my-2 rounded-xs"
                  type="url"
                  placeholder="website url"
                  value={!state?.website ? "" : state.website}
                  {...register("website", {
                    onChange: (e) => {
                      setState({ ...state, website: e.target.value });
                    },
                  })}
                  variant="none"
                />
              </div>
            </div>
            <hr className="sm:my-20 my-10" />
            <div className="bg-gray-50 px-4 text-xs rounded-lg py-5">
              <h1 className="text-xl mb-2 sm:text-2xl font-bold text-gray-900">
                Date & Time
              </h1>
              <label className="text-gray-900 leading-tight">
                Tell people when your event will be happening.{" "}
                <span>
                  <em>important</em>
                </span>
              </label>

              <div className="grid  md:grid-cols-2 mt-6 gap-7">
                <div className="flex flex-col ">
                  {startdateError &&
                    setTimeout(() => {
                      setError(false);
                    }, 7000) && (
                      <div className="text-red-500 text-xs">
                        This field is required
                      </div>
                    )}
                  <label>Start Date</label>

                  <DatePicker
                    value={startdate}
                    onChange={setStartDate}
                    renderInput={renderStartDate} // render a custom input
                    shouldHighlightWeekends
                  />
                </div>
                <div className="flex flex-col">
                  {enddateError &&
                    setTimeout(() => {
                      setError(false);
                    }, 7000) && (
                      <div className="text-red-500 text-xs">
                        This field is required
                      </div>
                    )}
                  <label>End Date</label>
                  <DatePicker
                    value={enddate}
                    onChange={setEndDate}
                    renderInput={renderEndDate} // render a custom input
                    shouldHighlightWeekends
                  />
                </div>
                <div className="flex flex-col">
                  <label>Start Time</label>
                  <input
                    className="outline-none border p-2 h-10 w-full hover:border-blue-500 bg-none my-2"
                    type="time"
                    value={!state?.start_time ? "" : state.start_time}
                    {...register("start_time", {
                      onChange: (e) => {
                        setState({ ...state, start_time: e.target.value });
                      },
                    })}
                    variant="none"
                  />
                </div>

                <div className="flex flex-col">
                  {errors.end_time && (
                    <span className="text-red-500">this field is required</span>
                  )}
                  <label>End Time</label>
                  <input
                    className="outline-none border p-2 h-10 w-full hover:border-blue-500 bg-none my-2"
                    type="time"
                    value={!state?.end_time ? "" : state.end_time}
                    {...register("end_time", {
                      onChange: (e) => {
                        setState({ ...state, end_time: e.target.value });
                      },
                    })}
                    variant="none"
                  />
                </div>
              </div>
            </div>

            {error &&
              setTimeout(() => {
                setError(false);
              }, 3000) && (
                <div className="text-red-500 text-xs">
                  Something went wrong, please try again
                </div>
              )}
            {session?.user && (
              <div className="flex items-center cursor-pointer justify-center py-2 rounded-sm my-10 bg-gray-200 w-40">
                {loading ? (
                  <Spinner />
                ) : (
                  <button
                    type="submit"
                    className="flex items-center justify-center"
                  >
                    Submit
                  </button>
                )}
              </div>
            )}
          </form>
        </>
      </div>
    </div>
  );
};

export default EditEvent;
