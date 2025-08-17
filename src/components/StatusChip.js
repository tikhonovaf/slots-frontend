import React from "react";
import cn from "classnames";
import status from "./Status";

const StatusChip = ({id,value}) => {

    return (
        <div
            className={cn(
                "status-item",
                id === status.planned && "planned",
                id === status.inProgress && "inprogress",
                id === status.finished && "success",
                id === status.finishedPartly && "warning",
                id === status.startInProgress && "warning",
                id === status.draft && "draft",
                id === status.paused && "planned",
                id === status.error && "errorstatus",
                id === status.cbtManualSwitch && "cbt",
                id === status.cbtSync && "cbt",
                id === status.stopped && "warning",
            )}
        >
            {value}
        </div>
    );
};

export default StatusChip;
