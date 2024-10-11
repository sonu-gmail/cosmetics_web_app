"use client";
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import 'react-loading-skeleton/dist/skeleton.css'
import Link from "next/link";
import Action from '../../../../../lib/action';
import toast from 'react-hot-toast';
import { useFormik } from "formik";
import Skeleton from 'react-loading-skeleton';
import { LuLoader2 } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { documentnotificationschema } from '../../../../../schemas/documentnotification';

const CKeditor = dynamic(() => import('../../../../../../components/CKeditor'), { 
    loading: () => <Skeleton height={288} width={`100%`} />,
    ssr: false 
});

const DocumentNotification = ({params}) => {
    const [document, setDocument] = useState('');
    const [committes, setCommittes] = useState([]);
    const [loader, setLoader] = useState([]);
    const [editorData, setEditorData] = useState('');
    const router = useRouter();

    useEffect(() => {
        Action.getDocumentDetail(params?.id).then((data) => {
            if(data.success == true)
            {
                setDocument(data.data);
                let doclibCommittees = data.data?.doclib_committees;
                setCommittes (doclibCommittees);
            }
        }).catch((error) => {
            toast.error('unable to get document detail');
            console.log(error);
        });
    }, [])

    const formik = useFormik({
        initialValues:{
            subject:"",
            notification_content:"",
        },
	    validationSchema: documentnotificationschema,
	    onSubmit: async (values) => {
            setLoader(true)
            console.log(values)
            const f = new FormData();
            f.append('subject', values.subject);
            f.append('notification_content', values.notification_content);
			f.append('id', document?.id);
            Action.sendDocumentNotification(f).then((data) => {
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
                toast.error('unable to send document notification');
                console.log(error);
                setLoader(false);
            });
		},
	});
    const { errors, touched, setFieldValue, handleChange, handleSubmit } = formik;
    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5">Send Document Notification</h1>
            </div>
            <div className="flex justify-start text-center">
                <Link href={`/admin/document`} className="w-44 py-2 px-6 bg-primary flex items-center justify-center font-medium">Back</Link>
                <Link href={`/admin/document/edit/${document?.id}`} className="w-44 py-2 px-6 bg-primary flex items-center justify-center font-medium ml-2">Edit</Link>
            </div>
            <div className="mt-6">
                <div className='flex'>
                    <strong>Title:</strong> <p className='ml-2'>{document?.title}</p>
                </div>
                <div className='mt-5 mb-5'>
                    <strong className='mb-2 block'>Description:</strong> 
                    <p dangerouslySetInnerHTML={{ __html:document?.description}}></p>
                </div>
                <div className='flex'>
                    <strong>Committees:</strong> 
                    <div className='ml-2'>
                        {
                            committes.length > 0 && committes.map((committee, index) => (
                                <p key={index} className='mt-1 mb-1'>{committee?.committee?.name}</p>
                            ))
                        }
                    </div>
                </div>
                <div>
                    <strong className='block mb-2'>Notification:</strong> 
                    <div className='border py-2 px-2 w-1/2'>
                        <form method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
                            <label className="block mb-4 mr-2">
                                <span className="block text-sm font-normal mb-3 text-[#002855]">Subject:<sup className='text-red-700'>*</sup></span>
                                <input
                                    type="text" 
                                    name="subject"
                                    onChange={handleChange}
                                    className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                                />
                                {errors?.subject && touched?.subject && <span className="text-sm text-[red]">{errors?.subject}</span>}
                            </label>
                            <label className="block mb-4 mr-2">
                                <span className="block text-sm font-normal mb-3 text-[#002855]">Notification Content:<sup className='text-red-700'>*</sup></span>
                                <div>
                                    <CKeditor
                                        name="notification_content"
                                        data={editorData}
                                        onChange={(data) => {setFieldValue("notification_content", data);}}
                                    />
                                    {errors?.notification_content && touched?.notification_content && <span className="text-sm text-[red]">{errors?.notification_content}</span>}
                                </div>
                            </label>
                            {
                                (loader == true) ? <button type="submit" className="flex items-center justify-center bg-primary mt-4 px-16 py-2 rounded text-white w-[220px]"><LuLoader2 size={20} className="loading-icon"/></button> : <button type='submit' className="bg-primary py-2 px-8 text-sm text-[#002855] font-medium mt-4">Send</button>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DocumentNotification;