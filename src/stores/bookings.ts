import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { bookingsApi } from "../api/bookings";
import { eventsApi } from "../api/events";
import { ApiError } from "../api/http";
import { seatsLeft } from "../format";
import type { Booking, BookingInput, CampusEvent } from "../types";
import { useEventsStore } from "./events";

export const useBookingsStore = defineStore("bookings", () => {
  const bookings = ref<Booking[]>([]);
  const loading = ref(false);
  const totalSeats = computed(() => bookings.value.reduce((n, b) => n + b.seats, 0));

  async function fetchAll() {
    loading.value = true;
    try {
      bookings.value = await bookingsApi.list();
    } finally {
      loading.value = false;
    }
  }

  // TODO D1: book `input.seats` seats for `event`.
  //   1. If input.seats is more than the seats left, throw new ApiError(409, "Not enough seats left.")
  //      without calling the API.
  //   2. POST the booking: bookingsApi.create({ eventId, name, email, seats, createdAt: now as ISO string })
  //   3. PATCH the event's new seat count: eventsApi.setBooked(event.id, event.booked + input.seats)
  //   4. Put the updated event in the events store (useEventsStore().replace) and
  //      add the booking at the start of `bookings`. Return the booking.
  // Question: what goes wrong if step 2 succeeds and step 3 fails? (We fix this properly in week 7.)
  // The booking saved in the backend, but the event's booked seat count is not updated.
  async function book(event: CampusEvent, input: BookingInput): Promise<Booking> {
    //1
    const left = seatsLeft(event);

    if(input.seats > left){
      throw new  ApiError(409, "Not enough seats left.");
    }

    //2
    const booking = await bookingsApi.create({
      eventId: event.id,
      name: input.name,
      email: input.email,
      seats: input.seats,
      createdAt: new Date().toISOString(),
    });

    //3
    const updatedEvent = await eventsApi.setBooked(
      event.id,
      event.booked + input.seats
    );

    //4
    const events = useEventsStore();
    events.replace(updatedEvent);

    bookings.value.unshift(booking);
    
    return booking;
  }

  async function cancel(booking: Booking) {
    const events = useEventsStore();
    const event = await events.fetchOne(booking.eventId);
    await bookingsApi.remove(booking.id);
    events.replace(await eventsApi.setBooked(event.id, Math.max(0, event.booked - booking.seats)));
    bookings.value = bookings.value.filter(b => b.id !== booking.id);
  }

  return { bookings, loading, totalSeats, fetchAll, book, cancel };
});
