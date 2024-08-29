
import Chart from "chart.js";
import {
  Card,
Col,
  Container,
  Row,
} from "reactstrap";
import {
  chartOptions,
  parseOptions,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

import logoimg from '../assets/img/brand/rsslogo.png'

const Index = (props) => {

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  return (
    <>
      <Header />
      
 
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col className="mb-5 mb-xl-0" xl="8">
            <div className="text-center main_box">
           <img className="main_img_logo" src={logoimg} alt="logo-img"/> 
            

                </div>

                </Col>

                </Row>
              
          
        
       
      </Container>

    </>
  );
};

export default Index;
