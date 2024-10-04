import * as yup from 'yup';

export const issuedescriptionschema = yup.object().shape({
    description:yup.mixed().required('Please enter some description'),
})