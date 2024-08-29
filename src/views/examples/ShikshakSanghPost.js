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

import { Link } from "react-router-dom";
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
import { apiCall } from "api/interceptor";
import Spinner from "components/Utility/Spinner";
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

const ShikshakSanghPost = () => {
  const classes = useStyles();
  const [entryDetail, setEntryDetail] = useState({ data: [] });
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [newEntry, setNewEntry] = useState({ name: "" });

  const [selectedBlock, setSelectedBlock] = useState("");
  const [updatedData, setUpdatedData] = useState(null);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [blockList, setBlockList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [loading, setLoading] = useState(false);

  let postPerPage = rowPerPageInTable;
  const pageCount = Math.ceil(filteredData.length / postPerPage);
  let indexOfLastPost = currentPage * postPerPage;
  let indexOfFirstPost = indexOfLastPost - postPerPage;
  let currentItems = filteredData.slice(indexOfFirstPost, indexOfLastPost);


  const handlePageChange = (e, page) => {
    setCurrentPage(page);
  };
  const handleEdit = (row) => {
    setShow(true);

    // URL.createObjectURL(row.pdf)
    setSelectedPDF(row.pdf);
    setNewEntry({ name: row.name });
    setSelectedBlock(row.category_id);

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
      const formData = new FormData();

      formData.append("name", newEntry?.name);

      formData.append("attachment", selectedPDF);
      // Append selected PDF file
      formData.append("category_id", selectedBlock);
      formData.append("post_id", updatedData); // Append the post ID again (if needed)

      const res = await axios.post(
        `${config.url}/admin/update_shikshan_sangh_post`,
        formData,
        { headers }
      );
      setLoading(false);
      if (res.data.status === 200) {
        toastifySuccess(res.data.message || "Record updated successfully");
        setShow(false);
        setNewEntry({ name: "", pdf: null });
        setSelectedBlock("");
        setSelectedPDF(null);
        // setUpdatedData(null);
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
        table_name: "shikshan_sangh_posts",
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
  }, [selectedBlock]);

  useEffect(() => {
    getBlockEntries();
  }, []);

  const getBlockEntries = async () => {
    try {
      const params = { type: "admin" };
      const res = await apiCall(
        "/admin/getShikshakSanghCategory",
        "post",
        params
      );
      if (res?.status) {
        setBlockList(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPeeoEntries = () => {
    setLoading(true);

    fetch(`${config.url}/admin/getShikshanSanghPosts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${getAllLocatData()?.token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseData) => {
        setEntryDetail(responseData);
        setFilteredData(responseData?.data);
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
      const headers = {
        Authorization: `Bearer ${getAllLocatData()?.token}`,
      };
      const formData = new FormData();
      formData.append("name", newEntry.name);
      formData.append("attachment", selectedPDF); // Append selected PDF file
      formData.append("category_id", selectedBlock);

      const res = await fetch(
        `${config.url}/admin/create_shikshan_sangh_post`,
        {
          method: "POST",
          body: formData, // Use FormData instead of JSON.stringify(data)
        },
        { headers }
      );
      setLoading(false);
      const resJson = await res.json();
      if (resJson.status === 200) {
        // Update entryDetail in state after successful creation

        setEntryDetail((prevState) => ({
          ...prevState,
          data: [...prevState?.data, resJson.data], // Use response data instead of input data
        }));
        getPeeoEntries();
        toastifySuccess("Record saved successfully!");
        setOpen(true); // Show success snackbar

        setNewEntry({ name: "", pdf: null }); // Clear input fields
        setSelectedBlock("");
        setSelectedPDF(null);
      } else {
        setLoading(false);
        // Handle error response if needed
        toastifyError(resJson?.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleFileChange = (e) => {
    setSelectedPDF(e.target.files[0]);
  };

  const handleBlockChange = (e) => {
    setSelectedBlock(e.target.value);
  };

  const getBlockName = (row) => {
    const matcheBlock = blockList.find(
      (item) => item?.id.toString() === row?.category_id
    );
    // console.log(matcheBlock, "match");
    return matcheBlock?.name;
  };

  const handleFilterChange = (e) => {
    const selectedValue = e.target.value;
    if (!isNaN(parseInt(selectedValue))) {
      setSelectedId(selectedValue);

      // Filter the data based on the selected category ID
      if (selectedValue !== "") {
        const filtered = entryDetail.data.filter(
          (data) => parseInt(data.category_id) === parseInt(selectedValue)
        );

        setFilteredData(filtered);
      } else {
        // If no category is selected, reset the filtered data to display all posts
        setFilteredData(entryDetail.data);
      }
    } else {
      console.log("Invalid value:", selectedValue);
    }
  };

  const handleSelectChange = (event) => {
    const newValue = Number(event.target.value);
    const res = blockList.slice(0, newValue);
    setFilteredData(res);
  };
  return (
    <>
      <div className="header global-color pb-8  pt-5 pt-md-8">
        <div className="container-fluid"></div>
      </div>

      <div className="container-fluid mt--9">
        <div className="mt-7 mb-3 px-3 py-4 card card">
          <h3 className="mb-4">नई पोस्ट</h3>

          <div id="field">
            <div id="field0">
              <div className="row justify-content-end">
                <div className="col-md-3 mb-3">
                  <input
                    id=""
                    name="name"
                    placeholder=" नाम"
                    type="text"
                    value={newEntry.name}
                    onChange={handleChange}
                    className="form-control input-md"
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <div className="form-group">
                    {selectedPDF ? (
                      <input
                        id="name"
                        name="pdf"
                        placeholder="Upload pdf"
                        type="file"
                        accept=".pdf"
                        value={newEntry.pdf}
                        onChange={handleFileChange}
                        className="input-md"
                      />
                    ) : (
                      <input
                        id="namei"
                        name="pdfe"
                        placeholder="Upload pdf"
                        type="file"
                        value={""}
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="form-control"
                      />
                    )}
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="global_arrow">
                    <select
                      value={selectedBlock}
                      onChange={handleBlockChange}
                      name="selectedBlock"
                      className="selectDropdown form-control"
                    >
                      <option value=""> श्रेणी चुनना</option>
                      {blockList?.map((block, index) => (
                        <option value={block.id} key={index}>
                          {block.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-3 mb-3">
                  <div className="form-group">
                    {show && (
                      <button
                        className="border-0 cancel_btn mx-2"
                        onClick={() => {

                          setNewEntry({ name: "", pdf: null });
                          setSelectedBlock("");
                          setSelectedPDF(null);

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
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <Card className="">
          <Table className="align-items-center table-flush" responsive>
            <div className="p-0">
            <div className="col-md-3">
                  <h3 className="mb-0 mt-3">शिक्षक संघ पोस्ट सूची  </h3>
                </div>
              <Col className="row align-items-end justify-content-end p-3">
                
                
                <div className="col-md-3">
                  <select
                    value={selectedId}
                    onChange={handleFilterChange}
                    name="selectedId"
                    className="form-control"
                  >
                    <option value=""> फ़िल्टर श्रेणी </option>
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

              </Col>
            </div>
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
                        {" "}
                        नाम
                      </TableCell>

                      <TableCell
                        scope="col"

                      >
                        फ़ाइल
                      </TableCell>
                      <TableCell
                        scope="col"

                      >
                        वर्ग
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
                    {/* {entryDetail?.data?.map((row, i) => (
                         */}
                    {currentItems?.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell padding="none">{row?.name}</TableCell>

                        {/* <TableCell padding="none">{config.url}/{row?.pdf}</TableCell> */}

                        <TableCell padding="none">
                          <Link
                            to={`${config.url}/${row?.pdf}`}
                            target="_blank"
                          >
                            <i class="fa-solid fa-file-pdf" style={{ fontSize: "20px", color: "#9e9e9e" }}></i>
                          </Link>
                        </TableCell>

                        <TableCell padding="none">
                          {getBlockName(row)}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={row?.is_deleted}
                            onChange={() => handleDelete(row)}
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
          <div className="d-flex justify-content-center mt-3">

            <Pagination
              count={pageCount}
              variant="outlined"
              color="primary"
              onChange={handlePageChange}
            />

          </div>
        </Card>


      </div>
      <Spinner sppiner={loading} />
    </>
  );
};

export default ShikshakSanghPost;
