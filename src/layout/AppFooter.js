import React from "react";
import {CFooter} from "@coreui/react";

const AppFooter = () => {
  return (
    <CFooter>
      <div>
          <span style={{fontSize: '13px', color: 'gray'}}>BelABM © 2025</span>
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);
