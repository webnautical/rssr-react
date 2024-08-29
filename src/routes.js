/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
// import Tables from "views/examples/Tables.js";
import Login from "views/examples/Login.js";
import ShikshakSangh from "views/examples/ShikshakSangh";
import ShikshakSanghPost from "views/examples/ShikshakSanghPost";
import AboutUs from "views/examples/AboutUs";
import ContactUs from "views/ContactUs";
import District from "views/examples/District";
import Tables from "views/examples/Tables.js";
import Block from "views/examples/Block";
import School from "views/examples/School";
import { GalleryCategory } from "views/examples/GalleryCategory";
import { GaleerySubCategory } from "views/examples/GaleerySubCategory";
import MukhPatr from "views/examples/MukhPatr";
import Gallery from "views/examples/Gallery";
import Common from "views/examples/common/Common";
import Settings from "views/examples/Settings";
import AdminLevel from "views/examples/AdminLevel";
import UserList from "views/examples/UserList";
import AccountDeletaion from 'views/examples/AccountDeletaion';


export const routesForLogin = [
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
];
export const districtRoutes=[
  {
    path: "/index",
    name: "डैशबोर्ड",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/gallery-category",
    name: "चित्र प्रदर्शनी वर्ग",
    icon: "ni ni-collection text-primary",
    component: <GalleryCategory />,
    layout: "/admin",
  },
  {
    path: "/gallery-sub-category",
    name: "चित्र प्रदर्शनी उपश्रेणी ",
    icon: "ni ni-books text-primary",
    component: <GaleerySubCategory />,
    layout: "/admin",
  },

  {
    path: "/gallery",
    name: "चित्र प्रदर्शनी ",
    icon: "ni ni-books text-primary",
    component: <Gallery />,
    layout: "/admin",
  },
  {
    path: "/admin-level",
    name: "उप व्यवस्थापक",
    icon: "ni ni-books text-primary",
    component: <AdminLevel />,
    layout: "/admin",
    
  },
  {
    path: "/user-list",
    name: "उपयोगकर्ता सूची",
    icon: "ni ni-books text-primary",
    component: <UserList />,
    layout: "/admin",
    
  },
 
 
]
export const upshakhaRoutes=[

  {
    path: "/index",
    name: "डैशबोर्ड",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/gallery-category",
    name: "चित्र प्रदर्शनी वर्ग",
    icon: "ni ni-collection text-primary",
    component: <GalleryCategory />,
    layout: "/admin",
  },
  {
    path: "/gallery-sub-category",
    name: "चित्र प्रदर्शनी उपश्रेणी ",
    icon: "ni ni-books text-primary",
    component: <GaleerySubCategory />,
    layout: "/admin",
  },

  {
    path: "/gallery",
    name: "चित्र प्रदर्शनी ",
    icon: "ni ni-books text-primary",
    component: <Gallery />,
    layout: "/admin",
  },
  {
    path: "/user-list",
    name: "उपयोगकर्ता सूची",
    icon: "ni ni-books text-primary",
    component: <UserList />,
    layout: "/admin",
  },
 
]
var routes = [
  {
    path: "/index",
    name: "डैशबोर्ड",
    icon: "ni ni-books text-primary",
    component: <Index />,
    layout: "/admin",
  },

  {
    path: "/admin-level",
    name: "उप व्यवस्थापक ",
    icon: "ni ni-books text-primary",
    component: <AdminLevel />,
    layout: "/admin",
  },

  {
    path: "/user-list",
    name: "उपयोगकर्ता सूची",
    icon: "ni ni-books text-primary",
    component: <UserList />,
    layout: "/admin",
  },
  {
    path: "/shikshak-sangh-category",
    name: "शिक्षक संघ वर्ग",
    icon: "ni ni-books text-primary",
    component: <ShikshakSangh />,
    layout: "/admin",
  },

  {
    path: "/shikshak-sangh-post",
    name: "शिक्षक संघ पोस्ट ",
    icon: "ni ni-books text-primary",
    component: <ShikshakSanghPost />,
    layout: "/admin",
  },

  {
    path: "/mukh-patra",
    name: "मुख पत्र ",
    icon: "ni ni-books text-primary",
    component: <MukhPatr />,
    layout: "/admin",
  },

  {
    path: "/gallery",
    name: "चित्र प्रदर्शनी ",
    icon: "ni ni-books text-primary",
    component: <Gallery />,
    layout: "/admin",
  },

  
  {
    path: "/gallery-category",
    name: "चित्र प्रदर्शनी वर्ग",
    icon: "ni ni-books text-primary",
    component: <GalleryCategory />,
    layout: "/admin",
  },

  {
    path: "/gallery-sub-category",
    name: "चित्र प्रदर्शनी उपश्रेणी ",
    icon: "ni ni-books text-primary",
    component: <GaleerySubCategory />,
    layout: "/admin",
  },

  {
    path: "/common/getSangathan",
    name: "संगठन ",
    icon: "ni ni-books text-primary",
    component: <Common />,
    layout: "/admin",
  },

  {
    path: "/common/getDuty",
    name: "दायित्व ",
    icon: "ni ni-books text-primary",
    component: <Common />,
    layout: "/admin",
  },

  {
    path: "/common/getDutylevel",
    name: "दायित्व स्तर ",
    icon: "ni ni-books text-primary",
    component: <Common />,
    layout: "/admin",
  },

  {
    path: "/common/getSambhag",
    name: "संभाग ",
    icon: "ni ni-books text-primary",
    component: <Common />,
    layout: "/admin",
  },
  {
    path: "/common/getAllDistrict",
    name: "ज़िला",
    icon: "ni ni-books text-primary",
    component: <Common />,
    layout: "/admin",
  },

    
 
  {
    path: "/common/getTehsil",
    name: "तहसील ",
    icon: "ni ni-books text-primary",
    component: <Common />,
    layout: "/admin",
  },
  {
    path: "/block",
    name: "ब्लॉक",
    icon: "ni ni-books text-primary",
    component: <Block />,
    layout: "/admin",
  },
  {
    path: "/peeos",
    name: "पंचायत प्रारंभिक शिक्षा अधिकारी (पीईईओ) ",
    icon: "ni ni-books text-primary",
    component: <School />,
    layout: "/admin",
  },

  {
    path: "/common/getUpshakha",
    name: "उपशाखा ",
    icon: "ni ni-books text-primary",
    component: <Common />,
    layout: "/admin",
  },

  {
    path: "/common/getSankul",
    name: "संकुल  ",
    icon: "ni ni-books text-primary",
    component: <Common />,
    layout: "/admin",
  },

  {
    path: "/settings",
    name: "सेटिंग ",
    icon: "ni ni-books text-primary",
    component: <Settings />,
    layout: "/admin",
  },

  {
    path: "/contact-us",
    name: "संपर्क",
    icon: "ni ni-books text-primary",
    component: <ContactUs />,
    layout: "/admin",
  },
  {
    path: "/account-deletion-request",
    name: "खाता हटाने का अनुरोध",
    icon: "ni ni-books text-primary",
    component: <AccountDeletaion />,
    layout: "/admin",
  },


  // {
  //   path: "/about-us",
  //   name: "विवरण",
  //   icon: "ni ni-support-16 text-primary",
  //   component: <AboutUs />,
  //   layout: "/admin",
  // },
 



 
 
 

 



  

];
export default routes;
