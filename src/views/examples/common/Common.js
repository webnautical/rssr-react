import React, { useState, useEffect } from "react";
import config from "config";
import "../../css/table.css";
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

  Table,

} from "reactstrap";
import Pagination from '@mui/material/Pagination';
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
import { rowPerPageInTable } from "components/Utility/Utility";
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

const Common = () => {
  const { pathname } = useLocation();
  const parts = pathname.split("/");

  const pageName = parts[parts.length - 1];

  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState([]);
  const [upShakhaList, setUpShakhaList] = useState([]);
  const [disttrictList, setDistrictList] = useState([]);
  const [sambhagList, setSambhagList] = useState([]);
  const [updData, setUpdData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const[postPerPage, setPagePerpage] = useState(rowPerPageInTable)
  const pageCount = Math.ceil(filter.length / postPerPage);
  let indexOfLastPost = currentPage * postPerPage;
  let indexOfFirstPost = indexOfLastPost - postPerPage;
  let currentItems = filter.slice(indexOfFirstPost, indexOfLastPost);


  const handlePageChange = (e, page) => {
    setCurrentPage(page);
  };

  // 
  const [typeList, setTyeList] = useState([
    "PERSONAL",
    "OFFICIAL",
    "ORGANIZATIONAL",
  ]);
  const [apiEndPointsArr] = useState({
    getAllDistrict: ["updateDistrict", "createDistrict", "ज़िला", "district"],
    getUpshakha: ["updateUpshakha", "createUpshakha", "उपशाखा", "upshakha"],
    getSambhag: ["updateSambhag", "createSambhag", "संभाग ", "sambhag"],
    getSankul: ["updateSankul", "createSankul", "संकुल ", "sankul"],
    getDutylevel: [
      "updateDutylevel",
      "createDutylevel",
      "दायित्व स्तर ",
      "duty_level",
    ],
    getDuty: ["updateDuty ", "createDuty", "दायित्व  ", "duty"],
    getSangathan: [
      "updateSangathan ",
      "createSangathan",
      "संगठन ",
      "sangathan",
    ],
    getTehsil: ["updateTehsil ", "createTehsil", "तहसील ", "tehsil"],
  });

  const getItemsForKey = (obj, key) => {
    return obj[key] || [];
  };
  const apiEndPoints = getItemsForKey(apiEndPointsArr, pageName);

  const [value, setValue] = useState({
    name: "",
    district_id: "",
    upshakha_id: "",
    sambhag_id: "",
    type: "",
    code: ""
  });
  useEffect(() => {
    setUpdData(null);
  }, [pathname])
  useEffect(() => {
    window.scrollTo(0, 0);
    if (updData?.id) {
      setValue({
        ...value,
        name: updData?.name,
        district_id: updData?.district_id,
        upshakha_id: updData?.upshakha_id,
        id: updData?.id,
        sambhag_id: updData?.sambhag_id,
        type: updData?.type,
        code: updData?.code
      });
    } else {
      setValue({ ...value, name: "" });
    }
  }, [updData]);
  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (value.name == "") {
        toastifyError("Name field is required !!");
        return false;
      }
      setLoading(true);
      const apiEnd = updData ? apiEndPoints[0] : apiEndPoints[1];
      const res = await apiCall(
        `/admin/${apiEnd}`,
        "post",
        JSON.stringify(value)
      );
      setLoading(false);
      if (res?.status) {
        toastifySuccess(res.message);
        setUpdData(null);
        setValue({
          ...value,
          name: "",
          district_id: "",
          id: "",
          sambhag_id: "",
          type: "",
          code: ""
        });
        getListFun();
      } else {
        setLoading(false);
        toastifyError("Something went wrong !!");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toastifyError("Something went wrong !!");
    }
  };

  useEffect(() => {
    getListFun();
  }, [pageName]);
  useEffect(() => {
    getDistrictFun();
    getUpShakhaFun();
    getSambhagFun();
  }, []);

  const getDistrictFun = async () => {
    try {
      let params = {};
      if (pageName == "getUpshakha") {
        params = { district_type: "ORGANIZATIONAL" };
      }

      else if (pageName == "getTehsil") {
        params = { district_type: "PERSONAL" };
      }
      else {
        params = { type: "admin" };

      }
      const res = await apiCall("/admin/getAllDistrict", "post", params);
      if (res?.status) {
        setDistrictList(res?.districts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUpShakhaFun = async () => {
    try {
      const params = { type: "admin" };
      const res = await apiCall("/admin/getUpshakha", "post", params);
      if (res?.status) {
        setUpShakhaList(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getListFun = async () => {
    setLoading(true);
    try {
      const params = { type: "admin" };
      const res = await apiCall(`/admin/${pageName}`, "post", params);
      if (res?.status) {
        setLoading(false);
        setList(res?.data || res?.districts);
        setFilter(res?.data || res?.districts);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getSambhagFun = async () => {
    setLoading(true);
    try {
      const params = { type: "admin" };
      const res = await apiCall(`/admin/getSambhag`, "post", params);
      if (res?.status) {
        setLoading(false);
        setSambhagList(res?.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleSwitch = async (row) => {
    setLoading(true);
    try {
      const params = {
        id: row.id,
        is_deleted: !row.is_deleted,
        table_name: apiEndPoints[3],
      };
      const res = await apiCall(`/admin/switchButton`, "post", params);
      if (res?.status) {
        setLoading(false);
        toastifySuccess(res?.message);
        getListFun();
      } else {
        setLoading(false);
        toastifyError("Something went wrong !!");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toastifyError("Server : Something went wrong !!");
    }
  };

  const handleFilterChange = (e) => {
    if (e.target.value !== "") {
      const filtered = list?.filter((item) => item.name == e.target.value || item.type == e.target.value || item?.name?.includes(e.target.value));
      setFilter(filtered);
    } else {
      setFilter(list);
    }
  }

  const handleSelectChange = (event) => {
    const newValue = Number(event.target.value);
    setPagePerpage(newValue)
    const res = list.slice(0, newValue);
    setFilter(res);
  };

  return (
    <>
      <div className="">
        <div className="header global-color pb-8  pt-5 pt-md-8">
          <div className="container-fluid"></div>
        </div>
        <div className="container-fluid mt--9">
          <Card className="mt-7 mb-3 px-3 py-4 card">

            <div className="row align-items-center justify-content-start">
              <div className="col-12">
                <h3>{apiEndPoints[2]}</h3>
              </div>
              <div className="col-lg-2 col-md-3 mb-2 mt-2">
                <input
                  name="name"
                  placeholder="नाम "
                  type="text"
                  value={value.name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              {pageName == "getSankul" ? (
                <div className="col-lg-2 col-md-3 mb-2 mt-2">
                  <select
                    name="upshakha_id"
                    value={value.upshakha_id}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">उपशाखा</option>
                    {upShakhaList?.map((item, i) => (
                      <option value={item.id} key={i}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : pageName == "getUpshakha" || pageName == "getTehsil" ? (
                <>
                  <div className="col-lg-2 col-md-3 mb-2 mt-2">
                    <select
                      name="district_id"
                      value={value.district_id}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">जिला </option>
                      {disttrictList?.map((item, i) => (
                        <option value={item.id} key={i}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-2 col-md-3 mb-2 mt-2">
                    <input type="text" name="code" value={value?.code} onChange={handleChange} placeholder="उपशाखा कोड" className="form-control" />
                  </div>
                </>
              ) : pageName == "getAllDistrict" ? (
                <>
                  <div className="col-lg-2 col-md-3 mb-2 mt-2">
                    <select
                      name="sambhag_id"
                      value={value.sambhag_id}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">संभाग </option>
                      {sambhagList?.map((item, i) => (
                        <option value={item.id} key={i}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-2 col-md-3 mb-2 mt-2">
                    <select
                      name="type"
                      value={value.type}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">प्रकार </option>
                      {typeList?.map((item, i) => (
                        <option value={item} key={i}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-2 col-md-3 mb-2 mt-2">
                    <input type="text" name="code" value={value?.code} onChange={handleChange} placeholder="जिला कोड" className="form-control" />
                  </div>

                </>
              ) : (
                <></>
              )}

              <div className="col-lg-4">
                <div className="d-flex justify-content-start" style={{ gap: "15px" }}>
                  {updData && (
                    <button
                      className="border-0 cancel_btn"
                      onClick={() => {
                        setUpdData(null);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    className="global_btn"
                    onClick={() => handleSubmit()}
                  >
                    {updData ? "UPDATE" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Row>
            <div className="col">
              <Card className="">
                {/* <CardHeader className="border-0">
                  <h3 className="mb-0"> {apiEndPoints[2]} </h3>
                </CardHeader> */}
                <Table className="align-items-center table-flush" responsive>
                  <div className="container-fluid">
                  <h3 className="mb-0 mt-4">{apiEndPoints[2]} सूची  </h3>
                    <div className="row  align-items-between mt-3 mb-3" style={{ justifyContent: 'end' }}>
                  

                     


                        {
                          (pageName == "getAllDistrict" || pageName == "getTehsil") &&
                          <>
                            <div className="col-md-3 mb-2 align-items-center gap-1" style={{ gap: '10px' }}>
                              <input type="text" className="form-control" placeholder='खोजे' name="keyword"
                                onChange={handleFilterChange} />
                            </div>


                          </>
                        }
                        {
                          pageName == "getAllDistrict" &&
                          <>
                            <div className="col-md-3 mb-2" style={{ gap: '10px' }}>
                              <select className="form-control"
                                name="jila_type"
                                onChange={handleFilterChange}>
                                <option value="">सेलेक्ट जिला टाइप </option>
                                <option value="OFFICIAL">OFFICIAL</option>
                                <option value="ORGANIZATIONAL">ORGANIZATIONAL</option>
                                <option value="PERSONAL">PERSONAL</option>
                              </select>
                            </div>
                          </>
                        }
                        {
                          (pageName == "getAllDistrict" || pageName == "getUpshakha" || pageName == "getTehsil") &&
                          <div className="col-md-3 mb-2">
                            <select
                              className="form-control"
                              onChange={handleFilterChange}
                            >
                              <option value=""> जिला फ़िल्टर </option>
                              {disttrictList?.map((district, index) => (
                                <option value={district.name} key={index}>
                                  {district.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        }
                     <div className="col-md-3">
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
                     
                    </div>

                   
                  </div>

                  <TableBody>
                    <Box margin={1}>
                      <Table
                        className={classes.table}
                        size="small"
                        aria-label="a dense table"
                      >
                        <TableHead className="thead-light">
                          <TableRow>
                            <TableCell scope="col">नाम </TableCell>
                            {pageName == "getSankul" ? (
                              <TableCell scope="col">उपशाखा </TableCell>
                            ) : pageName == "getUpshakha" ||
                              pageName == "getTehsil" ? (
                              <>
                                <TableCell scope="col">जिला</TableCell>
                                <TableCell scope="col">उपशाखा कोड</TableCell>
                              </>
                            ) : pageName == "getAllDistrict" ? (
                              <>
                                <TableCell scope="col">संभाग</TableCell>
                                <TableCell scope="col">प्रकार</TableCell>
                                <TableCell scope="col">जिला कोड</TableCell>
                              </>
                            ) : (
                              <></>
                            )}
                            <TableCell scope="col">स्टेटस </TableCell>
                            <TableCell scope="col">एक्शन </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {currentItems?.map((row, i) => (
                            <TableRow key={i}>
                              <TableCell>{row.name}</TableCell>
                              {pageName == "getSankul" ? (
                                <TableCell>{row.upshakha_name}</TableCell>
                              ) : pageName == "getUpshakha" ||
                                pageName == "getTehsil" ? (
                                <>
                                  <TableCell>{row.district_name}</TableCell>
                                  <TableCell>{row.code}</TableCell>
                                </>
                              ) : pageName == "getAllDistrict" ? (
                                <>
                                  <TableCell>{row.sambhag_name}</TableCell>
                                  <TableCell>{row.type}</TableCell>
                                  <TableCell>{row.code}</TableCell>
                                </>
                              ) : (
                                <></>
                              )}
                              <TableCell>
                                <Switch
                                  checked={row.is_deleted == 0 ? true : false}
                                  onChange={() => {
                                    handleSwitch(row);
                                  }}
                                  name="loading"
                                  color="success"
                                />
                              </TableCell>

                              <TableCell>
                                <button
                                  className="edit_btn"
                                  onClick={() => { setUpdData(row); }}
                                >
                                  <FaEdit />
                                </button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </TableBody>
                </Table>
                <div className="d-flex justify-content-center">

                  <Pagination
                    count={pageCount}
                    variant="outlined"
                    color="primary"
                    onChange={handlePageChange}
                  />

                </div>
              </Card>
            </div>
          </Row>
        </div>
      </div>

      <Spinner sppiner={loading} />
    </>
  );
};

export default Common;
