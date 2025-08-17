import React, { createContext, useEffect, useState } from "react";
import { isFunction, uniqueId } from "lodash";

export const ModalsContext = createContext(null);

export const ModalsProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const closeModal = (id) => {
    setModals((modals) =>
      modals.map((el) =>
        el.state.id === id
          ? { ...el, state: { ...el.state, visible: false } }
          : el,
      ),
    );
  };
  const destroyModal = (id) => {
    setModals((modals) => modals.filter((el) => el.state.id !== id));
  };

  const openModal = (component, props) => {
    const id = uniqueId();

    const state = {
      id,
      props: isFunction(props) ? props(id) : props,
      visible: false,
      rendered: false,
    };

    setTimeout(() => {
      setModals((modals) => [
        ...modals,
        {
          state,
          component,
          onClose() {
            closeModal(state.id);
          },
          onDestroy() {
            destroyModal(state.id);
          },
        },
      ]);
    });

    return state.id;
  };

  const manager = {
    openModal,
    closeModal,
    destroyModal,
  };

  useEffect(() => {
    if (modals.find((el) => !el.state.rendered)) {
      setModals(
        modals.map((el) =>
          !el.state.rendered
            ? {
                ...el,
                state: { ...el.state, rendered: true, visible: true },
              }
            : el,
        ),
      );
    }
  }, [modals]);

  return (
    <ModalsContext.Provider value={manager}>
      {children}
      {modals.map((modal) => (
        <modal.component
          visible={modal.state.visible}
          key={modal.state.id}
          onClose={modal.onClose}
          onDestroy={modal.onDestroy}
          {...modal.state.props}
        />
      ))}
    </ModalsContext.Provider>
  );
};
