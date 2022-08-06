import React, { useEffect, useState } from "react";
import moment from "moment";

export const Countdown = ({ datetime, className }) => {
  const targetTime = moment(datetime);
  const [currentTime, setCurrentTime] = useState(moment());
  const timeBetween = moment.duration(targetTime.diff(currentTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  if (timeBetween.asSeconds() < 0) {
    return (
      <div className="sm:text-sm justify-center self-center">
        Event Completed🙂
      </div>
    );
  } else {
    return (
      <>
        <p
          className={`flex self-end text-2xl text-black font-bold ${className}`}
        >
          <span className="mx-2">{timeBetween.days()}d </span>
          <span className="mx-2">{timeBetween.hours()}h </span>
          <span className="mx-2">{timeBetween.minutes()}min </span>
          <span className="mx-2">{timeBetween.seconds()}s </span>
        </p>
      </>
    );
  }
};
