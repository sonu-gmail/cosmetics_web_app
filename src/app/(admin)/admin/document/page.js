"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Moment from 'react-moment';
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { GrPowerReset } from "react-icons/gr";
import Action from "../../../lib/action";
import DocumentSkeleton from "@/components/skeleton/document-skeleton";

const DocumentLiting = () => {

    const [loader, setLoader] = useState(true);
    const [committees, setCommittees] = useState([]);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        Action.getDocuments().then((data) => {
            if(data.success == true)
            {
                setDocuments(data.data.data);
                setLoader(false);
            }
        }).catch((error) => {
            setLoader(false);
            toast.error('unable to get document listing');
            console.log(error);
        });
    },[])
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

    const getFileExtension = (url) => {
        // Use URL constructor to handle complex URLs
        const pathname = new URL(url).pathname;
        // Extract the extension from the last segment of the path
        return pathname.substring(pathname.lastIndexOf('.') + 1);
    }
    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5">Document Library</h1>
            </div>
            <div className="flex justify-end text-center">
                <Link href={`/admin/document/create`} className="w-44 py-2 px-6 bg-primary flex items-center justify-center font-medium"><FaPlus size={16} className="mr-1" />Create</Link>
            </div>
            <div className="flex">
                <input 
                    type="text"
                    placeholder="Search" 
                    className="focus:outline-none border-b py-2 px-2"
                />
                <select className="w-48 focus:outline-none py-2 px-4 border text-[#002855] font-light">
                    <option>Filter</option>
                    <option value={`first_name_asc`}>Newest to Oldest</option>
                    <option value={`first_name_desc`}>Oldest to Newest</option>
                </select>
                <select className="w-48 focus:outline-none py-2 px-4 border ml-1 text-[#002855] font-light">
                    <option>committee</option>
                    {
                        committees.length > 0 && committees.map((committe, index) => (
                            <option value={committe.value} key={index}>{committe.label}</option>
                        ))
                    }
                </select>
                <button className="bg-primary px-4 py-2 ml-2 mr-2 text-white"><CiSearch size={18}/></button>
                <button className="bg-primary px-4 py-2 ml-2 mr-2 text-white"><GrPowerReset size={18}/></button>
            </div>
            <div className="mt-8">
                {
                    (loader == true) ? <DocumentSkeleton /> : <>
                        {
                            documents.length > 0 && documents.map((document, index) => (
                                <div key={index} className="bg-[#C1DFE0] py-4 px-4 flex justify-between items-center mb-4 rounded">
                                    <div className="flex flex-1">
                                        <div className="h-12 w-12 rounded-sm bg-slate-300 mr-2">
                                            <Image src={`/assets/images/icons/${getFileExtension(document?.file)}.png`} height={100} width={100} alt="icon"/>
                                        </div>
                                        <div>
                                            <p className="block text-xl font-medium mb-1 text-[#002855]">{document?.title}</p>
                                            <span className="block text-[#646464] text-sm font-medium mb-1">
                                            <Moment format="D MMM YYYY">
                                                {document?.updated_at}
                                            </Moment>
                                            </span>
                                            <span className="block text-[#646464] text-sm font-light">FCM,INT</span>
                                        </div>
                                    </div>
                                    <div className="">
                                        <Link href="" className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2">Edit</Link>
                                        <Link href="" className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2">Comment</Link>
                                        <Link href="" className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2">Download</Link>
                                        <Link href="" className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2">Notification</Link>
                                        <Link href="" className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2">Archive</Link>
                                        <Link href="" className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2">Delete</Link>
                                    </div>
                                </div>
                            ))
                        }
                    </>
                }
            </div>
        </>
    )
}

export default DocumentLiting;