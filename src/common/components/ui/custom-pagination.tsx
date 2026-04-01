'use client';

import { Pagination } from 'react-bootstrap';

import { PageResponseMetaDto } from '@/common/api/schema';

interface Props {
  data: PageResponseMetaDto;
  onPageChange: (page: number) => void;
}

export default function CustomPagination(props: Props) {
  const {
    data: { currentPage, endPage, hasNext, hasPrevious, startPage, totalPages },
    onPageChange,
  } = props;

  return (
    <Pagination>
      {currentPage !== 1 && (
        <Pagination.First onClick={() => onPageChange(1)} />
      )}
      {hasPrevious && (
        <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} />
      )}
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
        const page = startPage + i;
        return (
          <Pagination.Item
            key={page}
            active={currentPage === page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Pagination.Item>
        );
      })}
      {hasNext && (
        <Pagination.Next onClick={() => onPageChange(currentPage + 1)} />
      )}
      {endPage !== totalPages && (
        <Pagination.Last onClick={() => onPageChange(totalPages)} />
      )}
    </Pagination>
  );
}
