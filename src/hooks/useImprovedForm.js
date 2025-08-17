import { useRef, useState } from "react";

function useImprovedForm(onSubmit, onFail) {
  const [validated, setValidated] = useState(false);

  const lastAction = useRef();
  const form = useRef();

  const handleSubmit = (e) => {
    const action = lastAction.current;
    lastAction.current = undefined;
    e?.preventDefault();
    e?.stopPropagation();

    if ((form.current || e?.currentTarget)?.checkValidity()) {
      return onSubmit(
        Array.from(e?.target.elements)
          .filter((input) => input.name)
          .reduce(
            (obj, input) => Object.assign(obj, { [input.name]: input.value }),
            {},
          ),
        action,
      );
    } else {
      setValidated(true);
      return onFail?.();
    }
  };

  const submit = (action) => {
    lastAction.current = action;
    form.current.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true }),
    );
  };

  return { form, submit, handleSubmit, validated, setValidated };
}

export default useImprovedForm;
