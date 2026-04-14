import { Col, Container, Row } from 'react-bootstrap';

import ErpTebClient from './erp-teb-client';

interface Props {
  children?: React.ReactNode;
  domain: 'hr' | 'inventory' | 'sales';
}

export default function ErpTeb({ children, domain }: Props) {
  return (
    <Container>
      <Row className="justify-content-between">
        <Col xs={9} className="d-flex">
          <ErpTebClient domain={domain} />
        </Col>
        <Col xs={2} className="text-end">
          {children}
        </Col>
      </Row>
    </Container>
  );
}
