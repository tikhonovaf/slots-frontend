import React from "react";
import cn from "classnames";

const StatusBadge = ({ className, color, small, ...props }) => {
  return (
    <div
      className={cn(
        className,
        "status-badge",
        color && `status-badge-${color}`,
        small && `status-badge-small`,
        "text-nowrap",
      )}
      {...props}
    />
  );
};

export default StatusBadge;
