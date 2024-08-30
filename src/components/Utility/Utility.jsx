import { toast } from "react-toastify";
var CryptoJS = require("crypto-js");

export const apiBaseURL = () => {
  return "https://rssr.itdeed.com";
};

export const auth = () => {
  if (getAllLocatData()?.token) return true;
  else return false;
};

export const rowPerPageInTable = 20
export const imageSize = 600

export const toastifySuccess = (message) => {
  toast.success(`${message}`, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export const toastifyError = (message) => {
  toast.error(`${message}`, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export const encryptLocalStorageData = (name, data, key) => {
  var encryptData = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  localStorage.setItem(name, encryptData);
};

export const dycryptLocalStorageData = (encryptData, key) => {
  var bytes = CryptoJS.AES.decrypt(encryptData, key);
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};

export const getAllLocatData = () => {
  if (localStorage.getItem("rss-web-secret"))
    return dycryptLocalStorageData(localStorage.getItem("rss-web-secret"),"DoNotTryToAccess");
  else {
    return null;
  }
};
//"homepage": "https://demos.creative-tim.com/argon-dashboard-react/",
