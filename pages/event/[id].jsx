import dynamic from "next/dynamic";
import React from "react";
// import EventDetail from "../../components/event-list/EventDetail";
import { Meta } from "../../layout/Meta";
import { getEvent } from "../../lib/events";

const EventDetail = dynamic(() =>
  import("../../components/event-list/EventDetail")
);

export async function getServerSideProps({ params }) {
  try {
    const event = await getEvent(params.id);
    return {
      props: {
        event,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

function EventDetailPage({ event }) {
  return (
    <Meta title={event.title} content={event.description}>
      <div>
        <EventDetail event={event} />
      </div>
    </Meta>
  );
}

export default EventDetailPage;
