'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronUp } from 'lucide-react';

interface Props {
  searchPath: string;
  searchOrder: 'asc' | 'desc';
}

export default function SortChevron({ searchPath, searchOrder }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageUrl = (searchPath: string, sortOrder: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('searchPath', searchPath);
    params.set('sortOrder', sortOrder);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <span>
      <ChevronUp />
    </span>
  );
}
