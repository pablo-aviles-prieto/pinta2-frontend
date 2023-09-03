import { create } from 'zustand';
import { ContactFormI } from '../interfaces/ContactForm';

interface ContactFormStore {
  formState: ContactFormI;
  setFormState: (newState: Partial<ContactFormI>) => void;
  resetFormState: () => void;
}

export const INIT_FORM_VALUES = {
  name: '',
  contactType: 'email',
  contactInfo: '',
  message: '',
};

export const useContactFormData = create<ContactFormStore>((set) => ({
  formState: INIT_FORM_VALUES,
  setFormState: (newState) =>
    set((state) => ({ formState: { ...state.formState, ...newState } })),
  resetFormState: () => set({ formState: INIT_FORM_VALUES }),
}));
