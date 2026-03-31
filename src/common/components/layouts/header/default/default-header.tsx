import ButtonGroup from './button-group';
import NavGroup from './nav-group';

export default function DefaultHeader() {
  return (
    <header className="bg-black text-white py-3 px-4 d-flex justify-content-between align-items-center">
      <NavGroup />
      <div className="d-flex gap-2">
        <ButtonGroup />
      </div>
    </header>
  );
}
