import React from "react";
import { CButton, CCol, CContainer, CInputGroup, CRow } from "@coreui/react";

import background from "../../assets/images/bg_error.jpg";
import AppHeaderError from "../../layout/AppHeaderError";

const Page404 = () => {
  return (
    <>
      <AppHeaderError />
      <div
        className={"bg-light min-vh-100 d-flex flex-row align-items-center"}
        style={{ backgroundImage: `url(${background})` }}
      >
        <CContainer>
          <CRow className={"justify-content-center"}>
            <CCol md={3}>
              <div
                className={
                  "d-flex flex-column justify-content-center align-items-center"
                }
              >
                <h1>404</h1>
                <h4 className={"pt-3 text-center"}>Страница не найдена</h4>
                <p className={"text-center"}>
                  Неверный адрес, <br />
                  либо страница больше не существует
                </p>
                <CInputGroup className={"d-flex justify-content-center"}>
                  <CButton
                    className={"mt-4 mb-4 text-white ps-4 pe-4"}
                    color={"primary"}
                  >
                    На главную
                  </CButton>
                </CInputGroup>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  );
};

export default Page404;
