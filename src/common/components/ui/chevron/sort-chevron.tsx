'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronUp, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

import styles from './sort-chevron.module.css';

interface Props {
  sortPathParam: string;
  sortPath: string;
  sortOrderParam: 'asc' | 'desc';
}

export default function SortChevron({
  sortPathParam,
  sortPath,
  sortOrderParam,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAscending = sortPathParam === sortPath && sortOrderParam === 'asc';
  const isDescending = sortPathParam === sortPath && sortOrderParam === 'desc';

  const createPageUrl = (searchPath: string, sortOrder: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    params.set('sortPath', searchPath);
    params.set('sortOrder', sortOrder);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <span className="p-1">
      <ChevronUp
        onClick={() => {
          if (!isAscending) {
            router.push(createPageUrl(sortPath, 'asc'));
          }
        }}
        className={clsx(styles['sort-icon'], isAscending && styles.active)}
      />
      <ChevronDown
        onClick={() => {
          if (!isDescending) {
            router.push(createPageUrl(sortPath, 'desc'));
          }
        }}
        className={clsx(styles['sort-icon'], isDescending && styles.active)}
      />
    </span>
  );
}
