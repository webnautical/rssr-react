import { Box, TableCell, TableHead, TableRow } from '@material-ui/core';
import Spinner from 'components/Utility/Spinner'
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
// import { Table } from 'reactstrap';
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';
import config from 'config';
import { getAllLocatData } from 'components/Utility/Utility';
import { FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";

import { Button, Col, Row, Table } from "react-bootstrap";
import {
    DatatableWrapper,
    Filter,
    Pagination,
    PaginationOptions,
    TableBody,
    TableColumnType,
    TableHeader
} from "react-bs-datatable";
import { toastifySuccess } from 'components/Utility/Utility';
import { toastifyError } from 'components/Utility/Utility';
import { rowPerPageInTable } from 'components/Utility/Utility';



;
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
const UserList = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [district, setDistrict] = useState([]);
    const [currentDistrict, setCurrentDistrict] = useState([]);
    const [permanentDistrict, setPermanentDistrict] = useState([]);
    const [blockList, setBlockList] = useState([]);
    const [peeoList, setPeeoList] = useState([]);
    const [sambhagList, setShambhagList] = useState([]);
    const [workAreaList, setWorkAreaList] = useState([]);
    const [upshakha, setUpshakha] = useState([]);
    const [sankul, setSankul] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredList, setfilteredList] = useState([]);
    const [membershipStatus, setMembershipStatus] = useState(1);
const [userRole,setUserRole]=useState("")
    const STORY_HEADERS_BASE  = [
        {
            prop: "name",
            title: "नाम",
            isFilterable: true,

        },
        {
            prop: "father_name",
            title: "पिता का नाम"
        },
        {
            prop: "dob",
            title: "जन्म तिथि"
        },
        {
            prop: "gender",
            title: "लिंग"
        },
        {
            prop: "caste",
            title: "जाति"
        },
        {
            prop: "religion",
            title: " धर्म"
        },
        {
            prop: "marital_status",
            title: "वैवाहिक स्थिति"
        },
        {
            prop: "phone",
            title: "फ़ोन"
        },
        {
            prop: "whatsapp_no",
            title: "व्हाट्सएप नंबर"
        },
        {
            prop: "email",
            title: "ईमेल"
        },
        {
            prop: "blood_group",
            title: "ब्लड ग्रुप"
        },

        // SECTION - B
        {
            prop: "permanent_district_name",
            title: "स्थायी जिले का नाम"
        },
        {
            prop: "current_tehsil_name",
            title: "वर्तमान तहसील का नाम"
        },
        {
            prop: "permanent_address",
            title: "स्थायी पता"
        },
        // SECTION - C
       
        {
            prop: "school_name",
            title: "स्कूल के नाम"
        },
        {
            prop: "school_level",
            title: "स्कुल स्त"
        },
        {
            prop: "education",
            title: " शिक्षा"
        },
        {
            prop: "other education",
            title: "अन्य शिक्षा"
        },
        {
            prop: "retirement_date",
            title: "सेवानिवृत्ति की तारीख"
        },
        {
            prop: "last_post",
            title: "पिछला पोस्ट"
        },
        {
            prop: "school_office_name",
            title: "विद्यालय कार्यालय का नाम"
        },
        {
            prop: "workarea_district_name",
            title: "कार्यक्षेत्र जिले का नाम"
        },
        {
            prop: "workarea_upshakha_name",
            title: "कार्यक्षेत्र उपशाखा का नाम"
        },
        {
            prop: "current_address",
            title: "वर्त्तमान पता"
        },
        {
            prop: "initiation_date",
            title: " दीक्षा तिथि"
        },

        //SECTION - D
        {
            prop: "sangathan_name",
            title: "संगठन नाम"
        },
        {
            prop: "current_district_name",
            title: "वर्तमान जिला"

        },
        {
            prop: "workarea_sambhag_name",
            title: "समभाग नाम"
        },
        
        {
            prop: "workarea_sankul_name",
            title: "संकुल नाम"
        },

        //SECTION - E
        {
            prop: "current_position",
            title: "वर्तमान पद"
        },
        
        {
            prop: "current_duty",
            title: "वर्तमान कर्तव्य"
        },
        {
            prop: "current_duty_level",
            title: "वर्तमान कर्तव्य स्तर"
        },
        
        {
            prop: "current_duty_start_year",
            title: "वर्तमान कर्तव्य आरंभ वर्ष"
        },
        {
            prop: "past_duty_start_year",
            title: "पिछला कर्तव्य आरंभ वर्ष"
        },
        {
            prop: "past_duty_end_year",
            title: "पिछला कर्तव्य अंतिम वर्ष"
        },
        {
            prop: "other_organization",
            title: "अन्य संगठन"
        },
        {
            prop: "other_duty",
            title: "अन्य कर्तव्य"
        },
        {
            prop: "other_duty_level",
            title: "अन्य कर्तव्य स्तर"
        },
        {
            prop: "current_tehsil_name",
            title: "वर्तमान तहसील का नाम"
        },
        {
            prop: "current_district_name",
            title: "वर्तमान जिले का नाम"
        },
        {
            prop: "permanent_tehsil_name",
            title: "स्थाई तहसील का नाम"
        },
        {
            prop: "permanent_district_name",
            title: "स्थायी जिले का नाम"
        },
        {
            prop: "peeo_name",
            title: "पियो का नाम"
        },
        {
            prop: "block_name",
            title: "ब्लॉक का नाम"
        },
        {
            prop: "jila_name",
            title: "जिला नाम",
            isFilterable: true

        },
        {
            prop: "current_duty_name",
            title: "वर्तमान कर्तव्य का नाम"
        },
        {
            prop: "current_duty_level_name",
            title: "वर्तमान कर्तव्य स्तर नाम"
        },
        
        {
            prop: "past_duty_name",
            title: "पिछले कर्तव्य का नाम"
        },
        {
            prop: "past_duty_level_name",
            title: "पिछले कर्तव्य स्तर का नाम"
        },
        {
            prop: "other_duty_level_name",
            title: "अन्य कर्तव्य स्तर का नाम"
        },
        
    ];
    const STORY_HEADERS_UPSHAKHA =
    [{
        prop: "button",
        cell: (row) => (
            <>
                <div className="">

                    <select name="status" id="status" className='' value={row?.membership_status} onChange={(e) => { handleMembershipStatus({id:row?.id,status:e.target.value});
               
                }}>
                        <option value="" >Membership status</option>
                        <option value="Pending" selected>Pending</option>
                        <option value="Approve">Approve</option>
                        <option value="Disable">Disable</option>
                    </select>
                </div>
            </>
        ),
        title: "सदस्यता की स्थिति"
    }]
    const getHeadersBasedOnRole = () => {
        if (userRole === "upshakha") {
            return [...STORY_HEADERS_BASE, ...STORY_HEADERS_UPSHAKHA];
        } else {
            return STORY_HEADERS_BASE;
        }
    };
    
    const STORY_HEADERS = getHeadersBasedOnRole();
    const [filters, setFilters] = useState({
        filter1: "",
        filter2: "",
        filter3: "",
        filter4: "",
        filter5: "",
        filter6: "",
        filter7: "",
        filter8: "",
        filter9: "",
    })

    useEffect(() => {
       
        // console.log("token", token)
        getUserDetails();
        const data = getAllLocatData()?.role;
        setUserRole(data)
    }, [membershipStatus])
    // district 
    useEffect(() => {
        // Fetch districts here to populate dropdown
        getDistrictEntries();
        sankulApi();
        upshakhaApi();
        workareaDistrictApi();
        sambhagListApi();
        peeoListApi();
        blockListApi();
        jilla();
        currentAndPermanentDistrict();
    }, []);

    const getDistrictEntries = () => {
        setLoading(true);
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
                setDistrictList(responseData?.districts);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setLoading(false);
            });
    };
    //   district end
    // all apis
    const headers = {
        Authorization: `Bearer ${getAllLocatData()?.token}`,
    };
    const currentAndPermanentDistrict = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${config.url}/admin/getAllDistrict`, { district_type: "PERSONAL" }, { headers })
            setPermanentDistrict(data?.districts);
            setCurrentDistrict(data?.districts);
        } catch (error) {
            console.log(error)
        }
    }
    const jilla = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${config.url}/admin/getAllDistrict`, { district_type: "OFFICIAL" }, { headers });
            setDistrict(data?.districts);

        } catch (error) {
            console.log(error)
        }
    }
    const blockListApi = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${config.url}/admin/getAllBlock`, { headers });
            setBlockList(data?.blocks)
        } catch (error) {
            console.log(error)
        }
    }
    const peeoListApi = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${config.url}/admin/getAllPeeo`, { headers });
            setPeeoList(data?.Peeos);
        } catch (error) {
            console.log(error)
        }
    }
    const sambhagListApi = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${config.url}/admin/getSambhag`, { headers });
            setShambhagList(data?.data)
        } catch (error) {
            console.log(error)
        }
    }
    const workareaDistrictApi = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${config.url}/admin/getAllDistrict`, { district_type: "ORGANIZATIONAL" }, { headers });
            setWorkAreaList(data?.districts);
        } catch (error) {
            console.log(error)
        }
    }
    const upshakhaApi = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${config.url}/admin/getUpshakha`, { headers });
            setUpshakha(data?.data)
        } catch (error) {
            console.log(error)
        }
    }
    const sankulApi = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${config.url}/admin/getSankul`, { headers });
            setSankul(data?.data)
        } catch (error) {
            console.log(error)
        }
    }
    // get all users list
    const getUserDetails = async () => {
        try {
            setLoading(true)
            const token = await getAllLocatData()?.token;
            // console.log("token", token)
            const { data } = await axios.get(`${config.url}/admin/allUsers`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            if (data.status == 200) {
                let newdata = data?.users?.map((item, i) => {
                    let name = item?.first_name + " " + item?.medium_name + " " + item?.last_name

                    return { ...item, name: name }
                })
                setUserList(newdata);
                setfilteredList(newdata);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }
    // filter by district 
    
    const [filterMap,setFilterMap]=useState([])
   
    const pushFilter=(filterObj)=>{
        const { filter, id } = filterObj;
       if(!filterMap.includes(filter)){
           filterMap.push(filter,id);
       }
       else if(id!=""){
        const findid=filterMap.indexOf(filter);
        filterMap.splice(findid+1,1,id);
       }
       else{
        const findid=filterMap.indexOf(filter);
        filterMap.splice(findid,2);
       }
    }
    
   
    const finalFilteredData=()=>{
        
        const filteredData = userList?.filter(user => {
            for (let i = 0; i < filterMap.length; i += 2) {
                const key = filterMap[i];
                const value = filterMap[i + 1];
                if (user[key] !== value) {
                    return false;
                }
            }
            return true;
        });
        setfilteredList(filteredData);
    }
    

    if (userList?.length > 0) {
        let newdata = userList?.map((item, i) => {
            let name = item?.first_name + " " + item?.medium_name + " " + item?.last_name

            return { ...item, name: name }
        })
        // console.log("newdata", newdata)
    }
    const ressetFilters = () => {
        setFilterMap([]);
        setfilteredList([...userList]);
        setFilters({
            filter1: "",
            filter2: "",
            filter3: "",
            filter4: "",
            filter5: "",
            filter6: "",
            filter7: "",
            filter8: "",
            filter9: "",
        })
    }
    // membership status
    const handleMembershipStatus =async (ide) => {

        try {

            const {data}=await axios.post(`${config.url}/user/updateMembershipStatus`,ide)
            
            setMembershipStatus(membershipStatus+1);
            if(data.status==200){
                toastifySuccess(data.message || "Updated Successfuly!!");
            }
        } catch (error) {
            toastifyError(error.message || "Failed to Update!!");
            console.log(error);
        }
    }
  
    return (
        <>
            <div className="header global-color pb-8  pt-5 pt-md-8" >
                <div className="container-fluid"></div>
            </div>
            <div className="container-fluid mt--9"    >
                <div className="data_cs mt-7 mb-3 px-3 py-4 card card" style={{ marginTop: "50px" }}>
                    <h2>उपयोगकर्ता सूची</h2>
                </div>
            </div>
            <div className="box">
                <div className="container-fluid">
                    <Card className="data_cs mt-2 mb-3 px-3 py-4">
                        <Row>
                            <Col md={3}>
                                {/* sambhag list */}
                                <div className="">
                                    <select
                                        value={filters.filter6}
                                        onChange={(e) => { 
                                            pushFilter({ filter: "workarea_sambhag_name", id: e.target.value}); 
                                            setFilters({ ...filters, filter6: e.target.value }) }}
                                        name="workarea_sambhag"
                                        className="selectDropdown form-control form-select mt-2 mx-2"
                                    >
                                        <option value=""> संभाग सूची</option>
                                        {sambhagList?.map((district, index) => (
                                            <option value={district.name} key={index}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Col>
                            <Col md={3}>
                                {/* current district */}
                                <div className="">
                                    <select
                                        value={filters.filter1}
                                        onChange={(e) => { 
                                            
                                            pushFilter({ filter: "current_district_name", id: e.target.value }); 
                                        setFilters({ ...filters, filter1: e.target.value }) }}
                                        name="current_district"
                                        className="selectDropdown form-control form-select mt-2 mx-2"
                                    >
                                        <option value="">व्यक्तिगत जिला </option>
                                        {currentDistrict?.map((district, index) => (
                                            <option value={district.name} key={index}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Col>
                            <Col md={3}>
                                {/* work area district */}
                                <div className="">
                                    <select
                                        value={filters.filter7}
                                        onChange={(e) => { 
                                            pushFilter({ filter: "workarea_district_name", id: e.target.value });
                                             setFilters({ ...filters, filter7: e.target.value }) }}
                                        name="workarea_district"
                                        className="selectDropdown form-control form-select mt-2 mx-2"
                                    >
                                        <option value=""> सरकारी  जिला</option>
                                        {workAreaList?.map((district, index) => (
                                            <option value={district.name} key={index}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Col>
                            {/* <Col>
                                <div className="">
                                    <select
                                        value={filters.filter2}
                                        onChange={(e) => { 
                                            pushFilter({ filter: "permanent_district_name", id: e.target.value }); 
                                           
                                            setFilters({ ...filters, filter2: e.target.value }) }}
                                        name="permanent_district"
                                        className="selectDropdown form-control form-select mt-2 mx-2"
                                    >
                                        <option value=""> स्थायी जिला </option>
                                        {permanentDistrict?.map((district, index) => (
                                            <option value={district.name} key={index}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                            </Col> */}
                            <Col md={3}>
                                {/* District  */}
                                <div className="">
                                    <select
                                        value={filters.filter3}
                                        onChange={(e) => { 
                                            pushFilter({ filter: "jila_name", id: e.target.value});
                                             setFilters({ ...filters, filter3: e.target.value }) }}
                                        name="jila"
                                        className="selectDropdown form-control form-select mt-2 mx-2"
                                    >
                                        <option value="">संगठन जिला </option>
                                        {district?.map((district, index) => (
                                            <option value={district.name} key={index}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Col>
                            <Col md={3}>
                                {/* block list */}
                                <div className="">
                                    <select
                                        value={filters.filter4}
                                        onChange={(e) => { 
                                            pushFilter({ filter: "block_name", id: e.target.value }); 
                                            setFilters({ ...filters, filter4: e.target.value }) }}
                                        name="block"
                                        className="selectDropdown form-control form-select mt-2 mx-2"
                                    >
                                        <option value=""> ब्लॉक सूची </option>
                                        {blockList?.map((district, index) => (
                                            <option value={district.name} key={index}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Col>
                            <Col md={3}>
                                {/* peeo list */}
                                <div className="">
                                    <select
                                        value={filters.filter5}
                                        onChange={(e) => { 
                                            pushFilter({ filter: "peeo_name", id: e.target.value});
                                             setFilters({ ...filters, filter5: e.target.value }) }}
                                        name="peeo"
                                        className="selectDropdown form-control form-select mt-2 mx-2"
                                    >
                                        <option value=""> पीईईओ सूची </option>
                                        {peeoList?.map((district, index) => (
                                            <option value={district.name} key={index}>
                                                {district.panchayat_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Col>
                        </Row>
                        <Row className='mb-4'>
                            
                            
                            <Col md={3}>
                                {/* upshakha */}
                                <div className="">
                                    <select
                                        value={filters.filter8}
                                        onChange={(e) => { 
                                            pushFilter({ filter: "workarea_upshakha_name", id: e.target.value});
                                             setFilters({ ...filters, filter8: e.target.value }) }}
                                        name="workarea_upshakha"
                                        className="selectDropdown form-control form-select mt-2 mx-2"
                                    >
                                        <option value=""> उपशाखा  </option>
                                        {upshakha?.map((district, index) => (
                                            <option value={district.name} key={index}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Col>
                            <Col md={3}>
                                {/* sankul */}
                                <div className="">
                                    <select
                                        value={filters.filter9}
                                        onChange={(e) => { 
                                            
                                            pushFilter({ filter: "workarea_sankul_name", id: e.target.value });
                                       
                                        setFilters({ ...filters, filter9: e.target.value }) }}
                                        name="workarea_sankul"
                                        className="selectDropdown form-control form-select mt-2 mx-2"
                                    >
                                        <option value="">संकुल</option>
                                        {sankul?.map((district, index) => (
                                            <option value={district.name} key={index}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Col>
                            <Col>

                                <div className=" mt-2 mx-2">

                                    <button className='btn btn-secondary' onClick={() => { ressetFilters() }}>Reset</button>
                                    <button className='global_btn' onClick={() => { finalFilteredData() }}>Search</button>
                                </div>

                            </Col>
                        </Row>
                        <div className="table-wrapper users-datatable">
                            <DatatableWrapper
                                body={filteredList ? filteredList : userList ?? []}
                                headers={STORY_HEADERS}
                                paginationOptionsProps={{
                                    initialState: {
                                        rowsPerPage: rowPerPageInTable,
                                        options: [50,100,200,500,1000]
                                    }
                                }}
                            >
                                <Row className="mb-4 p-2">
                                    <Col
                                        xs={12}
                                        lg={4}
                                        className="d-flex flex-col justify-content-end align-items-end"
                                    >
                                        <Filter />

                                    </Col>

                                    <Col
                                        xs={12}
                                        sm={6}
                                        lg={2}
                                        className="d-flex flex-col justify-content-lg-center align-items-center justify-content-sm-start mb-2 mb-sm-0"
                                    >
                                        <PaginationOptions />
                                    </Col>

                                </Row>

                                <Table>
                                    <TableHeader />
                                    <TableBody />
                                </Table>
                                <div className="d-flex justify-content-center p-3">

                                    <Pagination alwaysShowPagination />
                                </div>
                            </DatatableWrapper>

                        </div>
                    </Card>
                </div>
            </div>
            <Spinner sppiner={loading} />
        </>
    )
}

export default UserList