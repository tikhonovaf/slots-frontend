import React from "react";
import cn from "classnames";
import {ensureDate} from "../utils/utils";
import {DatePicker as AntDatePicker} from "antd";
import {useLang} from "../hooks/useLang";
import {EN_LOCALE, RU_LOCALE} from "../constants";


const DatePicker = (props) => {
    const {touched, value, className, showTime, placeholder, required, ...allProps} = props;

    const status = required && touched && !value ? "error" : undefined;
    const lang = useLang()
    const holder_date = lang === "RU" ? "ДД.ММ.ГГГГ" : "DD.MM.YYYY"
    const holder_time = lang === "RU" ? "ЧЧ:ММ" : "HH:MM"

    return (
        <AntDatePicker
            locale={lang === "RU" ? RU_LOCALE : EN_LOCALE}
            allowClear
            showTime={showTime}
            placeholder={showTime ? holder_date + " " + holder_time : holder_date}
            format={showTime ? 'DD.MM.YYYY HH:mm' : 'DD.MM.YYYY'}
            className={cn(className, touched && value && "datepicker-valid")}
            value={ensureDate(value)}
            status={status}
            suffixIcon={false}
            {...allProps}
        />
    );
};

export default React.memo(DatePicker);
