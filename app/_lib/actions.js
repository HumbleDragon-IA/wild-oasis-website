"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import {
  createBooking,
  deleteBooking,
  getBookings,
  updateBooking,
  updateGuest,
} from "./data-service";
import { redirect } from "next/navigation";

export async function createReservationAction(bookingData, formData) {
  console.log(bookingData, formData);
  const { startDate, endDate, numNights, cabinPrice, cabinId } = bookingData;
  const numGuests = formData.get("numGuests");
  const observations = formData.get("observations").slice(0, 1000);
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const newBooking = {
    numGuests,
    startDate,
    endDate,
    numNights,
    cabinPrice,
    totalPrice: cabinPrice,
    extrasPrice: 0,
    status: "unconfirmed",
    hasBreakfast: false,
    isPaid: false,
    observations,
    cabinId,
    guestId: session.user.guestId,
  };

  await createBooking(newBooking);
  revalidatePath("/account/reservations");
  revalidatePath("/cabins");
  revalidatePath(`/cabins/${cabinId}`);
  redirect("/account/reservations");
}

export async function updateReservationAction(formData) {
  const reservationId = formData.get("reservationId");
  const numGuests = formData.get("numGuests");
  const observations = formData.get("observations");
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);

  const guestBookingsId = guestBookings.map((b) => b.id);

  if (!guestBookingsId.includes(+reservationId)) {
    throw new Error("Tomatela hackerin");
  }

  const updateData = { numGuests, observations };
  await updateBooking(reservationId, updateData);
  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${reservationId}`);
  redirect("/account/reservations");
}

export async function deleteReservationAction(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsId = guestBookings.map((b) => b.id);
  if (!guestBookingsId.includes(bookingId)) {
    throw new Error("Tomatela hackerin");
  }
  await deleteBooking(bookingId);
  revalidatePath("/account/reservations");
}
export async function updateProfileAction(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, countryFlag, nationalID };

  await updateGuest(session.user.guestId, updateData);

  revalidatePath("/account/profile");
}

export async function signInAction() {
  await signIn("google", {
    redirectTo: "/account",
  });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
