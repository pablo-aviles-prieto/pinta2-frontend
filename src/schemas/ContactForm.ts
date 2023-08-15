import * as Yup from 'yup';

export const ContactFormSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .max(20, 'El nombre no puede tener más de 20 caracteres')
    .required('El nombre es obligatorio'),
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
  message: Yup.string().trim().required('El mensaje es obligatorio'),
});
