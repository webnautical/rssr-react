import React, { useState, useEffect } from "react";
import config from "config";
import "../css/table.css";
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
 
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
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
import { Link } from "react-router-dom";
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

const MukhPatr = () => {
  const classes = useStyles();
  const [list, setList] = useState([]);
  const [updData, setUpdData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);


  let postPerPage = rowPerPageInTable;
  const pageCount = Math.ceil(list.length / postPerPage);
  let indexOfLastPost = currentPage * postPerPage;
  let indexOfFirstPost = indexOfLastPost - postPerPage;
  let currentItems = list.slice(indexOfFirstPost, indexOfLastPost);
 
  
  const handlePageChange = (e,page) => {
    setCurrentPage(page);
  };
  const [value, setValue] = useState({
    name: "",
    attachment: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (updData?.id) {
      setValue({
        ...value,
        name: updData?.name,
        attachment: updData?.pdf,
        id: updData?.id,
      });
    } else {
      setValue({ ...value, name: "", attachment: "" });
    }
  }, [updData]);
  const handleChange = (e) => {
    if (e.target.name == "attachment") {
      setValue({ ...value, attachment: e.target.files[0] });
    } else {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  };

 

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (value.name == "") {
        toastifyError("Name field is required !!");
        setLoading(false);

        return false;
      }
      // if (value.attachment == '') {
      //     toastifyError('Attachment field is required !!')
      //     return false
      // }
      const formData = new FormData();
      formData.append("post_id", value.id);
      formData.append("name", value.name);
      formData.append("attachment", value?.attachment);
      const apiEnd = updData ? "update_mukhya_patr" : "create_mukhya_patr";
      const res = await apiCall(`/admin/${apiEnd}`, "post", formData);
      setLoading(false);
      if (res?.status) {
        toastifySuccess(res.message);
        setUpdData(null);
        setValue({ ...value, name: "", attachment: "" });
        getListFun();
      } else {
        toastifyError("Something went wrong !!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListFun();
  }, []);

  const getListFun = async () => {
    setLoading(true);
    try {
      const params = { type: "admin" };
      const res = await apiCall("/admin/get_mukhya_patr", "post", params);
      if (res?.status) {
        setList(res?.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleDelete = async (row) => {
    setLoading(true);
    try {
      const params = {
        id: row.id,
        is_deleted: !row.is_deleted,
        table_name: "mukhya_patr",
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
  const handleSelectChange = (event) => {
    const newValue = Number(event.target.value);
    const res = list.slice(0, newValue);
    // setFilteredData(res);
  };
  return (
    <>


<div className="header global-color pb-8  pt-5 pt-md-8">
        <div className="container-fluid"></div>
      </div>

      <div className="container-fluid mt--9">
        <div className="mt-7 mb-3 px-3 py-4 card card">
 

        <div className="row justify-content-start">

            <div className="col-md-12">
            <h3 className="mb-4"> मुख पत्र</h3>
            </div>
              <div className="col-sm-3 mb-3">
                <input
                  name="name"
                  placeholder="नाम "
                  type="text"
                  value={value.name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-sm-3 mb-3">
                {value.attachment || updData ? (
                  <input
                    name="attachment"
                    type="file"
                    onChange={handleChange}
                    className="form-control input-md"
                  />
                ) : (
                  <input
                    name="attachment"
                    type="file"
                    value={""}
                    onChange={handleChange}
                    className="form-control input-md"
                  />
                )}
                {updData ? updData?.pdf : ""}
              </div>
              <div className="col-sm-4 mb-3">
                {updData && (
                  <button
                    className="cancel_btn border-0 mx-2"
                    onClick={() => setUpdData(null)}
                  >
                    Cancel
                  </button>
                )}
                <button
                  className="global_btn"
                  onClick={() => handleSubmit()}
                >
                  {updData ? "UPDATE" : "ADD"}
                </button>
              </div>
            </div>
        </div>
       <div className="row justify-content-end mb-3">
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
      <div className="box">
        <div className="container-fluid">
          <Row>
            <div className="col">
              <Card className="">
                {/* <CardHeader className="border-0">
                  <h3 className="mb-0"> मुख पत्र </h3>
                </CardHeader> */}
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
                            <TableCell
                              scope="col"
                         
                            >
                              नाम
                            </TableCell>
                            <TableCell
                              scope="col"
                         
                            >
                              पीडीएफ
                            </TableCell>
                            <TableCell
                              scope="col"
                         
                            >
                              स्टेटस
                            </TableCell>
                            <TableCell
                              scope="col"
                         
                            >
                              एक्शन
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {currentItems?.map((row, i) => (
                            <TableRow key={i}>
                              <TableCell>{row.name}</TableCell>
                              <TableCell>
                                {" "}
                                <Link
                                  to={apiBaseURL() + "/" + row.pdf}
                                  target="_blank"
                                >
                                  <i class="fa-solid fa-file-pdf" style={{ fontSize:"20px", color:"#9e9e9e"}}></i>
                              
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Switch
                                  checked={row.is_deleted == 0 ? true : false}
                                  onChange={() => {
                                    handleDelete(row);
                                  }}
                                  name="loading"
                                  color="success"
                                />
                              </TableCell>

                              <TableCell>
                                <button
                                  className="edit_btn"
                                  onClick={() => setUpdData(row)}
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

export default MukhPatr;
