interface Props {
  children: React.ReactNode;
  title: string;
}

export default function ErpListLayout({ children, title }: Readonly<Props>) {
  return (
    <div className="d-flex flex-column min-vh-100 p-3">
      <div className="my-5">
        <h1 className="text-center">{title}</h1>
      </div>
      {children}
    </div>
  );
}
