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
import {
  Card,
  CardHeader,
  CardFooter,

  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";
import Pagination from '@mui/material/Pagination';

import Switch from "@mui/material/Switch";
import { FaEdit, FaTrash } from "react-icons/fa";
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
import {
  toastifyError,
  toastifySuccess,
  getAllLocatData,
} from "components/Utility/Utility";
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

const School = () => {
  const classes = useStyles();
  const [entryDetail, setEntryDetail] = useState({ Peeos: [] });
  const [newEntry, setNewEntry] = useState({ panchayat: "", school: "" });
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const [selectedBlockId, setSelectedBlockId] = useState("");
  const [loading, setLoading] = useState(false);

  const [updatedData, setUpdatedData] = useState(null);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const [districtList, setDistrictList] = useState([]);
  const [blockList, setBlockList] = useState([]);
  const [blockByDistrictList, setBlockByDistrictList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const [postPerPage, setPagePerpage] = useState(rowPerPageInTable)
  const pageCount = Math.ceil(filteredData.length / postPerPage);
  let indexOfLastPost = currentPage * postPerPage;
  let indexOfFirstPost = indexOfLastPost - postPerPage;
  let currentItems = filteredData.slice(indexOfFirstPost, indexOfLastPost);


  const handlePageChange = (e, page) => {
    setCurrentPage(page);
  };

  const handleEdit = (row) => {
    setShow(true);
    getBlockByDistrictFun(row.district_id)
    setNewEntry({ panchayat: row.panchayat_name, school: row.school_name });
    setSelectedDistrict(row.district_id);
    setSelectedBlock(row.block_id);
    window.scrollTo(0, 0);
    setUpdatedData(row.id);
  };
  const UpdateData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${getAllLocatData()?.token}`,
      };

      const res = await axios.post(
        `${config.url}/admin/updatePeeo`,
        {
          id: updatedData,
          panchayat_name: newEntry.panchayat,
          district_id: selectedDistrict,
          block_id: selectedBlock,
        },
        { headers }
      );
      // console.log(res)
      setLoading(false);
      if (res.data.status === 200) {
        setSelectedDistrict("");
        setSelectedBlock("");
        setNewEntry({ panchayat: "" });
        // getUserDetails();
        //   setEditUserData({});
        setEntryDetail((prevState) => ({
          ...prevState,
          Peeos: prevState.Peeos.map((Peeos) => {
            if (Peeos.id === updatedData) {
              return { ...Peeos, name: newEntry };
            }
            return Peeos;
          }),
        }));
        toastifySuccess(res.data.message || "Record updated successfully");
        setShow(false);

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
        table_name: "peeo",
      };
      const res = await apiCall(`/admin/switchButton`, "post", params);
      if (res?.status) {
        setLoading(false);
        toastifySuccess(res?.message);
        getPeeoEntries();
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
    getPeeoEntries();
  }, [selectedDistrict]);

  useEffect(() => {
    getDistrictEntries();
    getBlockEntries();
  }, []);

  const getDistrictEntries = () => {
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
        //  setSelectedDistrict(responseData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  //ALL BLOCK DATA FETCH
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
        setBlockList(responseData?.blocks);
        //    setSelectedBlock(responseData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  //PEEO DATA FETCH
  const getPeeoEntries = () => {
    setLoading(true);

    const data = { type: "admin" };

    fetch(`${config.url}/admin/getAllPeeo`, {
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
        setEntryDetail(responseData);
        setFilteredData(responseData?.Peeos);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      const data = {
        panchayat_name: newEntry.panchayat,
        district_id: selectedDistrict,
        block_id: selectedBlock,
      };

      if (
        !newEntry.panchayat.trim() &&
        isNaN(selectedDistrict) &&
        isNaN(selectedBlock)
      ) {
        setLoading(false);
        return;
      }
      const res = await fetch(`${config.url}/admin/createPeeo`, {
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
        // Update entryDetail in state after successful creation
        setEntryDetail((prevState) => ({
          ...prevState,
          Peeos: [...prevState.Peeos, data],
        }));
        toastifySuccess("Record saved successfully!");
        setSelectedDistrict("");
        setSelectedBlock("");
        setOpen(true); // Show success snackbar
        setNewEntry({ panchayat: "", school: "" }); // Clear input fields
        getPeeoEntries(); // Refresh peeos data
      } else {
        // Handle error response if needed
        toastifyError(resJson?.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };

  const handleClose = () => {
    setOpen(false); // Close snackbar
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    getBlockByDistrictFun(e.target.value)
  };

  const handleBlockChange = (e) => {
    setSelectedBlock(e.target.value);
  };

  const getDistrictName = (districtId) => {
    const matchedDistrict = districtList.filter(
      (item) => item?.id === districtId
    )[0]?.name;

    return matchedDistrict;
  };

  const getBlockName = (blockId) => {
    const matcheBlock = blockList.filter((item) => item?.id === blockId)[0]
      ?.name;

    return matcheBlock;
  };

  const handleDistrictFilterChange = (e) => {
    const selectedDistrictId = e.target.value;
    setSelectedDistrictId(selectedDistrictId);

    // Filter the data based on both selected district and block IDs
    if (selectedDistrictId !== "" && selectedBlockId !== "") {
      const filtered = entryDetail.Peeos.filter(
        (peeos) =>
          peeos.district_id === parseInt(selectedDistrictId) &&
          peeos.block_id === parseInt(selectedBlockId)
      );
      setFilteredData(filtered);
    } else if (selectedDistrictId !== "") {
      // Filter only based on district ID if block ID is not selected
      const filtered = entryDetail.Peeos.filter(
        (peeos) => peeos.district_id === parseInt(selectedDistrictId)
      );
      setFilteredData(filtered);
    } else if (selectedBlockId !== "") {
      // Filter only based on block ID if district ID is not selected
      const filtered = entryDetail.Peeos.filter(
        (peeos) => peeos.block_id === parseInt(selectedBlockId)
      );
      setFilteredData(filtered);
    } else {
      // If neither district nor block is selected, reset the filtered data to display all
      setFilteredData(entryDetail.Peeos);
    }
  };

  const handleBlockFilterChange = (e) => {
    const selectedBlockId = e.target.value;
    setSelectedBlockId(selectedBlockId);

    // Filter the data based on both selected district and block IDs
    if (selectedDistrictId !== "" && selectedBlockId !== "") {
      const filtered = entryDetail.Peeos.filter(
        (peeos) =>
          peeos.district_id === parseInt(selectedDistrictId) &&
          peeos.block_id === parseInt(selectedBlockId)
      );
      setFilteredData(filtered);
    } else if (selectedBlockId !== "") {
      // Filter only based on block ID if district ID is not selected
      const filtered = entryDetail.Peeos.filter(
        (peeos) => peeos.block_id === parseInt(selectedBlockId)
      );
      setFilteredData(filtered);
    } else if (selectedDistrictId !== "") {
      // Filter only based on district ID if block ID is not selected
      const filtered = entryDetail.Peeos.filter(
        (peeos) => peeos.district_id === parseInt(selectedDistrictId)
      );
      setFilteredData(filtered);
    } else {
      // If neither district nor block is selected, reset the filtered data to display all
      setFilteredData(entryDetail.Peeos);
    }
  };


  const handleSelectChange = (event) => {
    const newValue = Number(event.target.value);
    setPagePerpage(newValue)
    const res = entryDetail?.Peeos?.slice(0, newValue);
    setFilteredData(res);
  };


  const getBlockByDistrictFun = async (district_id) => {
    try {
      const params = {
        district_id: district_id,
      };
      const res = await apiCall(`/admin/getBlockByDistrict`, "post", params);
      if (res?.status) {
        setBlockByDistrictList(res?.blocks);
      } else {
        setBlockByDistrictList([]);
      }
    } catch (error) {
      setBlockByDistrictList([]);
    }
  };
  return (
    <>
      <div className="header global-color pb-8  pt-5 pt-md-8">
        <div className="container-fluid"></div>
      </div>

      <div className="container-fluid mt--9">
        <div className="mt-7 mb-3 px-3 py-4 card card">
          <h3>पीईईओ</h3>
          <div id="field">
            <div id="field0">
              <div className="row mt-2">

                <div className="col-md-3">
                  <input
                    id="panchayat"
                    name="panchayat"
                    placeholder="पंचायत नाम"
                    type="text"
                    value={newEntry.panchayat}
                    onChange={handleChange}
                    className="form-control input-md"
                  />
                </div>
                <div className="col-md-2">
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

                <div className="col-md-2">
                  <div className="global_arrow">
                    <select
                      value={selectedBlock}
                      onChange={handleBlockChange}
                      name="selectedBlock"
                      className="selectDropdown form-control"
                    >
                      <option value=""> ब्लॉक चुनें</option>
                      {blockByDistrictList?.map((block, index) => (
                        <option value={block.id} key={index}>
                          {block.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-4 d-flex gap-1">
                  {show && (
                    <button
                      className="border-0 cancel_btn mx-2"
                      onClick={() => {
                        // setUpdData(null);

                        setSelectedDistrict("");
                        setSelectedBlock("");
                        setNewEntry({ panchayat: "" });
                        setShow(false);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    id="add-more"
                    name="add-more"
                    className="global_btn"
                    onClick={show ? UpdateData : handleFormSubmit}
                  >
                    {show ? "UPDATE" : "ADD"}
                  </button>
                </div>

              </div>

              {/* <div className="form-group">
                <label className="col-md-4 control-label" htmlFor="address">
                  School Name
                </label>
                <div className="col-md-5">
                  <input
                    id="school"
                    name="school"
                    placeholder="School Name"
                    type="text"
                    value={newEntry.school}
                    onChange={handleChange}
                    className="form-control input-md"
                  />
                </div>

              </div> */}




            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <Row>
          <div className="col">
            <Card className="">



              <Table className="align-items-center table-flush" responsive>
                <TableCell>
                  <Col className="mb-2 mt-3 ">

                    <div className="row">
                      <div className="col-md-8">
                        <h3 className="mb-0"> सभी पीईईओ की सूची </h3>
                      </div>

                    </div>

                    <div className="row justify-content-end mt-3">
                      <div className="col-md-2">
                        <select
                          className="form-control"
                          value={selectedDistrictId}
                          onChange={handleDistrictFilterChange}
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
                      <div className="col-md-2">
                        <select
                          className="form-control"
                          value={selectedBlockId}
                          onChange={handleBlockFilterChange}
                          name="selectedId"
                        >
                          <option value="">ब्लॉक फ़िल्टर </option>
                          {blockList?.map((block, index) => (
                            <option value={block.id} key={index}>
                              {block.name}
                            </option>
                          ))}
                        </select>
                      </div>
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
                  </Col>
                </TableCell>
                <TableBody>
                  <Snackbar
                    open={open}
                    autoHideDuration={2000}
                    onClose={handleClose}
                    className={classes.snackbar}
                  >
                    <Alert onClose={handleClose} severity="success">
                      Record saved successfully!
                    </Alert>
                  </Snackbar>
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
                            पंचायत नाम
                          </TableCell>
                          {/* <TableCell scope="col" style={{ border: '1px solid #000' }}>School Name</TableCell> */}
                          <TableCell
                            scope="col"

                          >
                            जिला
                          </TableCell>
                          <TableCell
                            scope="col"

                          >
                            ब्लॉक
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
                        {/* {entryDetail &&
                          entryDetail.Peeos &&
                          entryDetail.Peeos.map((row, i) => ( */}
                        {currentItems?.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell padding="none">
                              {row.panchayat_name}
                            </TableCell>
                            {/* <TableCell padding="none">{row.school_name}</TableCell> */}
                            <TableCell padding="none">
                              {getDistrictName(row.district_id)}
                            </TableCell>
                            <TableCell padding="none">
                              {getBlockName(row.block_id)}
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
    </>
  );
};

export default School;
