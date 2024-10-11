"use client";
import React, { useState, useEffect } from 'react';
import 'react-loading-skeleton/dist/skeleton.css'
import Link from "next/link";
import Action from '../../../../../lib/action';
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";

const DocumentComment = ({params}) => {
    const [document, setDocument] = useState('');
    const [committes, setCommittes] = useState([]);
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
    
    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5">Document Library Details</h1>
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
                    <strong className='block mb-2'>Document:</strong> 
                    <div className='border py-2 px-2'>
                        <iframe src={document?.html_file} width="100%" height="800px" border="none"></iframe>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DocumentComment;