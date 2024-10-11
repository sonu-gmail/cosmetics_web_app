import * as yup from 'yup';

export const changepasswordschema = yup.object().shape({
    password:yup.string().required('Please enter password.'),
    new_password:yup.string().required('Please enter new password.'),
    new_password_confirmation:yup.string().required('Please enter new confirm password.'),
})