import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import logoicon from '../assets/img/brand/rsslogo.png'
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  Col,
  Row,
} from "reactstrap";
import { toastifyError, toastifySuccess } from '../components/Utility/Utility';
import config from 'config';

const AccountDelete = () => {
  const [loading, setLoading] = useState(false);
  const [formSubmit, setFormSubmit] = useState(false)
  const [value, setValue] = useState({
    phone: '',
    reason: ''
  });

  const [error, setError] = useState({
    phone: '',
    reason: ''
  });

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });

    setError({
      ...error,
      [e.target.name]: ''
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!value.phone) {
      isValid = false;
      newErrors.phone = 'Please enter a phone number.';
    } 
    // else if (!/^[6-9]\d{9}$/.test(value.phone)) {
    //   isValid = false;
    //   newErrors.phone = 'Please enter a valid Indian phone number.';
    // }

    if (!value.reason) {
      isValid = false;
      newErrors.reason = 'Please enter your reason.';
    }

    setError(newErrors);
    return isValid;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${config.url}/user/deleteAccount`, value);
      if (res.status === 200) {
        // setTimeout(() => {
        // toastifySuccess('Your Request Submited Success');
        setFormSubmit(<spna>Your account deletion request has been successfully submitted. One of our team members will review your request and process it shortly. We appreciate your patience during this time.</spna>)
        setLoading(false);
        setValue({
          ...value, phone: '', reason : ''
        })
        // }, 2000);
      } else {
        setLoading(false);
        setFormSubmit(<span className='text-danger'>Something went wrong!</span>);
      }
    } catch (error) {
      setLoading(false);
      setFormSubmit(<span className='text-danger'>{error?.response?.data?.message || 'An error occurred while logging in.'}</span>);
    }
  };
  return (
    <div className="container-fluid">
      <Row className='account_deletion_root'>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0 account_deletion">
            <CardBody className="px-lg-5 py-lg-5 bg-white">
              <Form role="form" onKeyDown={handleKeyDown}>
                <FormGroup className="mb-3">

                  <div className='log_in_logo text-center'>
                    <Link to={'https://rssrashtriya.org/'}>
                    <img style={{ width: '200' }} src={logoicon} alt='logo-icon' />
                    </Link>
                  </div>
                  <label htmlFor=""><b>Registered phone number</b> <span className='text-danger'> *</span></label>
                  {/* <InputGroup className="input-group-alternative"> */}
                  <Input
                    placeholder="Registered phone number"
                    type="tel"
                    autoComplete="new-phone"
                    value={value.phone}
                    name='phone'
                    onChange={handleChange}
                    maxLength={10}
                    className={error.phone ? 'error_outline' : 'form-control'}
                  />
                  {/* </InputGroup> */}
                </FormGroup>
                <FormGroup>
                  <label htmlFor=""><b>Reason of  Deletion</b> <span className='text-danger'> *</span></label>
                  {/* <InputGroup className="input-group-alternative"> */}
                  <textarea
                    placeholder="Reason of Deletion"
                    value={value.reason}
                    onChange={handleChange}
                    name="reason"
                    className={error.reason ? 'error_outline w-100' : 'form-control'}
                    rows={4}
                    cols={50}
                  />
                  {/* </InputGroup> */}
                </FormGroup>
                <div className="text-center">
                  <Button className="my-4 button1 border-0" color="primary" type="button" onClick={handleLogin}>
                    {loading ? 'Logging in...' : 'Send Request'}
                  </Button>
                </div>
                {
                  formSubmit &&
                  <div className="col-12">
                    {formSubmit}
                  </div>
                }
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AccountDelete;
