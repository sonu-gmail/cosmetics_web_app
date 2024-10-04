"use client";
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import Link from "next/link";
import Action from '../../../../lib/action';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { useFormik } from "formik";
import { LuLoader2 } from "react-icons/lu";
import { useRouter } from "next/navigation";

const CKeditor = dynamic(() => import('../../../../../components/CKeditor'), { 
    loading: () => <Skeleton height={288} width={`100%`} />,
    ssr: false 
});

const DocumentCreate = () => {
    const [committees, setCommittees] = useState([]);

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
                    <form method="POST">
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Title:<sup className='text-red-700'>*</sup></span>
                            <input
                                type="text" 
                                name="title"
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
                            />
                        </label>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Description:<sup className='text-red-700'>*</sup></span>
                            <div>
                                <CKeditor
                                    name="name"
                                    onChange={(data) => {}}
                                />
                            </div>
                        </label>
                        <label className="block mb-4 w-full">
                            <span className="block text-sm font-normal mb-3 text-[#002855]">Image</span>
                            <input 
                                type="file"
                                className="mt-1 h-11 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none"
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
                            />
                        </label>
                        <label className="block mb-4 mr-2 mt-2">
                            <input type="checkbox" className="" /><span className="text-base font-medium text-[#646464] ml-2 mb-6">Is Featured</span> 
                        </label>
                        <button type='submit' className="bg-primary py-2 px-8 text-sm text-[#002855] font-medium mt-4">Create</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default DocumentCreate;