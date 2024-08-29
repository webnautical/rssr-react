import React, { useEffect, useState } from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "reactstrap";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import { auth } from "components/Utility/Utility";
import routes, { districtRoutes, upshakhaRoutes, routesForLogin } from "routes.js";
import { getAllLocatData } from "components/Utility/Utility";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    let role = getAllLocatData()?.role;
    setUserRole(role);
  }, [location]);

  const getRoutes = (role) => {
    switch (role) {
      case "admin":
        return routes;
      case "district":
        return districtRoutes;
      case "upshakha":
        return upshakhaRoutes;
      default:
        return [];
    }
  };

  const getSidebarRoutes = (role) => {
    switch (role) {
      case "admin":
        return routes;
      case "district":
        return districtRoutes;
      case "upshakha":
        return upshakhaRoutes;
      default:
        return [];
    }
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={getSidebarRoutes(userRole)}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/rsslogo.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
      
        />
        {auth() ? (
          <Routes>
            {getRoutes(userRole).map((route, key) => {
             
              return(

              <Route
                path={route.path}
                element={route.component}
                key={key}
                exact
              />
            )})}
            {/* <Route
              path="*"
              element={<Navigate to="/admin/index" replace />}
            /> */}
          </Routes>
        ) : (
          <Navigate to="/auth/login" />
        )}
        {/* <Container fluid>
          <AdminFooter />
        </Container> */}
      </div>
    </>
  );
};

export default Admin;
