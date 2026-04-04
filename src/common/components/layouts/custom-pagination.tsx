'use client';

import { Pagination } from 'react-bootstrap';
import { PageResponseMetaDto } from '@/common/api/schema';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Props {
  data: PageResponseMetaDto;
}

export default function CustomPagination({ data }: Props) {
  const { currentPage, endPage, hasNext, hasPrevious, startPage, totalPages } =
    data;

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination>
      {currentPage > 1 && (
        <Pagination.First as={Link} href={createPageUrl(1)} />
      )}

      {hasPrevious && (
        <Pagination.Prev as={Link} href={createPageUrl(startPage - 1)} />
      )}

      {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
        const page = startPage + i;
        return (
          <Pagination.Item
            key={page}
            active={currentPage === page}
            as={Link}
            href={createPageUrl(page)}
          >
            {page}
          </Pagination.Item>
        );
      })}

      {hasNext && (
        <Pagination.Next as={Link} href={createPageUrl(endPage + 1)} />
      )}

      {currentPage < totalPages && (
        <Pagination.Last as={Link} href={createPageUrl(totalPages)} />
      )}
    </Pagination>
  );
}
