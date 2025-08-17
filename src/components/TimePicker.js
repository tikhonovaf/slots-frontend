import React from "react";
import cn from "classnames";
import {TimePicker as AntTimePicker} from "antd";
import {ensureDate} from "../utils/utils";

const TimePicker = (props) => {
  const { touched, value, className, required, ...allProps } = props;

  const status = required && touched && !value ? "error" : undefined;

  return (
    <AntTimePicker
      format={'HH:mm'}
      placeholder={"ЧЧ.ММ"}
      locale={"ru"}
      className={cn(className, touched && value && "timepicker-valid")}
      value={ensureDate(value)}
      status={status}
      suffixIcon={false}
      {...allProps}
    />
  );
};

export default React.memo(TimePicker);
