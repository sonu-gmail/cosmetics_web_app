"use client";
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import Action from '../../../../../lib/action';
//import CKeditor from "../../../../../../components/CKeditor";
import Link from "next/link";
import Select from 'react-select';
import toast from 'react-hot-toast';
import { issueschema } from '../../../../../schemas/issue';
import { useFormik } from "formik";
import { LuLoader2 } from "react-icons/lu";
import { useRouter } from "next/navigation";

const CKeditor = dynamic(() => import('../../../../../../components/CKeditor'), { 
    loading: () => <Skeleton height={288} width={`100%`} />,
    ssr: false 
});

const priorityOptions = [
    { value: 1, label: 'High' },
    { value: 2, label: 'Medium'},
    { value: 3, label: 'Low'},
    { value: 4, label: 'Monitoring'}
];
const IssueCreate = ({params}) => {
    const [loader, setLoader] = useState(false);
    const [committeeName, setCommitteeName] = useState();
    const [committeeId, setCommitteeId] = useState('');
    const [committees, setCommittees] = useState([]);
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

    useEffect(() => {
        Action.getIssueTypeDetails(params.id).then((data) => {
            if(data.success == true)
            {
                setCommitteeName(data.data.name);
                setCommitteeId(data.data.id);
            }
        }).catch((error) => {
            toast.error('unable to get committee listing');
            console.log(error);
        });
    }, [])

    const formik = useFormik({
        initialValues:{
            committee_id:params.id,
            status:1,
            name:"", 
            priority:"", 
            committees:[]
        },
	    validationSchema: issueschema,
	    onSubmit: async (values) => {
            setLoader(true)
            const f = new FormData();
            f.append('committee_id', values.committee_id);
			f.append('name', values.name);
			f.append('priority', values.priority);
			f.append('status', values.status);
            values.committees.forEach((item) => f.append("committees[]", item))
            Action.createIssue(f).then((data) => {
                console.log(data);
                if(data.success == true)
                {
                    console.log(data);
                    setLoader(false);
                    toast.success(data.message);
                    router.push('/admin/issue/'+params.id);

                }
            }).catch((error) => {
                toast.error('unable to create issue');
                console.log(error);
                setLoader(false);
            });
		},
	});
	const { errors, touched, setFieldValue, handleSubmit } = formik;
    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5">Create Issue</h1>
            </div>
            <div className="flex justify-start text-center">
                <Link href={`/admin/issue/1`} className="w-44 py-2 px-6 bg-primary flex items-center justify-center font-normal">Back</Link>
            </div>
            <div className="flex justify-between mt-6">
                <div className="w-1/2 mr-8 border py-6 px-4">
                    <form onSubmit={handleSubmit} method="POST">
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-light mb-3 text-[#002855]">Committee:</span>
                            <div className="text-sm text-[#646464]">{committeeName}</div>
                            <input
                                type="hidden" 
                                name="committee_id"
                                defaultValue={committeeId}
                            />
                        </label>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-light mb-3 text-[#002855]">Issue:</span>
                            <div>
                                <CKeditor
                                    name="name"
                                    onChange={(data) => {setFieldValue("name", data);}}
                                />
                                {errors?.name && touched?.name && <span className="text-sm text-[red]">{errors?.name}</span>}
                            </div>
                        </label>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-light mb-3 text-[#002855]">Priority:</span>
                            <Select
                                instanceId="priority"
                                className="basic-single"
                                classNamePrefix="select"
                                isSearchable={true}
                                name="priority"
                                placeholder="Please select priority"
                                options={priorityOptions}
                                onChange={(selectedOption) => { setFieldValue("priority", selectedOption.value); }}
                            />
                            {errors?.priority && touched?.priority && <span className="text-sm text-[red]">{errors?.priority}</span>}
                        </label>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-light mb-3 text-[#002855]">Assign Committees::</span>
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
                        {
                            (loader == true) ? <button type="submit" className="flex items-center justify-center bg-primary mt-4 px-16 py-2 rounded text-white w-[220px]"><LuLoader2 size={20} className="loading-icon"/></button> : <button type='submit' className="bg-primary py-2 px-8 text-sm text-[#002855] font-medium mt-4">Create</button>
                        }
                    </form>
                </div>
            </div>
        </>
    )
}

export default IssueCreate;