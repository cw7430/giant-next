import { Col, Container, Row } from 'react-bootstrap';

import { ErpTeb } from '@/common/components/ui';

export default function EmployeeAttendances() {
  return (
    <>
      <h1 className="text-center">근태</h1>
      <Container>
        <Row className="justify-content-between">
          <Col xs={9} className="d-flex">
            <ErpTeb domain="hr" />
          </Col>
        </Row>
      </Container>
    </>
  );
}
