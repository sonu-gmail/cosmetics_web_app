import * as yup from 'yup';

export const memberchema = yup.object().shape({
    first_name:yup.string().required('Please enter first name.'),
    last_name:yup.string().required('Please enter last name.'),
    email:yup.string().email('Please enter a valid email.').required('Please enter your email.'),
    job_title:yup.string().required('Please enter job title.'),
    company:yup.string().required('Please enter company name.'),
    committees:yup.array().of(yup.string()).min(1, 'Please select at least one committees.'),
})