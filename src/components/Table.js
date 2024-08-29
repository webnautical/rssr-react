//MyTable.js

import React, { useState, useLayoutEffect } from "react";
import CreateIcon from "@material-ui/icons/Create";
import {
  Box,
  Button,
  Snackbar,
  Table,
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
import config from "config";
import { getAllLocatData } from "./Utility/Utility";
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
function MyTable() {
  // Creating style object
  const classes = useStyles();

  // Defining a state named rows
  // which we can update by calling on setRows function
  const [rows, setRows] = useState([
    { id: 1, name: "", email: "", official_position: "" },
  ]);

  // Initial states
  const [open, setOpen] = useState(false);
  const [entryDetail, setEntryDetail] = useState([]);
  console.log(entryDetail, "edd");
  const [disable, setDisable] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  useLayoutEffect(() => {
    getContactEntries();
  }, []);
  const getContactEntries = (data) => {
    // console.log(data, 'formdata');
    fetch(`${config.url}/admin/getContactEntries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAllLocatData()?.token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log(response, "contact");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseData) => {
        console.log("Success:", responseData);
        if (
          responseData.message === "All contact us entries retrived sucessfully"
        ) {
          setEntryDetail(responseData.contactUsEntries[0]);
          //   reset();
          responseData.contactUsEntries[0] = data;
        } else {
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  // Function For closing the alert snackbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // Function For adding new row object
  const handleAdd = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1,
        name: "",
        email: "",
        official_position: "",
      },
    ]);
  };

  const handleInputChange = (e, index) => {
    setDisable(false);
    const { name, value } = e.target;
    const list = [...rows];
    list[index][name] = value;
    setRows(list);
  };

  // Showing delete confirmation to users
  const handleConfirm = () => {
    setShowConfirm(true);
  };

  // Handle the case of delete confirmation where
  // user click yes delete a specific row of id:i
  const handleRemoveClick = (i) => {
    const list = [...rows];
    list.splice(i, 1);
    setRows(list);
    setShowConfirm(false);
  };

  // Handle the case of delete confirmation
  // where user click no
  const handleNo = () => {
    setShowConfirm(false);
  };

  return (
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
        <TableRow align="center"></TableRow>

        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  width: "150px",
                }}
              >
                Name
              </TableCell>

              <TableCell style={{ border: "1px solid #000" }}>Phone</TableCell>
              <TableCell style={{ border: "1px solid #000" }}>
                Official Position
              </TableCell>
              <TableCell style={{ border: "1px solid #000" }}>
                <Button onClick={handleAdd}>
                  <AddBoxIcon onClick={handleAdd} />
                  ADD
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => {
              return (
                <div>
                  <TableRow>
                    <div>
                      <TableCell padding="none">
                        <input
                          value={row.name}
                          name="name"
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </TableCell>
                      <TableCell padding="none">
                        <input
                          value={row.email}
                          name="email"
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </TableCell>
                      <TableCell padding="none">
                        <input
                          value={row.official_position}
                          name="official_position"
                          onChange={(e) => handleInputChange(e, i)}
                        />
                      </TableCell>
                      <Button className="mr10" onClick={handleConfirm}>
                        <ClearIcon />
                      </Button>
                    </div>

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
                              onClick={() => handleRemoveClick(i)}
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
                </div>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </TableBody>
  );
}

export default MyTable;
