import * as yup from 'yup';

export const issuedescriptionactionschema = yup.object().shape({
    action:yup.mixed().required('Please enter some description'),
    status:yup.string().required('Please select status.'),
    external_deadline:yup.string().required('Please enter external deadline.'),
    internal_deadline:yup.string().required('Please enter internal deadline.'),
})