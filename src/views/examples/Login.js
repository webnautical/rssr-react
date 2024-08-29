import  { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import CryptoJS from 'crypto-js';
import logoicon from '../../assets/img/brand/rsslogo.png'
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col,
  } from "reactstrap";
  import { encryptLocalStorageData, toastifyError, toastifySuccess } from '../../components/Utility/Utility';
import config from 'config';

  const Login = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const [value, setValue] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState({
    email: '',
    password: ''
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
  // Function to encrypt data
const encryptData = (data, key) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  return ciphertext;
};
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!value.email) {
      isValid = false;
      newErrors.email = 'Please enter a valid email address.';
    } else if (!/\S+@\S+\.\S+/.test(value.email)) {
      isValid = false;
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!value.password) {
      isValid = false;
      newErrors.password = 'Please enter your password.';
    }

    setError(newErrors);
    return isValid;
  };

 // Function to handle Remember Me checkbox change
 const handleRememberMeChange = () => {
  setRememberMe((prevRememberMe) => !prevRememberMe);
};
    // Populate form fields with remembered credentials on component mount
    useEffect(() => {
      const rememberedCredentials = JSON.parse(localStorage.getItem('rssCredentials'));
      if (rememberedCredentials) {
        setValue({
          email: rememberedCredentials.email,
          password: rememberedCredentials.password 
        });
        setRememberMe(true);
      }
      
    }, []);
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default form submission
        handleLogin();
      }
    };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${config.url}/admin/loginAdminUser`, value);

      if (res.status === 200) {

        if (rememberMe) {
          // If Remember Me is checked, store email and password in localStorage
          const encryptedCredentials = encryptData(value, 'yourCryptoKey');
          localStorage.setItem('rssCredentials', encryptedCredentials);
         //localStorage.setItem('rssCredentials', JSON.stringify(value));
         // encryptLocalStorageData('rss-rssCredentials-secret', dataParam, 'DoNotTryToAccess');
        } else {
          // If Remember Me is unchecked, remove remembered credentials from localStorage
          localStorage.removeItem('rssCredentials');
        }
        const dataParam = {
          token: res.data.token,
          login_id: res.data.userdata._id,
          first_name: res.data.userdata.first_name,
          last_name: res.data.userdata.last_name,
          email: res.data.userdata.email,
          role:res.data.userdata.role,
          district:res.data.userdata.district,
          user_id:res.data.userdata.id,
        };

        encryptLocalStorageData('rss-web-secret', dataParam, 'DoNotTryToAccess');
        setTimeout(() => {
        toastifySuccess('Login successful!');
        setLoading(false);
        navigate('/admin/index');
      }, 2000);
      } else {
        setLoading(false);
        toastifyError('Something went wrong!');
      }
    } catch (error) {
      setLoading(false);
      toastifyError(error?.response?.data?.message || 'An error occurred while logging in.');
    }
  };
  return (
    <Col lg="5" md="7">
      <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5 bg-white">
          <Form role="form" onKeyDown={handleKeyDown}>
            <FormGroup className="mb-3">

              <div className='log_in_logo text-center'><img style={{ width:'200'}} src={logoicon} alt='logo-icon'/></div>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Email"
                  type="email"
                  autoComplete="new-email"
                  value={value.email}
                  onChange={handleChange}
                  name="email"
                  className={error.email && 'error_outline'}
                />
              </InputGroup>
              {/* {error.email && <span className="text-danger">{error.email}</span>} */}
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                  <i
                      className={`${showPassword ? 'fa-solid fa-lock-open' : 'fa-solid fa-lock'}`}
                      onClick={togglePasswordVisibility}
                    />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={value.password}
                  onChange={handleChange}
            
                  name="password"
                  className={error.password && 'error_outline'}
                />
              </InputGroup>
              {/* {error.password && <span className="text-danger">{error.password}</span>} */}
            </FormGroup>
            <div className="custom-control custom-control-alternative custom-checkbox">
              <input className="custom-control-input" id="customCheckLogin" type="checkbox" checked={rememberMe} // Bind checked state to Remember Me checkbox
                onChange={handleRememberMeChange} // Handle change event of Remember Me checkbox
              />
              <label className="custom-control-label" htmlFor="customCheckLogin">
                <span className="text-muted">Remember me</span>
              </label>
            </div>
            <div className="text-center">
              <Button className="my-4 button1 border-0" color="primary" type="button" onClick={handleLogin}>
                {loading ? 'Logging in...' : 'Log in'}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Col>
  );
  };
  
  export default Login;
  