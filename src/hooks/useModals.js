import { useContext } from "react";
import { ModalsContext } from "../context/ModalsProvider";

export function useModals() {
  const manager = useContext(ModalsContext);

  if (!manager) {
    throw Error(
      "Хук `useModals` должен вызываться только внутри ModalsProvider. Убедитесь, что он используется в корневом файле проекта.",
    );
  }

  return {
    closeModal: manager.closeModal,
    openModal: manager.openModal,
  };
}
