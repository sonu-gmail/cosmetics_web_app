import * as yup from 'yup';

export const documentnotificationschema = yup.object().shape({
    subject:yup.string().required('Please enter Subject.'),
    notification_content:yup.string().required('Please enter notification content.'),
})