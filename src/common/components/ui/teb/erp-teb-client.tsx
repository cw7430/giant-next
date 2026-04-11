'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Nav } from 'react-bootstrap';

interface Props {
  domain: 'hr' | 'inventory' | 'sales';
}

export default function ErpTebClient({ domain }: Props) {
  const pathname = usePathname();

  const categories = {
    hr: [
      { idx: 1, title: '직원관리', path: '/hr/profiles' },
      { idx: 2, title: '근태관리', path: '/hr/attendance' },
      { idx: 3, title: '급여관리', path: '/hr/payroll' },
    ],
    inventory: [
      { idx: 1, title: '재고관리', path: '/inventory/stock' },
      { idx: 2, title: '생산관리', path: '/inventory/products' },
      { idx: 3, title: '입출고관리', path: '/inventory/movements' },
    ],
    sales: [
      { idx: 1, title: '매출관리', path: '/sales/payments' },
      { idx: 2, title: '결제관리', path: '/sales/records' },
    ],
  } as const;

  const currentCategories = [...categories[domain]].sort(
    (a, b) => a.idx - b.idx,
  );

  return (
    <Nav className="w-100" fill variant="tabs" data-bs-theme="dark">
      {currentCategories.map(({ idx, title, path }) => (
        <Nav.Item key={idx}>
          <Nav.Link as={Link} href={path} active={pathname === path}>
            {title}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}
