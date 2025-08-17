import { useContext } from "react";
import { EventsContext } from "../context/EventsContext";

export function useEmitter() {
  const manager = useContext(EventsContext);

  if (!manager) {
    throw Error(
      "Хук `useEvents` должен вызываться только внутри EventsProvider. Убедитесь, что он используется в корневом файле проекта.",
    );
  }

  return manager.emit;
}
