'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Col, Row, Container, Nav } from 'react-bootstrap';

export default function HrTebs() {
  const pathname = usePathname();

  return (
    <Container>
      <Row className="justify-content-between">
        <Col xs={9} className="d-flex">
          <Nav className="w-100" fill variant="tabs" data-bs-theme="dark">
            <Nav.Item>
              <Nav.Link
                as={Link}
                href="/hr/profiles"
                active={pathname === '/hr/profiles'}
              >
                {'직원관리'}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                href="/hr/attendance"
                active={pathname === '/hr/attendance'}
              >
                {'근태관리'}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                href="/hr/payroll"
                active={pathname === '/hr/payroll'}
              >
                {'급여관리'}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
    </Container>
  );
}
