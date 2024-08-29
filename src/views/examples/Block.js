import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Snackbar,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
} from "@material-ui/core";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import config from "config";
import axios from "axios";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  toastifySuccess,
  toastifyError,
  getAllLocatData,
} from "components/Utility/Utility";
import {
  Col,
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

import Spinner from "components/Utility/Spinner";
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

const Block = () => {
  const classes = useStyles();
  const [entryDetail, setEntryDetail] = useState({ blocks: [] });
  const [filteredData, setFilteredData] = useState([]);
  const [newBlock, setNewBlock] = useState("");
  const [updatedData, setUpdatedData] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [open, setOpen] = useState(false);
  const [districtList, setDistrictList] = useState([]);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // let postPerPage = rowPerPageInTable;
  const[postPerPage, setPagePerpage] = useState(rowPerPageInTable)
  const pageCount = Math.ceil(filteredData.length / postPerPage);
  let indexOfLastPost = currentPage * postPerPage;
  let indexOfFirstPost = indexOfLastPost - postPerPage;
  let currentItems = filteredData.slice(indexOfFirstPost, indexOfLastPost);


  const handlePageChange = (e, page) => {
    setCurrentPage(page);
  };


  const handleEdit = (row) => {
    setShow(true);
    setNewBlock(row.name);
    setSelectedDistrict(row.district_id);
    window.scrollTo(0, 0);
    setUpdatedData(row.id);
  };
  const UpdateData = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${getAllLocatData()?.token}`,
      };

      const res = await axios.post(
        `${config.url}/admin/updateBlock`,
        {
          id: updatedData,
          name: newBlock,
          district_id: selectedDistrict,
        },
        { headers }
      );
      // console.log(res)
      setLoading(false);
      if (res.data.status === 200) {
        // console.log('hellooooooo')
        setSelectedDistrict("");
        getBlockEntries();
        getDistrictEntries();
        //   getUserDetails();
        //   setEditUserData({});

        setEntryDetail((prevState) => ({
          ...prevState,
          blocks: prevState.blocks.map((blocks) => {
            if (blocks.id === updatedData) {
              return { ...blocks, name: newBlock };
            }
            return blocks;
          }),
        }));
        toastifySuccess(res.data.message || "Record updated successfully");
        setShow(false);
        setNewBlock("");
        setUpdatedData(null);
        // Reload the page after successful update
        // window.location.reload();
      } else {
        // setLoading(false);
        toastifyError(
          res.data.message || "Something went wrong while updating Record"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      // setLoading(false);
      toastifyError("Internal server error");
    }
  };
  const handleSwitch = async (row) => {
    setLoading(true);
    try {
      const params = {
        id: row.id,
        is_deleted: !row.is_deleted,
        table_name: "block",
      };
      const res = await apiCall(`/admin/switchButton`, "post", params);
      if (res?.status) {
        setLoading(false);
        toastifySuccess(res?.message);
        getBlockEntries();
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
    // Fetch districts here to populate dropdown
    getDistrictEntries();
  }, []);
  useEffect(() => {
    getBlockEntries(selectedDistrict);
  }, []);
  const getDistrictEntries = () => {
    setLoading(true);
    const data = { district_type: "OFFICIAL" };
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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };
  const getBlockEntries = () => {
    const data = { type: "admin" };
    fetch(`${config.url}/admin/getAllBlock`, {
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
          setEntryDetail(responseData);
          setFilteredData(responseData?.blocks);
        } else {
          // Handle error response if needed
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      if (
        !newBlock.trim() &&
        !selectedDistrict.trim() &&
        isNaN(selectedDistrict)
      ) {
        console.log(
          "Invalid form data. Block:",
          !newBlock.trim(),
          "District ID:",
          selectedDistrict
        );
        setLoading(false);
        return;
      }
      const data = { name: newBlock, district_id: selectedDistrict };
      const res = await fetch(`${config.url}/admin/createBlock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAllLocatData()?.token}`,
        },
        body: JSON.stringify(data),
      });

      const resJson = await res.json();
      setLoading(false);

      if (resJson.status === 200) {
        setSelectedDistrict("");
        // Update blocks in state after successful creation
        setEntryDetail((prevState) => ({
          ...prevState,
          blocks: [...prevState.blocks, data],
        }));
        toastifySuccess("Record saved successfully!");
        setOpen(true); // Show success snackbar
        setNewBlock(""); // Clear input field
        // Extract the selected district ID from the array
        // const districtId = selectedDistrict.districts.find(district => district.id === selectedDistrict.districts.id);
        getBlockEntries();
      } else {
        // Handle error response if needed
        toastifyError(resJson?.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClose = () => {
    setOpen(false); // Close snackbar
  };

  const handleNewBlockChange = (e) => {
    setNewBlock(e.target.value);
  };
  const handleDistrictChange = (e) => {
    const selectedValue = e.target.value;
    if (!isNaN(parseInt(selectedValue))) {
      setSelectedDistrict(selectedValue);

    } else {
      console.log("Invalid district value:", selectedValue);
    }
  };
  const handleFilterChange = (e) => {
    const selectedValue = e.target.value;
    if (!isNaN(parseInt(selectedValue))) {
      setSelectedId(selectedValue);
      console.log(selectedValue, "selected");
      // Filter the data based on the selected district ID
      if (selectedValue !== "") {
        const filtered = entryDetail?.blocks?.filter(
          (block) => block.district_id === parseInt(selectedValue)
        );
        setFilteredData(filtered);
      } else {
        // If no district is selected, reset the filtered data to display all blocks
        setFilteredData(entryDetail.blocks);
      }
    } else {
      console.log("Invalid district value:", selectedValue);
    }
  };

  const getDistrictName = (districtId) => {
    const matchedDistrict = districtList.filter(
      (item) => item?.id === districtId
    )[0]?.name;
    return matchedDistrict;
  };

  const handleSelectChange = (event) => {
    const newValue = Number(event.target.value);
    setPagePerpage(newValue)
    const res = entryDetail?.blocks?.slice(0, newValue);
    setFilteredData(res);
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
              {/* <label className="col-md-4 control-label" htmlFor="address">
                  Add Block
                </label> */}

              <div className="row align-items-center justify-content-start">
                <div className="col-12 mt-2 mb-2">
                  <h3 className="m-0"> ब्लॉक परिवर्तन </h3>
                </div>
                <div className="col-md-2  mt-2 mb-2">
                  <input
                    id="block"
                    name="block"
                    placeholder="ब्लॉक का नाम"
                    type="text"
                    value={newBlock}
                    onChange={handleNewBlockChange}
                    className="form-control input-md"
                  />
                </div>

                <div className="col-md-2  mt-2 mb-2">
                  <div className="global_arrow">
                    <select
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      name="selectedDistrict"
                      className="selectDropdown form-control"
                    >
                      <option value=""> जिला चुनें </option>
                      {districtList?.map((district, index) => (
                        <option value={district.id} key={index}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-4  mt-2 mb-2">
                  <div style={{ textAlign: 'start' }}>
                    {show && (
                      <button
                        className="border-0 cancel_btn mx-3"
                        onClick={() => {
                          // setUpdData(null);
                          setSelectedDistrict("");
                          setNewBlock("");

                          setShow(false);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      id="add-more "
                      name="add-more"
                      className="global_btn W-100"
                      onClick={show ? UpdateData : handleFormSubmit}
                    >
                      {show ? "UPDATE" : "ADD"}
                    </button>

                  </div>
                </div>

              </div>
            </div>
          </div>


        </div>

        <div>
          <Row>
            <div className="col">
              <Card className="">
                <div>
                  <Table className="align-items-center table-flush" responsive>
                    <div className="container-fluid">
                    <h3 className="mb-0 mt-4"> ब्लॉक सूची  </h3>
                      <div className="row justify-content-end align-items-center mt-3 mb-3">
                     
                        <div className="col-md-2 mb-4">
                          <select
                            className="form-control"
                            value={selectedId}
                            onChange={handleFilterChange}
                            name="selectedId"
                          >
                            <option value=""> जिला फ़िल्टर </option>
                            {districtList?.map((district, index) => (
                              <option value={district.id} key={index}>
                                {district.name}
                              </option>
                            ))}
                          </select>
                        </div>

                       <div className="col-md-3 mb-4">
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
                      {/* <Snackbar
                      open={open}
                      autoHideDuration={2000}
                      onClose={handleClose}
                      className={classes.snackbar}
                    >
                      <Alert onClose={handleClose} severity="success">
                        Record saved successfully!
                      </Alert>
                    </Snackbar> */}
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
                                ब्लॉक
                              </TableCell>
                              <TableCell
                                scope="col"

                              >
                                ज़िला
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
                            {/* {entryDetail && entryDetail.blocks && entryDetail.blocks.map((row, i) => ( */}
                            {currentItems?.map((row, i) => (
                              <TableRow key={i}>
                                <TableCell padding="none">{row.name}</TableCell>
                                <TableCell padding="none">
                                  {getDistrictName(row.district_id)}
                                </TableCell>
                                <TableCell>
                                  <Switch
                                    checked={row.is_deleted == 0 ? true : false}
                                    onChange={() => handleSwitch(row)}
                                    name="loading"
                                    color="success"
                                  />
                                </TableCell>
                                <TableCell>
                                  <button
                                    className="edit_btn"
                                    onClick={() => handleEdit(row)}
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
                </div>
                {/* Pagination */}
                <div className="d-flex justify-content-end mt-3">

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
      </div>
    </>
  );
};

export default Block;
