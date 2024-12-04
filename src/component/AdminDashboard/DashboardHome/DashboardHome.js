import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import DashboardCards from "./DashboardCards";

function DashboardHome() {
  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <DashboardCards />
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardHome;
