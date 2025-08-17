import {useRef, useState} from "react";

const isIpv4 = (ip) => {
    const rgx = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return rgx.test(ip);
};

const formatIp = (ip) => {
    const parts = ip.split('.').map(part => part.padEnd(3, '_'));
    return parts.join('.');
};

const IpAddressInput = () => {
    const [value, setValue] = useState('');
    const [displayValue, setDisplayValue] = useState('___ . ___ . ___ . ___');
    const inputRef = useRef(null);

    const handleFocus = () => {
        if (displayValue === '___ . ___ . ___ . ___') {
            setDisplayValue('');
        } else {
            setDisplayValue(value);
        }
    };

    const handleBlur = () => {
        if (!isIpv4(value.replace(/_/g, '0'))) {
            setDisplayValue('___ . ___ . ___ . ___');
            setValue('');
        } else {
            setDisplayValue(formatIp(value));
        }
    };

    const handleChange = (e) => {
        let newValue = e.target.value.replace(/[^0-9.]/g, '');
        const parts = newValue.split('.').map(part => part.padEnd(3, '_')).join('.');
        setValue(newValue);
        setDisplayValue(parts.slice(0, 15));
    };

    return (
        <input
            type="text"
            value={displayValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            ref={inputRef}
            maxLength={15}
            size={15}
            style={{width: 'calc(15ch + 10px)', fontFamily: 'monospace'}}
        />
    );
};

export default IpAddressInput;