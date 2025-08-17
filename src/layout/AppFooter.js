import React from "react";
import {CFooter} from "@coreui/react";

const AppFooter = () => {
  return (
    <CFooter>
      <div>
          <span style={{fontSize: '13px', color: 'gray'}}>s3Hub team © 2024</span>
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);
