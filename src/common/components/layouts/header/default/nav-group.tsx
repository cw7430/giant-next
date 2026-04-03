'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar } from 'react-bootstrap';

export default function NavGroup() {
  const pathname = usePathname();

  return (
    <Navbar bg="black" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} href="/" className="fs-4">
          Giant
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="header-responsive-navbar" />
        <Navbar.Collapse id="header-responsive-navbar">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              href="/inventory"
              active={pathname.startsWith('/inventory')}
            >
              재고관리
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/sales"
              active={pathname.startsWith('/sales')}
            >
              매출관리
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/hr/profiles"
              active={pathname.startsWith('/hr')}
            >
              인사관리
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
