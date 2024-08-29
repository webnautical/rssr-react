import React, { useState, useEffect } from "react";
import config from "config";
import "../css/table.css";
import FormControlLabel from "@mui/material/FormControlLabel";
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
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
} from "reactstrap";
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

const District = () => {
  const classes = useStyles();
  const [entryDetail, setEntryDetail] = useState({ districts: [] });
  const [newDistrict, setNewDistrict] = useState("");
  const [updatedData, setUpdatedData] = useState(null);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedRowStatus, setSelectedRowStatus] = useState({
    id: null,
    is_deleted: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10); // Number of items per page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentItems = entryDetail.districts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleEdit = (row) => {
    setShow(true);
    setNewDistrict(row?.name);
    window.scrollTo(0, 0);

    setUpdatedData(row?.id);
  };
  const UpdateData = async () => {
    //e.preventDefault()
    //setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${getAllLocatData()?.token}`,
      };

      const res = await axios.post(
        `${config.url}/admin/updateDistrict`,
        {
          id: updatedData,
          name: newDistrict,
        },
        { headers }
      );
      // console.log(res)
      if (res.data.status === 200) {
        // setLoading(false);
        //   getUserDetails();
        //   setEditUserData({});
        setEntryDetail((prevState) => ({
          ...prevState,
          districts: prevState?.districts?.map((district) => {
            if (district?.id === updatedData) {
              return { ...district, name: newDistrict };
            }
            return district;
          }),
        }));
        toastifySuccess(res?.data?.message || "Record updated successfully");
        setShow(false);
        setNewDistrict("");
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
  const handleDelete = async (row) => {
    // const isConfirmed = window.confirm(`Are you sure you want to delete ${row.name} ?`);
    // if (!isConfirmed) return;

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        id: row?.id,
        is_deleted: !row.is_deleted,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        `${config.url}/admin/deleteDistrict`,
        requestOptions
      );
      const result = await response.json();
      if (result?.status === 200) {
        getDistrictEntries();
        toastifySuccess(result.message || "Record deleted successfully");
      } else {
        toastifyError(
          result.message || "Something went wrong while deleting Record"
        );
      }
    } catch (error) {
      console.error(error);
      toastifyError(
        error?.res?.data?.message ||
        "Something went wrong while deleting Record"
      );
    }
  };

  useEffect(() => {
    getDistrictEntries();
  }, []);

  const getDistrictEntries = () => {
    const data = { type: "admin" };
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
        if (responseData?.status === 200) {
          setEntryDetail(responseData);
        } else {
          // Handle error response if needed
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toastifyError(error.response?.data?.message);
      });
  };

  const handleFormSubmit = async () => {
    try {
      const data = { name: newDistrict };
      if (!newDistrict.trim()) {
        toastifyError("Name is required");
        return;
      }

      const res = await fetch(`${config.url}/admin/createDistrict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAllLocatData()?.token}`,
        },
        body: JSON.stringify(data),
      });
      const resJson = await res.json();
      if (resJson.status === 200) {
        // Update districts in state after successful creation
        setEntryDetail((prevState) => ({
          ...prevState,
          districts: [...prevState?.districts, data],
        }));
        toastifySuccess("  Record saved successfully!");
        setOpen(true); // Show success snackbar
        setNewDistrict(""); // Clear input field
        // toastifySuccess("Register successfully!!")
      } else {
        // Handle error response if needed

        toastifyError(resJson?.message);
      }
    } catch (error) {
      console.error("Error:", error);
      //  console.log(error?.resJson, "first");

      toastifyError(error?.resJson?.message);
    }
  };

  const handleClose = () => {
    setOpen(false); // Close snackbar
  };

  const handleNewDistrictChange = (e) => {
    setNewDistrict(e.target.value);
  };


  return (
    <>
      <div className="col-xs-12 ">
        <div className="bg-gradient-info-second col-md-12 mt-3">
          <h3> Add District</h3>
          <div id="field">
            <div id="field0">
              <br />
              <div className="form-group">
                <label className="col-md-4 control-label" htmlFor="address">
                  District Name
                </label>
                <div className="col-md-5">
                  <input
                    id="district"
                    name="district"
                    placeholder="District Name"
                    type="text"
                    value={newDistrict}
                    onChange={handleNewDistrictChange}
                    className="form-control input-md"
                  />
                  <div className="form-group">
                    <div className="col-md-4">
                      <button
                        id="add-more"
                        name="add-more"
                        className="btn btn-primary mt-3"
                        onClick={show ? UpdateData : handleFormSubmit}
                      >
                        {show ? "UPDATE" : "ADD"}
                      </button>
                    </div>
                  </div>
                  <br />
                </div>
              </div>

              <br />
            </div>
          </div>
        </div>
      </div>
      <br />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0"> All District List </h3>
              </CardHeader>
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
                            style={{ border: "1px solid #000" }}
                          >
                            District
                          </TableCell>
                          <TableCell
                            scope="col"
                            style={{ border: "1px solid #000" }}
                          >
                            Status
                          </TableCell>
                          <TableCell
                            scope="col"
                            style={{ border: "1px solid #000" }}
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentItems?.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>
                              <Switch
                                checked={row.is_deleted == 0 ? true : false }
                                onChange={() => {
                                  setSelectedRowStatus({ id: row.id, is_deleted: !row.is_deleted, });
                                  handleDelete(row);
                                }}
                                name="loading"
                                color="primary"
                              />
                            </TableCell>

                            <TableCell>
                              <button
                                className="table-icon"
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
              {/* Pagination Component */}
              <div className="d-flex justify-content-end">
                <Pagination
                  className="my-3"
                  aria-label="Page navigation example"
                >
                  <PaginationItem disabled={currentPage <= 1}>
                    <PaginationLink
                      previous
                      onClick={() => handlePageChange(currentPage - 1)}
                    />
                  </PaginationItem>
                  {Array.from({
                    length: Math.ceil(entryDetail?.districts?.length / perPage),
                  }).map((_, index) => (
                    <PaginationItem
                      active={index + 1 === currentPage}
                      key={index}
                    >
                      <PaginationLink
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem
                    disabled={
                      currentPage >=
                      Math.ceil(entryDetail?.districts?.length / perPage)
                    }
                  >
                    <PaginationLink
                      next
                      onClick={() => handlePageChange(currentPage + 1)}
                    />
                  </PaginationItem>
                </Pagination>
              </div>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default District;
