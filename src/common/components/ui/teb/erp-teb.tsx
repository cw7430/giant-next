import { Col, Container, Row } from 'react-bootstrap';

import ErpTebClient from './erp-teb-client';

interface Props {
  domain: 'hr' | 'inventory' | 'sales';
}

export default function ErpTeb({ domain }: Props) {
  return (
    <Container>
      <Row className="justify-content-between">
        <Col xs={9} className="d-flex">
          <ErpTebClient domain={domain} />
        </Col>
      </Row>
    </Container>
  );
}
