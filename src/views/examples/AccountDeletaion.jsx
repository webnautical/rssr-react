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
  ContainerRow,
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
import { Row } from "react-bootstrap";
import Spinner from "components/Utility/Spinner";
import { rowPerPageInTable } from "components/Utility/Utility";
import { imageSize } from "components/Utility/Utility";
const useStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  table: {
    minWidth: 650,
    border: "2px solid #ccc",
    borderCollapse: "collapse",
  },
  snackbar: {
    bottom: "104px",
  },
});

const AccountDeletaion = () => {
  const classes = useStyles();
  const [list, setList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [categorySubList, setSubCategoryList] = useState([]);
  const [updData, setUpdData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  let postPerPage = rowPerPageInTable;
  const pageCount = Math.ceil(list.length / postPerPage);
  let indexOfLastPost = currentPage * postPerPage;
  let indexOfFirstPost = indexOfLastPost - postPerPage;
  let currentItems = list.slice(indexOfFirstPost, indexOfLastPost);


  const handlePageChange = (e, page) => {
    setCurrentPage(page);
  };

  const [imgPreview, setImgPreview] = useState({
    images: [],
  });
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    let role = getAllLocatData();
    setUserRole(role);
  }, []);

  useEffect(() => {
    getListFun();
  }, []);



  const getListFun = async () => {
    setLoading(true);
    try {
      let data = {}
      if (userRole?.role == "admin") {
        data = {}
      }
      else {
        data = {
          publish_by: userRole?.role,
          publisher_id: userRole?.user_id
        }
      }

      const res = await apiCall("/admin/getDeletedAccountRequests", "post", {data});
      if (res?.status) {
        setList(res?.data);
        console.log("res?.data", res)
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="header global-color pb-8  pt-5 pt-md-8">
        <div className="container-fluid"></div>
      </div>

      <div className="container-fluid mt--9">
        <div className="mt-7 mb-3 px-3 py-4 card card">
          <h3 className="mb-4">खाता हटाने का अनुरोध</h3>
        </div>
      </div>


      <div className="box">
        <div className="container-fluid">
          <div className="row justify-content-end mb-3">
            {/* <div className="col-md-3">
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
            </div> */}
          </div>
          <Row>
            <div className="col">
              <Card className="">
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
                              नाम{" "}
                            </TableCell>
                            <TableCell
                              scope="col"

                            >
                              फ़ोन{" "}
                            </TableCell>
                            <TableCell
                              scope="col"

                            >
                              ईमेल
                            </TableCell>
                            <TableCell
                              scope="col"

                            >
                              खाता हटाने का कारण
                            </TableCell>
                            <TableCell
                              scope="col"

                            >
                              तारीख
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {currentItems?.map((row, i) => (
                            <TableRow key={i}>
                              <TableCell>{row.first_name + " " +row.last_name}</TableCell>
                              <TableCell>{row.phone}</TableCell>
                              <TableCell>{row.email}</TableCell>
                              <TableCell>{row?.deletion_reason}</TableCell>
                              <TableCell>{row?.created_at}</TableCell>
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

export default AccountDeletaion;
