import * as yup from 'yup';

const validFileExtensions = { extension: ['doc','docx','xls','xlsx','ppt','pptx','pdf','txt'] };

function isValidFileType(fileName, fileType) {
  return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}

export const eventschema = yup.object().shape({
    title:yup.string().required('Please enter title.'),
    date:yup.string().required('Please enter date.'),
    venue:yup.string().required('Please enter venue.'),
    description:yup.string().required('Please enter description.'),
    time_from:yup.string().required('Please enter start time.'),
    time_to:yup.string().required('Please enter end time.'),
    committees:yup.array().of(yup.string()).min(1, 'Please select at least one committees.'),
    thumb: yup.mixed().test('fileType', 'Please upload a valid File type.', (value) => {
    if (!value) return true;
        return isValidFileType(value && value?.name, "extension")
    })

})