import * as yup from 'yup';

const validFileExtensions = { extension: ['jpg','png','jpeg'] };

function isValidFileType(fileName, fileType) {
  return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}

export const profileschema = yup.object().shape({
    first_name:yup.string().required('Please enter first name.'),
    last_name:yup.string().required('Please enter last name.'),
    job_title:yup.string().required('Please enter job title.'),
    email:yup.string().email('Please enter a valid email.').required('Please enter your email.'),
    company:yup.string().required('Please enter company name.'),
    committees:yup.array().of(yup.string()).min(1, 'Please select at least one committees.'),
    image: yup.mixed().test('fileType', 'Please upload a valid image type.', (value) => {
    if (!value) return true;
        return isValidFileType(value && value?.name, "extension")
    })

})