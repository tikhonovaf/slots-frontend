import React from "react";
import { CButton, CContainer, CHeader, CHeaderNav } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilAccountLogout } from "@coreui/icons";
import { AppHeaderDropdown } from "./header";
import { logo } from "../assets/brand/logo";
import { useLocation, useNavigate } from "react-router";

const AppHeaderError = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/login";

  return (
    <CHeader position={"sticky"} className={"mb-3 bg-light"}>
      <CContainer
        fluid
        className={"d-flex justify-content-between align-items-center"}
      >
        <div className={"mt-3"}>
          <CIcon icon={logo} height={35} />
        </div>
        <div className={"d-flex align-items-center"}>
          <CHeaderNav className={"ms-3"}>
            <AppHeaderDropdown />
          </CHeaderNav>

          <div>
            <span className={"ms-1"}>Admin</span>
          </div>

          <CButton
            className={"ms-2"}
            onClick={() => {
              // setSession(null);
              navigate(from, { replace: true });
            }}
            color={"white"}
          >
            <CIcon icon={cilAccountLogout} size={"lg"} />
          </CButton>
        </div>
      </CContainer>
    </CHeader>
  );
};

export default AppHeaderError;
