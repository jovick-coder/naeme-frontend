import fetchJson, { ApiError } from "./api";
import { serverUrl } from "../config/index";

export async function getEvent(id) {
  const response = await fetchJson(`${serverUrl}/events/${id}`);
  const event = await response;
  return event;
}

export async function getTicket(id) {
  const response = await fetchJson(`${serverUrl}/tickets/?event=${id}`);
  const ticket = await response;
  return ticket;
}

export async function getEvents() {
  const response = await fetch(`${serverUrl}/events`);
  const events = await response.json();
  return events;
}

export async function getTickets() {
  const response = await fetchJson(`${serverUrl}/tickets`);
  const tickets = await response;
  return tickets;
}

export const highestPrice = (tickets) => {
  // console.log("[Htickets]", tickets);
  const lowest = tickets?.filter((ticketItem) => ticketItem.total_price > 0);
  const highestPrice = lowest?.reduce((acc, curr) => {
    // console.log("[Highest]", { acc, curr });
    return acc.total_price > curr.total_price ? acc : curr;
  });

  return highestPrice?.total_price;
};

export const lowestprice = (tickets) => {
  // console.log("Ltickets", tickets);
  const lowest = tickets?.filter((ticketItem) => ticketItem.total_price > 0);
  const lowestPrice = lowest?.reduce((acc, curr) => {
    // console.log("[lowest]", { acc, curr });
    return acc.total_price < curr.total_price ? acc : curr;
  });

  return lowestPrice?.total_price;
};

export async function getUser() {
  const response = await fetch(`/api/user`);

  if (response.status === 200) {
    const user = await response.json();
    return user;
  } else {
    return new ApiError(response);
  }
}
