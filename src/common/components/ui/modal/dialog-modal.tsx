'use client';

import { useEffect, useCallback } from 'react';
import { Button, Modal } from 'react-bootstrap';

import { useDialogModalState } from '@/common/stores';

export default function DialogModal() {
  const { config, closeModal } = useDialogModalState();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        closeModal(false);
      } else if (e.key === 'Escape') {
        closeModal(true);
      }
    },
    [closeModal],
  );

  useEffect(() => {
    if (!config) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, config]);

  if (!config) return null;

  const isConfirm = config.modal === 'confirm';

  return (
    <Modal backdrop="static" show={!!config} onHide={() => closeModal(true)}>
      <Modal.Header>
        <Modal.Title>{config.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{config.text}</Modal.Body>
      <Modal.Footer>
        {isConfirm && (
          <Button variant="danger" onClick={() => closeModal(true)}>
            취소
          </Button>
        )}
        <Button
          variant={isConfirm ? 'success' : 'primary'}
          onClick={() => closeModal(false)}
        >
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
