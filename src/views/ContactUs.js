import React, { useState, useLayoutEffect } from "react";
import CreateIcon from "@material-ui/icons/Create";
import {
  Box,
  Button,
  Snackbar,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import "assets/css/argon-dashboard-react.css";
import config from "config";
import {
  toastifySuccess,
  toastifyError,
  getAllLocatData,
} from "components/Utility/Utility";
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
const ContactUs = () => {
  const classes = useStyles();
  const [rows, setRows] = useState([
    { id: 1, name: "", email: "", official_position: "" },
  ]);
  // Initial states
  const [open, setOpen] = useState(false);
  const [entryDetail, setEntryDetail] = useState({});
  const [loading, setLoading] = useState(false);
 
  const [disable, setDisable] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useLayoutEffect(() => {
    getContactEntries();
  }, []);
  const getContactEntries = () => {
    // console.log(data, 'formdata');
    fetch(`${config.url}/admin/getContactEntries`, {
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
      
        if (responseData.status === 200) {
          setEntryDetail(responseData.contactUsEntry);
          //   reset();
          // responseData.contactUsEntries[0] = data;
        } else {
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  //api for update form data
  const handleFormSubmit = async () => {
    setLoading(true);

    try {
      const data = { ...entryDetail };

      let res = await fetch(`${config.url}/admin/contactUs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAllLocatData()?.token}`,
        },
        body: JSON.stringify(data),
      });
      let resJson = await res.json();
     

      if (resJson.message === "Contact page details updated successfully") {
        toastifySuccess(resJson.message || "Updated Successfuly!!");
        resJson.contactUsEntry = data;
        setLoading(false);

        //  navigate('/success');
        // window.location.reload();
        // setFormData();
      } else {
        setLoading(false);
        toastifyError(resJson.message || "Failed to Update!!");
      }
    } catch (error) {
      setLoading(false);
    }
  };
  // Function For closing the alert snackbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // Function For adding new entryDetail object
  const handleAdd = () => {
    const newMember = {
      id: rows.length + 1,
      name: "",
      phone: "",
      official_position: "",
    };
    setEntryDetail((prevState) => ({
      ...prevState,
      member_details: [...prevState.member_details, newMember],
    }));
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...entryDetail.member_details]; // Create a copy of member_details array
    list[index][name] = value; // Update the specific property in the copied array
    const updatedEntryDetail = { ...entryDetail, member_details: list }; // Update member_details in the entryDetail object
    setEntryDetail(updatedEntryDetail); // Update the state with the modified entryDetail
  };

  const handleformInputChange = (e) => {
    const { name, value } = e.target;
    setEntryDetail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Showing delete confirmation to users
  const handleConfirm = () => {
    setShowConfirm(true);
  };

  // Handle the case of delete confirmation where
  // user click yes delete a specific row of id:i

  const handleRemoveRow = (index) => {
    const updatedMemberDetails = entryDetail.member_details.filter(
      (_, i) => i !== index
    );
    setEntryDetail((prevState) => ({
      ...prevState,
      member_details: updatedMemberDetails,
    }));
  };

  const handleNo = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <div className="header global-color pb-8  pt-5 pt-md-8">
        <div className="container-fluid"></div>
      </div>

      <div className="container-fluid mt--9">
        <div className="mt-7  mb-3 px-3 py-4 card card">
          <h3> हमसे संपर्क करें विवरण</h3>
          <div id="field mt-4">
            <div id="field0">
              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="control-label" htmlFor="email">
                      <i className="ni ni-email-83 mr-1"></i>
                      ईमेल
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={entryDetail.email}
                      onChange={handleformInputChange}
                      placeholder=""
                      className="form-control input-md"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="control-label" htmlFor="phone">
                      <i className="ni ni-tablet-button mr-1"></i>
                      फ़ोन
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder=""
                      value={entryDetail.phone}
                      onChange={handleformInputChange}
                      className="form-control input-md"
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="control-label" htmlFor="address">
                      <i className="ni ni-square-pin mr-1"></i>
                       पता
                    </label>
                    <div>
                      <textarea
                        id="address"
                        name="address"
                        placeholder=""
                        onChange={handleformInputChange}
                        value={entryDetail.address}
                        className="form-control input-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Container className="mt--12" fluid>
        <Row>
          <div className="col">
            <Card className="">
              <div className="border-0 row p-3">
        <div className="col-md-6">
        <h3 className="mb-0"> सदस्यों की सूची </h3>
        </div>
              <div className="col-md-6" style={{ textAlign:"end"}}>
              <Button className="add_btn" onClick={handleAdd}>
              <i class="fa-solid fa-plus me-4s"></i>
                      Add New
                    </Button>
              </div>
              </div>
              <Table className="align-items-center table-flush" responsive>
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
                  <Box margin={1} className="cs_table">
              

                    <Table
                      className={classes.table }
                      size="small"
                      aria-label="a dense table"
                    >
                      <TableHead className="thead-light ">
                        <TableRow>
                          <TableCell
                            scope="col"
                     
                          >
                             नाम
                          </TableCell>
                          <TableCell
                            scope="col"
                     
                          >
                            फ़ोन 
                          </TableCell>
                          <TableCell
                            scope="col"
                     
                          >
                            आधिकारिक स्थिति
                          </TableCell>
                          <TableCell
                            scope="col"
                     
                          >
                            एक्शन
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* {rows.map((row, i) => { */}
                        {entryDetail &&
                          entryDetail.member_details &&
                          entryDetail.member_details.map((row, i) => {
                            return (
                              <TableRow>
                                <TableCell padding="none" className="p-2">
                                  <input
                                    value={row.name}
                                    name="name"
                                    onChange={(e) => handleInputChange(e, i)}
                                  />
                                </TableCell>
                                <TableCell padding="none" className="p-2" >
                                  <input
                                    value={row.phone}
                                    name="phone"
                                    onChange={(e) => handleInputChange(e, i)}
                                  />
                                </TableCell>
                                <TableCell padding="none" className="p-2">
                                  <input
                                    value={row.official_position}
                                    name="official_position"
                                    onChange={(e) => handleInputChange(e, i)}
                                  />
                                </TableCell>
                                <TableCell padding="none" className="p-2">
                                  <Button className="text-danger p-2" onClick={() => handleRemoveRow(i)}>
                                  <i class="fa-solid fa-trash"></i>
                                  </Button>
                                </TableCell>

                                {showConfirm && (
                                  <div>
                                    <Dialog
                                      open={showConfirm}
                                      onClose={handleNo}
                                      aria-labelledby="alert-dialog-title"
                                      aria-describedby="alert-dialog-description"
                                    >
                                      <DialogTitle id="alert-dialog-title">
                                        {"Confirm Delete"}
                                      </DialogTitle>
                                      <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                          Are you sure to delete
                                        </DialogContentText>
                                      </DialogContent>
                                      <DialogActions>
                                        <Button
                                          onClick={() => handleRemoveRow(i)}
                                          color="primary"
                                          autoFocus
                                        >
                                          Yes
                                        </Button>
                                        <Button
                                          onClick={handleNo}
                                          color="primary"
                                          autoFocus
                                        >
                                          No
                                        </Button>
                                      </DialogActions>
                                    </Dialog>
                                  </div>
                                )}
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  
                  </Box>
                </TableBody>
                {/* Button */}
                <div className="form-group">
                  <div className="p-3 text-end" style={{ textAlign:"end"}}>
                    {loading ? (
                      <>
                        <button
                          id="add-more"
                          name="add-more"
                          className="btn btn-primary"
                        >
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>{" "}
                          Loading...
                        </button>
                      </>
                    ) : (
                      <button
                        id="add-more"
                        name="add-more"
                        className="global_btn"
                        onClick={handleFormSubmit}
                      >
                        Update
                      </button>
                    )}
                  </div>
                </div>
                <br />
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default ContactUs;
