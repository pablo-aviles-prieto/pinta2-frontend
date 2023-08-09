import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

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

export const ContactForm = () => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    contactType: Yup.string().required('Contact type is required'),
    contactInfo: Yup.string()
      .test(
        'contact-info-validation',
        'Invalid contact information',
        function (value) {
          const { contactType } = this.parent;
          if (contactType === 'email') {
            return (
              /(.+)@(.+){2,}\.(.+){2,}/.test(value ?? '') ||
              this.createError({ message: 'Email no válido' })
            );
          } else if (contactType === 'linkedin') {
            return (
              Yup.string().url('Invalid LinkedIn URL').isValidSync(value) ||
              this.createError({ message: 'URL no válida' })
            );
          }
          return false;
        }
      )
      .required('La información de contacto es obligatoria'),
    message: Yup.string().required('El mensaje es obligatorio'),
  });

  const onSubmit = (
    values: typeof INIT_VALUES,
    { setSubmitting }: FormikHelpers<typeof INIT_VALUES>
  ) => {
    // TODO: Actually this should be handled by the backend,with a socket event that recieves the data.
    // SEARCH FOR EVENTS WITH ACKNOWLEDGE
    // TODO: Use the '@formspree/react' ??
    console.log('Form data', values);
    setSubmitting(false);
  };

  const INPUT_STYLES =
    'p-1 px-2 border-2 rounded-md outline-none border-emerald-600 bg-slate-50 focus-visible:border-emerald-400';
  const ERROR_MSG_STYLES = 'text-red-600 text-sm';
  const LABEL_STYLES = 'text-emerald-800';

  return (
    <Formik
      initialValues={INIT_VALUES}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className='px-12 py-6'>
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
              className={`${INPUT_STYLES} !bg-orange-100 w-[40%]`}
              type='submit'
              disabled={isSubmitting}
            >
              Enviar
            </button>
          </div>
          {/* TODO: Display a message to know the user we will contact ASAP after success submit */}
        </Form>
      )}
    </Formik>
  );
};
