import * as yup from 'yup';

export const issueschema = yup.object().shape({
    name:yup.mixed().required('Please enter some description'),
    priority:yup.string().required('Please select issue priority.'),
    committees:yup.array().of(yup.string()).min(1, 'Please select at least one committees.'),
})