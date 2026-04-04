import { Col, Container, Row } from 'react-bootstrap';

import { ErpTeb } from '@/common/components/ui';

export default function SalesPayments() {
  return (
    <>
      <h1 className="text-center">매출 기록</h1>
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
