import React, { useState, useEffect } from "react";
import config from "config";
// import "../../css/table.css";
import Switch from "@mui/material/Switch";
import { FaEdit } from "react-icons/fa";
import {
  Box,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import {
  Card,
  CardHeader,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  ContainerRow,
} from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import {
  toastifyError,
  toastifySuccess,
  getAllLocatData,
} from "components/Utility/Utility";
import { apiCall } from "api/interceptor";
import { apiBaseURL } from "components/Utility/Utility";
import { Link, useLocation, useParams } from "react-router-dom";
import { Row } from "react-bootstrap";
import Spinner from "components/Utility/Spinner";
import axios from "axios";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [updData, setUpdData] = useState(null);

  const [value, setValue] = useState({
    development_mode: false,
    admin_email: "",
    youtube: "",
    twitter: "",
    whatsapp: "",
    facebook: "",
    image: "",
  });
  const getData = async () => {
    const res = await axios.post(`${config.url}/user/getGeneralOptions`);
    console.log(res?.data)
    setValue({
      ...value,
      development_mode: res.data.data?.development_mode ?? false,
      admin_email: res.data.data.admin_email ?? "",
      youtube: res.data.data.youtube ?? "",
      twitter: res.data.data.twitter ?? "",
      whatsapp: res.data.data.whatsapp ?? "",
      facebook: res.data.data.facebook ?? "",
      image: res.data.data.image ?? "",
    });
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    if (updData?.id) {
      setValue({
        ...value,
        name: updData?.name,
        district_id: updData?.district_id,
        id: updData?.id,
        sambhag_id: updData?.sambhag_id,
      });
    } else {
      setValue({ ...value, name: "" });
    }
  }, [updData]);
  const handleChange = (e) => {
    if(e.target.name == 'image'){
      setValue({
        ...value,
        image: e.target.files[0],
      });
    }else{
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (value.name == "") {
        toastifyError("Name field is required !!");
        return false;
      }
      const formData = new FormData();
      formData.append("development_mode", value.development_mode);
      formData.append("admin_email", value.admin_email);
      formData.append("youtube", value.youtube);
      formData.append("twitter", value.twitter);
      formData.append("whatsapp", value.whatsapp);
      formData.append("facebook", value.facebook);
      formData.append("image", value.image);
      const res = await apiCall(`/user/generalOptions`,"POST",formData);
      if (res?.status) {
        toastifySuccess(res.message);
        getData()
      } else {
        toastifyError("Something went wrong !!");
      }
    } catch (error) {
      console.log(error);
      toastifyError("Something went wrong !!");
    }
  };

  return (
    <>

      <div className="header global-color pb-8  pt-5 pt-md-8">
        <div className="container-fluid"></div>
      </div>

      <div className="container-fluid mt--9">
        <div className="mt-7 mb-3 px-3 py-4 card card">
          <h2>सेटिंग</h2>
        </div>
      </div>
      <div className="">
        <div className="container-fluid">


          <div className="card p-4">
              <Row>
                <div className="col-sm-3 mt-3 mb-4">
                  <label>Youtube</label>
                  <input
                    name="youtube"
                    placeholder="Youtube "
                    type="text"
                    value={value.youtube}
                    onChange={handleChange}
                    className="form-control "
                  />
                </div>
                <div className="col-sm-3 mt-3 mb-4">
                  <label>Whatsapp</label>
                  <input
                    name="whatsapp"
                    placeholder="Whatsapp "
                    type="text"
                    value={value.whatsapp}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-sm-3 mt-3 mb-4">
                  <label>Facebook</label>
                  <input
                    name="facebook"
                    placeholder="Facebook "
                    type="text"
                    value={value.facebook}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-sm-3 mt-3 mb-4">
                  <label> Development Mode</label>

                  <Switch
                    checked={value?.development_mode}
                    onChange={() => {
                      setValue({
                        ...value,
                        development_mode: !value.development_mode,
                      });
                    }}
                    name="loading"
                    color="primary"
                  />

                </div>
                <div className="col-sm-3 mt-3 mb-4">
                  <label> Admin Email</label>
                  <input
                    name="admin_email"
                    placeholder="admin Email "
                    type="text"
                    value={value.admin_email}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-sm-3 mt-3 mb-4">
                  <label> Twitter</label>
                  <input
                    name="twitter"
                    placeholder="twitter "
                    type="text"
                    value={value.twitter}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-sm-3 mt-3 mb-4">
                  <label> Image</label>
                  <input
                    name="image"
                    type="file"
                    onChange={handleChange}
                    className="form-control input-md"
                  />
                  <img src={ apiBaseURL() + "/" + value.image} alt="" style={{height: '100px', width : '100px'}} />
                </div>
              </Row>
              <Row>
                <div className="col-sm-12 mt-3" style={{ textAlign: "end" }}>
                  <button className="button1 border-0" type="button" onClick={handleSubmit}>
                    Save
                  </button>
                </div>
              </Row>
          </div>
        </div>
      </div>

      <Spinner sppiner={loading} />
    </>
  );
};

export default Settings;
