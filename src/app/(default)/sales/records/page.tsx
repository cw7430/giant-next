import { Col, Container, Row } from 'react-bootstrap';

import { ErpTeb } from '@/common/components/ui';

export default function SalesRecords() {
  return (
    <>
      <h1 className="text-center">결제 내역</h1>
      <Container>
        <Row className="justify-content-between">
          <Col xs={9} className="d-flex">
            <ErpTeb domain="sales" />
          </Col>
        </Row>
      </Container>
    </>
  );
}
