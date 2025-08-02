"use client";

import { create } from "zustand";

const useReservationStore = create((set) => ({
  range: {
    from: undefined,
    to: undefined,
  },

  setRange: (range) =>
    set(() => ({
      range: {
        from: range.from,
        to: range.to,
      },
    })),

  resetRange: () =>
    set(() => ({
      range: {
        from: undefined,
        to: undefined,
      },
    })),
}));

export default useReservationStore;
