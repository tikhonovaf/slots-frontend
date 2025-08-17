import React from "react";
import {
  CAvatar,
  CDropdown,
  CDropdownToggle,
} from "@coreui/react";
import avatar10 from "../../assets/images/avatars/10.png";

const AppHeaderDropdown = () => {
  return (
    <CDropdown variant={"nav-item"}>
      <CDropdownToggle
        placement={"bottom-end"}
        className={"py-0"}
        caret={false}
      >
        <CAvatar src={avatar10} size={"md"} />
      </CDropdownToggle>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
