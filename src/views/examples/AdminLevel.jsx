import { getAllLocatData } from 'components/Utility/Utility';
import config from 'config';
import React, { useEffect, useState } from 'react'
import { Card, Row, Table } from 'react-bootstrap'
import Spinner from "components/Utility/Spinner";
import axios from 'axios';
import { toastifySuccess } from 'components/Utility/Utility';
import { toastifyError } from 'components/Utility/Utility';
import Pagination from '@mui/material/Pagination';
import { makeStyles } from "@material-ui/core/styles";

import {
  Box,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { apiCall } from 'api/interceptor';
const useStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  table: {
    minWidth: 650,
    border: "2px solid #ccc", // Set border color here
    borderCollapse: "collapse",
  },
  snackbar: {
    bottom: "104px",
  },
});
const AdminLevel = () => {
  const classes = useStyles();

  const [districtList, setDistrictList] = useState([]);

  const [loading, setLoading] = useState(false)
  const [upshakhaList, setUpshakhaList] = useState(null)
  const [value, setValue] = useState({
    email: "",
    password: "",
    district: "",
    upshakha: ""
  })
  const [userData, setUserData] = useState(null)
  useEffect(() => {
    const data = getAllLocatData();
    setUserData(data)
    getListFun()
    getDistrictEntries();
    getupshakha();
  }, []);
  const getupshakha = async () => {
    try {
      const districtID = await getAllLocatData()?.district;
      const { data } = await axios.post(`${config.url}/admin/getUpshakha`, { id: districtID })
      if (data.status == 200) {
        setUpshakhaList(data.data)
      }
    } catch (error) {
      console.log(error)
    }

  }
  const getDistrictEntries = () => {
    setLoading(true)
    const data = { "district_type": 'ORGANIZATIONAL' };
    fetch(`${config.url}/admin/getAllDistrict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAllLocatData()?.token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseData) => {
        setDistrictList(responseData?.districts);
        setLoading(false)

      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false)

      });
  };
  const handleDistrict = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (userData.role == "admin") {
        const finalData = {
          email: value.email,
          password: value.password,
          role: "district",
          district: value.district,
          upshakha: ""
        }
        const res = await axios.post(`${config.url}/admin/adminRegister`, finalData);
        // console.log("shhek",res)
        if (res.status == 200) {

          toastifySuccess(res.message || "Data Added Successfuly!!");
          setValue({
            email: "",
            password: "",
            district: "",
            upshakha: ""
          })

        }
        // console.log(res)
      }
      else if (userData.role == "district") {
        const finalData = {
          email: value.email,
          password: value.password,
          role: "upshakha",
          district: userData.district,
          upshakha: value.upshakha
        }
        const res = await axios.post(`${config.url}/admin/adminRegister`, finalData);
        // console.log("shhek",res)
        if (res.status == 200) {
          toastifySuccess(res.message || "Data Added Successfuly!!");
          setValue({
            email: "",
            password: "",
            district: "",
            upshakha: ""
          })

        }
      }
      setLoading(false);
    } catch (error) {
      toastifyError(error?.response?.data?.message ?? "Failed to Add!!");


    }

    try {
      setLoading(true);
      const resp = await axios.post(``)

      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(error)
    }
  }

  const [list, setList] = useState([])
  const [filterList, setFilter] = useState([])
  const getListFun = async () => {
    setLoading(true);
    try {
      const params = {
        "role": getAllLocatData()?.role,
        "district": getAllLocatData()?.district
      };
      const res = await apiCall(`/admin/getAdminUsers`, "post", params);
      if (res?.status) {
        console.log(res)
        setLoading(false);
        setList(res?.data);
        setFilter(res?.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleFilterChange = (e) => {
    if (e.target.value !== "") {
      const filtered = list?.filter((item) => item.district_name == e.target.value || item?.user_name?.includes(e.target.value) || item?.email?.includes(e.target.value));
      setFilter(filtered);
    } else {
      setFilter(list);
    }
  }
  const handleSelectChange = (event) => {
    const newValue = Number(event.target.value);
    const res = list.slice(0, newValue);
    setFilter(res);
  };

  console.log("filterList", filterList)
  return (<>
    <div className="header global-color pb-8  pt-5 pt-md-8">
      <div className="container-fluid"></div>
    </div>

    <div className="container-fluid mt--9">
      <div className="mt-7 mb-0 px-3 py-4 card card mb-1">
        <h2>उप व्यवस्थापक</h2>
      </div>
    </div>
    <div className="box">
      <div className="container-fluid">

        <Card className="mt-3 mb-5 px-3 py-4">
          <form onSubmit={handleSubmit}>
            <div className="row align-items-end mb-4">
              <div className="col-md-3 mb-3">
                <label htmlFor="email">
                  ईमेल
                </label>
                <input name="email" placeholder="ईमेल " type="email" value={value.email} className="form-control" onChange={handleDistrict} required />
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="password">
                  पासवर्ड
                </label>
                <input name="password" placeholder="पासवर्ड " type="text" value={value.password} className="form-control" onChange={handleDistrict} required />
              </div>

              {userData?.role == "admin" && <div className="col-md-3 mb-3">
                <label htmlFor="district">
                  ज़िला
                </label>
                <select name="district" id="district" className='form-control' value={value.district} onChange={handleDistrict} required>
                  <option value="">ज़िला</option>
                  {districtList?.map((district, index) => (
                    <option value={district.id} key={index}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>}

              {userData?.role == "district" && <div className="col-sm-3 ">
                <label htmlFor="upshakha">
                  उपशाखा
                </label>
                <select name="upshakha" id="" className='form-control' value={value.upshakha} onChange={handleDistrict}>
                  <option value="">उपशाखा</option>
                  {upshakhaList && upshakhaList?.map((upshakha, index) => (
                    <option value={upshakha.id} key={index}>
                      {upshakha.name}
                    </option>
                  ))}
                </select>
              </div>}

              <div className="col-sm-3 mb-3" style={{ textAlign: "start" }}>
                <button className="global_btn" type="submit">
                  Submit
                </button>
              </div>

            </div>


            <div className="asdf d-flex justify-content-end mb-3">
              <div className="d-flex align-items-center gap-1" style={{ gap: '10px' }}>
                <input type="text" placeholder='खोजे' className="form-control" name="keyword"
                  onChange={handleFilterChange} />
              </div>
              <div className="col-md-2">
                <select
                  className="form-control"
                  onChange={handleFilterChange}
                >
                  <option value=""> जिला </option>
                  {districtList?.map((district, index) => (
                    <option value={district.name} key={index}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex align-items-center gap-1" style={{ gap: '10px' }}>
                <div>  <p className="w-100 m-0" style={{ textWrap: 'nowrap' }}>Rows per page </p></div>
                <select className="form-control" onChange={handleSelectChange}>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                </select>
              </div>
            </div>



          </form>

          <div>
            <Table className="align-items-center table-flush" responsive>
              <TableBody>
                <Box margin={1}>
                  <Table
                    className={classes.table}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead className="thead-light">
                      <TableRow>
                        <TableCell scope="col"> उपयोगकर्ता नाम </TableCell>
                        <TableCell scope="col"> ईमेल </TableCell>
                        <TableCell scope="col"> पद </TableCell>
                        <TableCell scope="col"> जिला नाम</TableCell>
                        <TableCell scope="col"> उपशाखा नाम </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterList?.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell padding="none">{row.user_name}</TableCell>
                          <TableCell padding="none">{row.email}</TableCell>
                          <TableCell padding="none">{row.role}</TableCell>
                          <TableCell padding="none">{row.district_name}</TableCell>
                          <TableCell padding="none">{row.upshakha_name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </TableBody>
            </Table>
          </div>
          <div className="d-flex justify-content-end mt-3">

            {/* <Pagination
              count={2}
              variant="outlined"
              color="primary"
            /> */}

          </div>
        </Card>

      </div>
    </div>
    <Spinner sppiner={loading} />
  </>
  )
}

export default AdminLevel