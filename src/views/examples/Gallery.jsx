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
    border: "2px solid #ccc", // Set border color here
    borderCollapse: "collapse",
  },
  snackbar: {
    bottom: "104px",
  },
});

const Gallery = () => {
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
  const [value, setValue] = useState({
    name: "",
    category_id: "",
    subcategory_id: "",
    name: "",
    attachment: [],
  });
  const [imgPreview, setImgPreview] = useState({
    images: [],
  });
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    let role = getAllLocatData();
    setUserRole(role);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (updData?.id) {
      setValue({
        ...value,
        name: updData?.name,
        category_id: updData?.category_id,
        subcategory_id: updData?.subcategory_id,
        id: updData?.id,
        attachment: updData?.image.split(","),
      });
      const imageArray = updData.image
        .split(",")
        .map((image) => apiBaseURL() + "/" + image);
      setImgPreview({ ...imgPreview, images: imageArray });
    } else {
      setValue({
        ...value,
        name: "",
        attachment: [],
        category_id: "",
        subcategory_id: "",
      });
    }
  }, [updData]);
  const handleChange = (e) => {
    if (e.target.name === "attachment") {
      const files = Array.from(e.target.files);
  
      const validFiles = files.filter((file) => file.size <= imageSize * 1024); // 600KB = 600 * 1024 bytes
  
      if (validFiles.length < files.length) {
        toastifyError(`Some files are too large (over ${imageSize}KB) and were not uploaded.`)
        return false
      }
  
      setValue({ ...value, attachment: [...value.attachment, ...validFiles] });
  
      const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
      setImgPreview({
        ...imgPreview,
        images: [...imgPreview.images, ...imageUrls],
      });
    } else {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  };
  
  const [removed, setRemoved] = useState([]);
  const handleRemoveImage = (index) => {
    const previewImages = imgPreview.images.filter(
      (imageUrl, i) => i !== index
    );
    setImgPreview({ ...imgPreview, images: previewImages });

    const valueImages = value.attachment.filter((imageUrl, i) => i !== index);
    setValue({
      ...value,
      attachment: valueImages,
    });

    const removedImageUrl = imgPreview.images[index];
    const cleanedUrl = removedImageUrl.substring(
      "https://rss.itworkshop.in/".length
    );
    setRemoved([...removed, cleanedUrl]);
  };
  const stringFromArray = removed.join(", ");
  const handleSubmit = async () => {
    try {
      if (value.name == "") {
        toastifyError("Name field is required !!");
        return false;
      }
      if (value.attachment.length == 0) {
        toastifyError("Attachment field is required !!");
        return false;
      }
      if (value.category_id == "") {
        toastifyError("Category field is required !!");
        return false;
      }
      if (value.subcategory_id == "") {
        toastifyError("Sub Category field is required !!");
        return false;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("category_id", value.category_id);
      formData.append("post_id", value.id);
      formData.append("subcategory_id", value.subcategory_id);
      formData.append("name", value.name);
      formData.append("publish_by", userRole?.role);
      formData.append("publisher_id",userRole?.user_id);
      formData.append("removed_images", stringFromArray);
      value?.attachment?.forEach((file, index) => {
        formData.append(`attachments`, file);
      });
      const apiEnd = updData ? "update_gallery_post" : "create_gallery_post";
      const res = await apiCall(`/admin/${apiEnd}`, "post", formData);
      if (res?.status) {
        setLoading(false);
        toastifySuccess(res.message);
        setUpdData(null);
        setImgPreview(null);
        getListFun();
        setRemoved([])
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
    getSubCategoryList();
    getCategoryList();
  }, []);

  const getSubCategoryList = async () => {
    try {
      const res = await apiCall("/admin/getGallerySubCategories");
      if (res?.status) {
        setSubCategoryList(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getCategoryList = async () => {
    try {
      const params = { type: "admin" };
      const res = await apiCall("/admin/getGalleryCategories", "post", params);
      if (res?.status) {
        setCategoryList(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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


      const res = await apiCall("/admin/getGalleryPosts", "post", data);
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
        table_name: "gallery_posts",
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
          <h3 className="mb-4">चित्र प्रदर्शनी</h3>
          <div className="row">
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
              {value.attachment.length ? (
                <input
                  name="attachment"
                  type="file"
                  multiple
                  onChange={handleChange}
                  className="form-control input-md"
                />
              ) : (
                <input
                  name="attachment"
                  type="file"
                  value={""}
                  multiple
                  onChange={handleChange}
                  className="form-control input-md"
                />
              )}

            </div>
            <div className="col-sm-3 mb-3">
              <select
                name="category_id"
                value={value.category_id}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">सेलेक्ट केटेगरी</option>
                {categoryList?.map((item, i) => (
                  <option value={item.id} key={i}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-sm-3 mb-3">
              <select
                name="subcategory_id"
                value={value.subcategory_id}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">सेलेक्ट सब केटेगरी</option>
                {categorySubList?.map((item, i) => (
                  <option value={item.id} key={i}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-12 mt-3">
              <div class="preview_upload galley mt-2">
                {imgPreview?.images?.map((imageUrl, index) => (
                  <div key={index} className="added_image mb-2">
                    <img
                      src={imageUrl}
                      alt="img"
                      style={{ width: "70px", height: "70px" }}
                    />
                    <button className="border-0 bg-white" onClick={() => handleRemoveImage(index)}>
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-sm-12 mt-3" style={{ textAlign: "end" }}>
              {updData && (
                <button
                  className="cancel_btn border-0 mx-2"
                  onClick={() => {
                    setUpdData(null);
                    setImgPreview(null);
                  }}
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
      </div>


      <div className="box">
        <div className="container-fluid">
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
          <Row>
            <div className="col">
              <Card className="">
                {/* <CardHeader className="border-0">
                                    <h3 className="mb-0"> चित्र प्रदर्शनी </h3>
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
                              नाम{" "}
                            </TableCell>
                            <TableCell
                              scope="col"

                            >
                              केटेगरी{" "}
                            </TableCell>
                            <TableCell
                              scope="col"

                            >
                              सब केटेगरी
                            </TableCell>
                            <TableCell
                              scope="col"

                            >
                              पीडीऍफ़ (PDF)
                            </TableCell>
                            <TableCell
                              scope="col"

                            >
                              स्टेटस
                            </TableCell>
                            <TableCell
                              scope="col"

                            >
                              एक्शन{" "}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {currentItems?.map((row, i) => (
                            <TableRow key={i}>
                              <TableCell>{row.name}</TableCell>
                              <TableCell>{row.category_name}</TableCell>
                              <TableCell>{row.subcategory_name}</TableCell>
                              <TableCell>
                                {row?.image.split(",").slice(0, 3).map((item, i) => (
                                  <Link
                                    to={apiBaseURL() + "/" + item}
                                    target="_blank"
                                    key={i}
                                    className="text-danger mx-1"
                                  >
                                    <img
                                      src={apiBaseURL() + "/" + item}
                                      alt="img"
                                      style={{
                                        height: "50px",
                                        width: "50px",
                                        borderRadius: "100%",
                                      }}
                                    />
                                  </Link>
                                ))}
                                {row?.image.split(",").length > 3 && (
                                  <span className="more-images">+ {row?.image.split(",").length - 3} more</span>
                                )}
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

export default Gallery;
