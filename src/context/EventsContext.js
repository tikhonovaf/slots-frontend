import React, { createContext, useRef, useState } from "react";

export const EventsContext = createContext(null);

export const EventsProvider = ({ children }) => {
  const listeners = useRef([]);

  const emit = (event) => {
    listeners.current.forEach((el) => {
      if (el.event === event) {
        el.listener(event);
      }
    });
  };

  const addListener = (event, listener) => {
    listeners.current.push({ event, listener });
  };

  const removeListener = (event, listener) => {
    listeners.current = listeners.current.filter(
      (el) => el.event !== event || el.listener !== listener,
    );
  };

  const manager = {
    addListener,
    removeListener,
    emit,
  };

  return (
    <EventsContext.Provider value={manager}>{children}</EventsContext.Provider>
  );
};
