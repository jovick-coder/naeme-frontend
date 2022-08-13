import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Meta } from "../../layout/Meta";
import {
  ErrorContext,
  EventContext,
  LoadingContext,
} from "../../context/Context";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { serverUrl } from "../../config/index";
const Tickets = dynamic(() => import("../../components/ticket/Tickets"));
const Spinner = dynamic(() => import("../../components/Spinner"));
const DatePicker = dynamic(() =>
  import("@hassanmojab/react-modern-calendar-datepicker")
);

function Index() {
  const [startdate, setStartDate] = useState(null);
  const [enddate, setEndDate] = useState(null);
  const [startdateError, setStartDateError] = useState(false);
  const [enddateError, setEndDateError] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const { error, setError } = useContext(ErrorContext);
  const { event, setEvent } = useContext(EventContext);
  const [eventState, setEventState] = useState(false);
  const { data: session } = useSession();
  const [online, setOnline] = useState(false);

  // const stdartdate = `${selectedDay.year}-${selectedDay.month}-${selectedDay.day}`;
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) {
      router.push("/signin");
    }
  }, [router, session]);
  console.log("data:", session?.accessToken);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const renderStartDate = ({ ref }) => (
    <input
      readOnly
      ref={ref}
      placeholder="start date"
      required
      value={
        startdate ? `${startdate.year}-${startdate.month}-${startdate.day}` : ""
      }
      className="text-xs border w-full h-10 rounded-xs px-4 my-2 " // a styling class
    />
  );

  const renderEndDate = ({ ref }) => (
    <input
      readOnly
      ref={ref}
      placeholder="end date"
      required
      value={enddate ? `${enddate.year}-${enddate.month}-${enddate.day}` : ""}
      className="text-xs border w-full h-10 rounded-xs px-4 my-2" // a styling class
    />
  );

  const onSubmit = async (data) => {
    const {
      title,
      description,
      image,
      end_time,
      start_time,
      location,
      facebook,
      twitter,
      instagram,
      website,
      virtual_link,
      organizer,
    } = data;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image[0] !== null) {
      formData.append("image", image[0]);
    }
    formData.append("location", location);
    formData.append("online", online);
    if (startdate !== null) {
      const start_date = `${startdate.year}-${startdate.month}-${startdate.day}`;
      formData.append("start_date", start_date);
    } else {
      setStartDateError(true);
    }
    if (enddate !== null) {
      const end_date = `${enddate.year}-${enddate.month}-${enddate.day}`;
      formData.append("end_date", end_date);
    } else {
      setEndDateError(true);
    }
    formData.append("start_time", start_time);
    formData.append("end_time", end_time);
    formData.append("facebook", facebook);
    formData.append("twitter", twitter);
    formData.append("instagram", instagram);
    formData.append("website", website);
    if (online === true) {
      formData.append("virtual_link", virtual_link);
    }
    formData.append("owner", session?.user.id);
    formData.append("organizer", organizer);
    const url = `${serverUrl}/events/`;

    try {
      if (startdate !== null && enddate !== null) {
        setLoading(true);
        await axios({
          method: "POST",
          url: url,
          data: formData,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })
          .then((response) => {
            // console.log("response", response);
            const { id } = response.data;
            setLoading(false);
            setError(false);
            setEvent(id);
            setEventState(true);
            return response;
          })
          .catch((error) => {
            setLoading(false);
            console.log("error", error);
            setError(true);
            return error;
          });
      }
    } catch (error) {
      setError(true);
      setLoading(false);
      return error;
    }
  };
  return (
    <Meta className="bg-white mx-auto" title="Add new event" content="welcome">
      <div className="max-w-screen-md grid mx-auto">
        <div className="mt-32 sm:px-10 px-4">
          {eventState ? (
            <Tickets />
          ) : (
            <>
              <h1 className="text-3xl mt-10 font-sans font-bold text-rose-500">
                Start Your Event
              </h1>
              <form
                className="grid m-auto mt-10"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="bg-gray-50 px-4 py-4 rounded-lg">
                  <h1 className="text-xl mb-4 sm:text-2xl font-bold text-gray-900">
                    Basic Event Info
                  </h1>
                  <div className="mb-5">
                    <label className="text-sm semi-bold">Title</label>
                    <div className="flex mb-4 flex-col ">
                      {errors.title && (
                        <span className="text-red-500 text-xs">
                          Title field is required
                        </span>
                      )}
                      <input
                        className={`${
                          errors.title ? "border-red-500" : "border-slate-200"
                        } outline-none border p-2 h-14 text-xs rounded-xs bg-none my-2`}
                        type="text"
                        placeholder="Be descriptive about your event"
                        {...register("title", { required: true })}
                        variant="none"
                      />
                    </div>

                    <label className="text-sm semi-bold">Organizer</label>
                    <div className="flex flex-col mb-4 ">
                      {errors.organizer && (
                        <span className="text-red-500 text-xs">
                          Organizer field is required
                        </span>
                      )}
                      <input
                        className={`${
                          errors.organizer
                            ? "border-red-500"
                            : "border-slate-200"
                        } outline-none border p-2 h-14 text-xs rounded-xs bg-none my-2`}
                        type="text"
                        placeholder="let people know who is organizing"
                        {...register("organizer", { required: true })}
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
                  <label className="text-sm semi-bold">Event Image</label>
                  <div className="flex justify-center mt-2 mb-10">
                    <div className="rounded-lg w-full shadow-lg bg-gray-50">
                      <div className="m-4">
                        {errors.image && (
                          <span className="text-red-500 text-xs">
                            event image is required
                          </span>
                        )}
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

                              <input
                                className="opacity-20 px-3 py-1.5 text-base font-normal"
                                type="file"
                                {...register("image", { required: true })}
                                variant="none"
                              />
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <label className="text-sm semi-bold">Description</label>
                  <div className="flex flex-col mb-4 ">
                    {errors.description && (
                      <span className="text-red-500 text-xs">
                        Event description is required
                      </span>
                    )}
                    <textarea
                      className="outline-none text-xs border p-2 h-20 rounded-xs sm:h-36  border-slate-300 bg-none my-2"
                      type="text"
                      placeholder="Tell people about your event"
                      {...register("description", { required: true })}
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
                        online === true
                          ? "text-emerald-600 border-emerald-600"
                          : ""
                      } border px-3 py-2 mr-3 cursor-pointer active:border-1 rounded-xs`}
                    >
                      Online event
                    </div>
                  </div>

                  {!online ? (
                    <div className="flex text-xs flex-col">
                      {errors.location && (
                        <span className="text-red-500">
                          location is required
                        </span>
                      )}
                      <label className="mt-7">Venue Location</label>

                      <input
                        className="outline-none rounded-xs border px-2 h-12 w-full border-slate-300 bg-none my-2"
                        type="text"
                        placeholder="event venue location"
                        {...register("location", { required: true })}
                        variant="none"
                      />
                    </div>
                  ) : (
                    <div className="text-xs mt-10 flex flex-col">
                      {errors.virtual_link && (
                        <span className="text-red-500">
                          virtual link is required
                        </span>
                      )}
                      <label className="mt-7 font-medium">
                        Connect your event with your prefered virtual venue
                        provider, add a link that could be used to validate your
                        event attendies within your virtual venue e.g Google
                        meet, Zoom, etc.
                      </label>
                      <div className="flex mt-4 flex-col">
                        <input
                          className="outline-none border p-2 h-10 w-full  border-slate-200 bg-none my-2 rounded-xs"
                          type="url"
                          placeholder="enter your virtual venue link"
                          {...register("virtual_link", { required: false })}
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
                  <label className="text-gray-900 leading-tight">
                    Connect your event with your prefered social media platform
                    to help people connect with you.{" "}
                    <span>
                      <em>Optional</em>
                    </span>
                  </label>
                  <div className="grid md:grid-cols-2 sm:gap-7 my-5 ">
                    <input
                      className="outline-none border p-2 h-10 w-full  border-slate-200 bg-none my-2 rounded-xs"
                      type="url"
                      placeholder="facebook url"
                      {...register("facebook", { required: false })}
                      variant="none"
                    />
                    <input
                      className="outline-none border p-2 h-10 w-full  border-slate-300 bg-none my-2 rounded-xs"
                      type="url"
                      placeholder="twitter url"
                      {...register("twitter", { required: false })}
                      variant="none"
                    />
                    <input
                      className="outline-none border p-2 h-10 w-full  border-slate-300 bg-none my-2 rounded-xs"
                      type="url"
                      placeholder="instagram url"
                      {...register("instagram", { required: false })}
                      variant="none"
                    />

                    <input
                      className="outline-none border p-2 h-10 w-full  border-slate-300 bg-none my-2 rounded-xs"
                      type="url"
                      placeholder="website url"
                      {...register("website", { required: false })}
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

                  <div className="flex mt-6 gap-7">
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
                    <div className="">
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
                      {errors.start_time && (
                        <span className="text-red-500">
                          this field is required
                        </span>
                      )}
                      <label>Start Time</label>
                      <input
                        className="outline-none border p-2 h-10 w-full hover:border-blue-500 bg-none my-2"
                        type="time"
                        {...register("start_time", { required: true })}
                        variant="none"
                      />
                    </div>

                    <div className="flex flex-col">
                      {errors.end_time && (
                        <span className="text-red-500">
                          this field is required
                        </span>
                      )}
                      <label>End Time</label>
                      <input
                        className="outline-none border p-2 h-10 w-full hover:border-blue-500 bg-none my-2"
                        type="time"
                        {...register("end_time", { required: true })}
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
          )}
        </div>
      </div>
    </Meta>
  );
}

export default Index;
