"use client";
import React,{ useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CKeditor = ({ onChange, data }) => {
    
    useEffect(() => {
        onChange(data);
    },[])

    const handleChange = (event, editor) => {
        const data = editor.getData();
        onChange(data);
    };

    return (
        <>
            <CKEditor
                editor={ClassicEditor}
                data={data}
                onChange={handleChange}
            />
        </>
    )
}

export default CKeditor;