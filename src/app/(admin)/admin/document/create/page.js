"use client";
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import Link from "next/link";
import Action from '../../../../lib/action';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { documentschema } from '../../../../schemas/document';
import { useFormik } from "formik";
import { LuLoader2 } from "react-icons/lu";
import { useRouter } from "next/navigation";

const CKeditor = dynamic(() => import('../../../../../components/CKeditor'), { 
    loading: () => <Skeleton height={288} width={`100%`} />,
    ssr: false 
});

const DocumentCreate = () => {
    const [committees, setCommittees] = useState([]);
    const [loader, setLoader] = useState([]);
    const[isImageUpload, setIsImageUpload] = useState(false);
    const router = useRouter();

    useEffect(() => {
        Action.getCommitteeListing().then((data) => {
            if(data.success == true)
            {
                setCommittees(data.data);
            }
        }).catch((error) => {
            toast.error('unable to get committee listing');
            console.log(error);
        });
    }, [])

    const formik = useFormik({
        initialValues:{
            title:"",
            description:"",
            thumb:"",
            is_featured:"", 
            committees:[]
        },
	    validationSchema: documentschema,
	    onSubmit: async (values) => {
            setLoader(true)
            const f = new FormData();
            f.append('title', values.title);
            f.append('description', values.description);
			f.append('is_featured', values.is_featured);
            values.committees.forEach((item) => f.append("committees[]", item))
            if(isImageUpload) {
                f.append('thumb', values.thumb);
            }
            console.log(f);
            Action.createDocument(f).then((data) => {
                if(data.success == true)
                {
                    console.log(data);
                    setLoader(false);
                    toast.success(data.message);
                    router.push('/admin/document');

                }
                if(data.error == true)
                {
                    console.log(data);
                    setLoader(false);
                    toast.success(data.message);

                }
            }).catch((error) => {
                toast.error('unable to create document');
                console.log(error);
                setLoader(false);
            });
		},
	});
    const { errors, touched, setFieldValue, handleChange, handleSubmit } = formik;

    const handleImageUpload = (e) => {
		formik.setFieldValue('thumb', e.currentTarget.files[0]);
        setIsImageUpload(true);
	}

    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5">Create Document Library</h1>
            </div>
            <div className="flex justify-end text-center">
                <Link href={`/admin/document`} className="w-44 py-2 px-6 bg-primary flex items-center justify-center font-medium">Back</Link>
            </div>
            <div className="flex justify-between mt-6">
                <div className="w-1/2 mr-8 border py-6 px-4">
                    <form method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Title:<sup className='text-red-700'>*</sup></span>
                            <input
                                type="text" 
                                name="title"
                                onChange={handleChange}
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                            {errors?.title && touched?.title && <span className="text-sm text-[red]">{errors?.title}</span>}
                        </label>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Description:<sup className='text-red-700'>*</sup></span>
                            <div>
                                <CKeditor
                                    name="description"
                                    onChange={(data) => {setFieldValue("description", data);}}
                                />
                                {errors?.description && touched?.description && <span className="text-sm text-[red]">{errors?.description}</span>}
                            </div>
                        </label>
                        <label className="block mb-4 w-full">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Image</span>
                            <input 
                                type="file"
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                                onChange={(e) => handleImageUpload(e)}
                            />
                        </label>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Committees:<sup className='text-red-700'>*</sup></span>
                            <Select
                                instanceId="committees"
                                className="basic-single"
                                classNamePrefix="select"
                                isSearchable={true}
                                isMulti
                                name="committees"
                                placeholder="Please select committees"
                                options={committees}
                                onChange={(selectedOption) => { 
                                    console.log(selectedOption);
                                    setFieldValue("committees", selectedOption.map((option) => option.value)); 
                                }}
                            />
                            {errors?.committees && touched?.committees && <span className="text-sm text-[red]">{errors?.committees}</span>}
                        </label>
                        <label className="block mb-4 mr-2 mt-2">
                            <input 
                                type="checkbox" 
                                className="" 
                                name='is_featured' 
                                onChange={handleChange}
                            /><span className="text-base font-medium text-[#646464] ml-2 mb-6">Is Featured</span> 
                        </label>
                        {
                            (loader == true) ? <button type="submit" className="flex items-center justify-center bg-primary mt-4 px-16 py-2 rounded text-white w-[220px]"><LuLoader2 size={20} className="loading-icon"/></button> : <button type='submit' className="bg-primary py-2 px-8 text-sm text-[#002855] font-medium mt-4">Create</button>
                        }
                    </form>
                </div>
            </div>
        </>
    )
}

export default DocumentCreate;