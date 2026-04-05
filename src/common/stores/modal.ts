import { create } from 'zustand';

type ModalState = {
  modals: string[];

  showModal: (modalName: string) => void;

  closeModal: (modalName: string) => void;
};

type DialogParams = {
  modal: 'alert' | 'confirm';
  title: string;
  text: string;
  handleAfterClose?: () => void;
};

type DialogModalState = {
  config: DialogParams | null;
  showModal: (params: DialogParams) => void;
  closeModal: (isCancel?: boolean) => void;
};

export const useModalState = create<ModalState>()((set) => ({
  modals: [],

  showModal: (modalName) =>
    set((state) => ({
      modals: state.modals.includes(modalName)
        ? state.modals
        : [...state.modals, modalName],
    })),

  closeModal: (modalName) =>
    set((state) => ({
      modals: state.modals.filter((m) => m !== modalName),
    })),
}));

export const useDialogModalState = create<DialogModalState>((set) => ({
  config: null,

  showModal: (params) => set({ config: params }),

  closeModal: (isCancel = false) =>
    set((state) => {
      const callback = state.config?.handleAfterClose;

      if (!isCancel && callback) {
        callback();
      }

      return { config: null };
    }),
}));
