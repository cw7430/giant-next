import type { PageResponseDto } from '@/common/api/schema';

interface Props<T> {
  data: PageResponseDto<T>;
}

export default function HrPage<T>({ data }: Props<T>) {
  return (
    <div>
      <div>hrpage</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
