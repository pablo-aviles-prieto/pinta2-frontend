import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import { useSocket } from '../hooks/useSocket';
import { ContactFormSchema } from '../schemas';
import { useCustomToast } from '../hooks/useCustomToast';
import { FC } from 'react';

const INIT_VALUES = {
  name: '',
  contactType: 'email',
  contactInfo: '',
  message: '',
};

const CONTACT_OPTIONS = [
  { id: 'email', name: 'Email' },
  { id: 'linkedin', name: 'Perfil LinkedIn' },
];

type Props = {
  closeModal: () => void;
};

export const ContactForm: FC<Props> = ({ closeModal }) => {
  const { socket } = useSocket();
  const { showLoadingToast, updateToast } = useCustomToast();

  const onSubmit = (
    values: typeof INIT_VALUES,
    { setSubmitting }: FormikHelpers<typeof INIT_VALUES>
  ) => {
    setSubmitting(true);
    const submitFormToast = showLoadingToast({ msg: 'Enviando mensaje... 📩' });
    socket?.emit(
      'submit contact form',
      values,
      (response: { success: boolean; message: string }) => {
        if (response.success) {
          updateToast({
            toastId: submitFormToast,
            content: response.message,
            type: 'success',
          });
          closeModal();
        } else {
          updateToast({
            toastId: submitFormToast,
            content: response.message,
            type: 'error',
          });
        }
        setSubmitting(false);
      }
    );
  };

  const INPUT_STYLES =
    'p-1 px-2 border-2 rounded-md outline-none border-emerald-600 bg-slate-50 focus-visible:border-emerald-400';
  const ERROR_MSG_STYLES = 'text-red-600 text-sm';
  const LABEL_STYLES = 'text-emerald-800';

  return (
    <Formik
      initialValues={INIT_VALUES}
      validationSchema={ContactFormSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className='px-24 py-8'>
          <h1
            className='pb-4 text-4xl font-bold text-emerald-600'
            style={{ fontFamily: 'Amaranth' }}
          >
            Contáctanos!
          </h1>
          <div className='flex flex-col'>
            <label className={LABEL_STYLES} htmlFor='name'>
              Nombre:
            </label>
            <Field type='text' name='name' className={INPUT_STYLES} />
            <ErrorMessage
              name='name'
              component='div'
              className={ERROR_MSG_STYLES}
            />
          </div>
          <div className='flex flex-col my-5'>
            <label className={LABEL_STYLES} htmlFor='contactType'>
              Método de contacto:
            </label>
            <Field as='select' name='contactType' className={INPUT_STYLES}>
              {CONTACT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </Field>
          </div>
          <div className='flex flex-col my-5'>
            <label className={LABEL_STYLES} htmlFor='contactInfo'>
              Información de contacto:
            </label>
            <Field type='text' name='contactInfo' className={INPUT_STYLES} />
            <ErrorMessage
              name='contactInfo'
              component='div'
              className={ERROR_MSG_STYLES}
            />
          </div>
          <div className='flex flex-col my-5'>
            <label className={LABEL_STYLES} htmlFor='message'>
              Mensaje:
            </label>
            <Field as='textarea' name='message' className={INPUT_STYLES} />
            <ErrorMessage
              name='message'
              component='div'
              className={ERROR_MSG_STYLES}
            />
          </div>
          <div className='flex justify-center text-center'>
            <button
              className={`${INPUT_STYLES} h-[50px] w-[40%] !bg-orange-100 hover:!bg-orange-200 ${
                isSubmitting && 'hover:!bg-orange-100 bg-neutral-300'
              }`}
              type='submit'
              disabled={isSubmitting}
            >
              <div className='flex items-center justify-center gap-2'>
                {isSubmitting && (
                  <div className='flex items-center justify-center'>
                    <div className='relative rounded-full w-[28px] h-[28px] animate-spin bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 '>
                      <div className='absolute w-[19px] h-[19px] transform -translate-x-1/2 -translate-y-1/2 bg-orange-100 rounded-full top-1/2 left-1/2'></div>
                    </div>
                  </div>
                )}
                <p>{isSubmitting ? 'Enviando...' : 'Enviar'}</p>
              </div>
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
