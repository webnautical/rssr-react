import React, { useState, useLayoutEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "assets/css/index.css";
import config from "config";
import "assets/css/argon-dashboard-react.css";

import { Button, Container, Row, Col } from "reactstrap";
import {
  toastifySuccess,
  toastifyError,
  getAllLocatData,
} from "components/Utility/Utility";
const AboutUs = () => {
  const [aboutUsData, setAboutUsData] = useState({});
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    getAboutUsData();
  }, []);
  const getAboutUsData = () => {
    fetch(`https://rss.itworkshop.in/admin/getAboutUs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${getAllLocatData()?.token}`,
      },
    })
      .then((response) => {
        // console.log(response, 'getAboutUsResponse');
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseData) => {
        //console.log('Success:', responseData);
        if (responseData.status === 200) {
          setAboutUsData(responseData.aboutUsContent);
        } else {
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleFormSubmit = async () => {
    setLoading(true);

    try {
      const data = { ...aboutUsData };
     
      let res = await fetch(`${config.url}/admin/updateAboutUs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${getAllLocatData()?.token}`,
        },
        body: JSON.stringify(data),
      });
      let resJson = await res.json();
     

      if (resJson.status === 200) {
        toastifySuccess(resJson.message || "Updated Successfuly!!");
        resJson.aboutUsContent.content = data;
        setLoading(false);
      } else {
        setLoading(false);
        toastifyError(resJson.message || "Failed to Update!!");
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="header global-color pb-8  pt-5 pt-md-8">
        <div className="container-fluid"></div>
      </div>

      <div className="container-fluid mt--9">
        <div className=" mt-7  mb-3 px-3 py-4 card card">
          <h2>हमारे बारे में</h2>
        </div>
      </div>

      <div className="container-fluid">
        <div className=" row justify-content-center">
          <div className="col-md-12 ">
            <div className="  card p-5">
              <div className="ck.ck-editor__main ">
                <CKEditor
                  editor={ClassicEditor}
                  data={aboutUsData?.content}
                  //data="<p>Hello from CKEditor&nbsp;5!</p>"
                  onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    //  console.log( 'Editor is ready to use!', editor );
                  }}
                  onChange={(event, editor) => {
                    const content = editor.getData();

                    setAboutUsData((prevState) => ({
                      ...prevState,
                      content,
                    }));
                  }}
                  // onBlur={(event, editor) => {
                  //   console.log("Blur.", editor);
                  // }}
                  // onFocus={(event, editor) => {
                  //   console.log("Focus.", editor);
                  // }}
                />
              </div>

              <div className="mt-5" style={{ textAlign: "end" }}>
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
                    Submit
                  </button>
                )}
                {/* <Button onClick={handleFormSubmit}>Submit</Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
