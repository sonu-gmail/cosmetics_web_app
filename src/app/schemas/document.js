import * as yup from 'yup';

export const documentschema = yup.object().shape({
    title:yup.string().required('Please enter title.'),
    description:yup.string().required('Please enter description.'),
    committees:yup.array().of(yup.string()).min(1, 'Please select at least one committees.'),
})