import { CSpinner } from "@coreui/react";
import React, { useEffect, useState } from "react";
import cn from "classnames";

export const LoadingContent = ({ loading, children }) => {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    setShowIndicator(loading);
  }, [loading]);

  return (
    <div>
      <CSpinner
        color={"primary"}
        className={cn(
          "loading-content-spinner",
          showIndicator && "loading-content-spinner-visible",
        )}
      />
      {!loading && children}
    </div>
  );
};
