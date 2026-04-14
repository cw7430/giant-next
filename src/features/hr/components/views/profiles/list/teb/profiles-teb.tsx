import { ErpTeb } from '@/common/components/ui';
import ShowRegisterProfileModalButton from './show-register-profile-modal-button';

interface Props {
  modalKey: string;
}

export default function ProfilesTeb({ modalKey }: Props) {
  return (
    <ErpTeb domain="hr">
      <ShowRegisterProfileModalButton modalKey={modalKey} />
    </ErpTeb>
  );
}
