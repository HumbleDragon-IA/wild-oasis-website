"use client";
import { useFormStatus } from "react-dom";
import useReservationStore from "./ReservationContext";
import { useEffect } from "react";

function UpdateButton({ type, children }) {
  const { pending } = useFormStatus(); // se usa para obtener el status del formulario. No puede estar dentor del mismo componente donde esta el form. por eso se crea este button
  const resetRange = useReservationStore((state) => state.resetRange);

  useEffect(() => {
    if (!pending) resetRange();
  }, [resetRange, pending]);
  return (
    <button
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
      disabled={pending}
    >
      {pending ? `${type.slice(0, -1)}ing...` : `${type} ${children}`}
    </button>
  );
}

export default UpdateButton;
