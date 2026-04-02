export default function HrLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="d-flex flex-column min-vh-100 p-3">
      <div className="my-5">
        <h1 className="text-center">인사관리</h1>
      </div>
      {children}
    </div>
  );
}
