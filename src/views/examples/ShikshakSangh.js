import React, { useState, useEffect } from "react";
import config from "config";
import "../css/table.css";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import Switch from "@mui/material/Switch";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  Box,
  Button,
  Snackbar,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import {
  Card,
  CardHeader,
  CardFooter,

  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
} from "reactstrap";
import Pagination from '@mui/material/Pagination';

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  toastifyError,
  toastifySuccess,
  getAllLocatData,
} from "components/Utility/Utility";
import axios from "axios";
import Spinner from "components/Utility/Spinner";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { apiCall } from "api/interceptor";
import { rowPerPageInTable } from "components/Utility/Utility";
// Creating styles
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

const ShikshakSangh = () => {
  const classes = useStyles();
  const [entryDetail, setEntryDetail] = useState([]);
  const [list, setList] = useState([])

  const [updatedData, setUpdatedData] = useState(null);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedRowStatus, setSelectedRowStatus] = useState({
    id: null,
    is_deleted: false,
  });
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10); // Number of items per page
  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };
  // const indexOfLastItem = currentPage * perPage;
  // const indexOfFirstItem = indexOfLastItem - perPage;
  // const currentItems = entryDetail?.data.slice(
  //   indexOfFirstItem,
  //   indexOfLastItem
  // );
  let postPerPage = rowPerPageInTable;
  const pageCount = Math.ceil(entryDetail?.length / postPerPage);
  let indexOfLastPost = currentPage * postPerPage;
  let indexOfFirstPost = indexOfLastPost - postPerPage;
  let currentItems = entryDetail.slice(indexOfFirstPost, indexOfLastPost);
 

  const handlePageChange = (e, page) => {
    setCurrentPage(page);
  };

  const [value, setValue] = useState({
    name: "",
    type: "",
    info: "",
    category_id: "",
  });
  const [info, setinfo] = useState();
  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleEdit = (row) => {
  

    setShow(true);

    setValue({
      ...value,
      category_id: "",
      name: "",
      type: "",
    });
    window.scrollTo(0, 0);
    setValue({
      ...value,
      category_id: row.id,
      name: row.name,
      type: row.type,
    });
    setinfo(row.info);
  };

  const UpdateData = async () => {
    try {
      setLoading(true);

      let finalValue = {
        category_id: value.category_id,
        type: value.type,
        name: value.name,
        info: info,
      };
      const headers = {
        Authorization: `Bearer ${getAllLocatData()?.token}`,
      };

      const res = await axios.post(
        `${config.url}/admin/UpdateShikshakSanghCategory`,
        finalValue,
        { headers }
      );
      setLoading(false);
      if (res.data.status === 200) {
        toastifySuccess(res.data.message || "Record updated successfully");
        setShow(false);
        getDistrictEntries();
        setValue({
          ...value,
          category_id: "",
          info: "",
          name: "",
          type: "",
        });
        setinfo("");
      } else {
        toastifyError(
          res.data.message || "Something went wrong while updating Record"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toastifyError("Internal server error");
    }
  };
  const handleDelete = async (row) => {
    setLoading(true);
    try {
      const params = {
        id: row.id,
        is_deleted: !row.is_deleted,
        table_name: "shikshan_sangh_category",
      };
      const res = await apiCall(`/admin/switchButton`, "post", params);
      if (res?.status) {
        setLoading(false);
        toastifySuccess(res?.message);
        getDistrictEntries();
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

  useEffect(() => {
    getDistrictEntries();
  }, []);

  const getDistrictEntries = () => {
    setLoading(true);

    const data = { type: "admin" };

    fetch(`${config.url}/admin/getShikshakSanghCategory`, {
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
        if (responseData.status === 200) {
          setEntryDetail(responseData?.data);
          setList(responseData?.data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toastifyError(error.response.data.message);
      });
  };

  const handleFormSubmit = async () => {
    try {
     
   
      let finalValue = {
        type: value.type,
        name: value.name,
        info: info,
      };

      setLoading(true);
      if (!finalValue.name.trim()) {
        toastifyError("Name is required");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${config.url}/admin/CreateShikshakSanghCategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAllLocatData()?.token}`,
          },
          body: JSON.stringify(finalValue),
        }
      );

      const resJson = await res.json();
      setLoading(false);
      if (resJson.status === 200) {
        toastifySuccess("  Record saved successfully!");
        setOpen(true);
        getDistrictEntries();
        setValue({
          ...value,
          category_id: "",
          info: "",
          name: "",
          type: "",
        });
        setinfo("");
      } else {
        toastifyError(resJson?.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toastifyError(error?.resJson?.message);
    }
  };  
  
  const handleSelectChange = (event) => {
    const newValue = Number(event.target.value);
    const res = list.slice(0, newValue);
    setEntryDetail(res);
  };

  return (
    <>
      <div className="header global-color pb-8  pt-5 pt-md-8">
        <div className="container-fluid"></div>
      </div>

      <div className="container-fluid mt--9">
        <div className="mt-7 mb-3 px-3 py-4 card card">


          <div id="field">
            <div id="field0">
              <div className="row justify-content-start">
                <div className="col-12 mb-2">
                  <h3>शिक्षकसंघ</h3>
                </div>
                <div className="col-md-2 mb-3">
                  <input
                    name="name"
                    placeholder=" ShikshakSangh Name"
                    type="text"
                    value={value?.name}
                    onChange={handleChange}
                    className="form-control input-md"
                  />
                </div>
                <div className="col-md-2 mb-3">
                  <select
                    name="type"
                    value={value?.type}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Type </option>
                    <option value={"text"}>Text</option>
                    <option value={"pdf"}>PDF</option>
                  </select>
                  {value?.type == "text" && (
                    <div className="ck.ck-editor__main ">
                      <CKEditor
                        editor={ClassicEditor}
                        data={info}
                        onReady={(editor) => { }}
                        onChange={(event, editor) => {
                          const content = editor.getData();
                          setinfo(content);
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="col-md-4 mb-3">

                  <div className="">
                    {show && (
                      <button
                        className="border-0 cancel_btn mx-2"
                        onClick={() => {
                          // setUpdData(null);
                          // setSelectedDistrict("");
                          // setNewBlock("");
                          setValue({
                           
                            category_id: "",
                            name: "",
                            type: "",
                          });
                          setShow(false);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      id="add-more"
                      name="add-more"
                      className="global_btn "
                      onClick={show ? UpdateData : handleFormSubmit}
                    >
                      {show ? "UPDATE" : "ADD"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-end">
            <div className="col-md-2">
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
      </div>

      <div className="container-fluid">
        <Row>
          <div className="col">
            <Card className="">
              {/* <CardHeader className="border-0">
                <h3 className="mb-0"> शिक्षक संघ वर्ग </h3>
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
                          <TableCell scope="col">   शिक्षकसंघ </TableCell>
                          <TableCell scope="col">स्टेटस</TableCell>
                          <TableCell scope="col">एक्शन</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* {entryDetail && entryDetail?.data.map((row, i) => ( */}
                        {currentItems?.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>
                              <Switch
                                checked={row.is_deleted == 0 ? true : false}
                                onChange={() => {
                                  setSelectedRowStatus({
                                    id: row.id,
                                    is_deleted: !row.is_deleted,
                                  });
                                  handleDelete(row);
                                }}
                                name="loading"
                                color="success"
                              />
                            </TableCell>

                            <TableCell>
                              <button
                                className="edit_btn"
                                onClick={() => {
                                  handleEdit(row);
                                }}
                              >
                                {" "}
                                <FaEdit />
                              </button>

                              {/* <button className="table-icon" onClick={() => handleDelete(row)}><FaTrash /></button> */}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </TableBody>
              </Table>
              {/* Pagination Component */}
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
      <Spinner sppiner={loading} />
    </>
  );
};

export default ShikshakSangh;
