"use client";
import dynamic from 'next/dynamic';
import { useState, useEffect } from "react";
import Action from "../../../../../../../lib/action";
//import CKeditor from "../../../../../../../../components/CKeditor";
import Link from "next/link";
import toast from "react-hot-toast";
import { LuLoader2 } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import DatePicker from "react-datepicker";
import { issuedescriptionactionschema } from "../../../../../../../schemas/issuedecriptionaction";
import "react-datepicker/dist/react-datepicker.css";

const CKeditor = dynamic(() => import('../../../../../../../../components/CKeditor'), { 
    loading: () => <Skeleton height={288} width={`100%`} />,
    ssr: false 
});

const IssueDescriptionAction = ({params}) => {
    console.log(params);
    const [issue, setIssue] = useState(null);
    const [loader, setLoader] = useState(false);
    const [issueDescription, setIssueDescription] = useState(null);
    const [externalDeadline, setExternalDeadline] = useState('');
    const [internalDeadline, setInternalDeadline] = useState('');
    const router = useRouter();

    useEffect(() => {
        Action.getIssueDetail(params.id).then((data) => {
            if(data.success == true)
            {
                setIssue(data.data?.issueDetails);
                let issueDescriptions = data.data?.issueDetails?.descriptions
                let curentDescription = issueDescriptions.find(item => item.id == params.descId); 
                setIssueDescription(curentDescription);
            }
        }).catch((error) => {
            toast.error('unable to get Issue Detail');
            console.log(error);
        });
    }, [])

    const formik = useFormik({
        initialValues:{
            issue_type_id:"",
            desc_id:"",
            action:"", 
            external_deadline:"", 
            internal_deadline:"",
            status:""
        },
	    validationSchema: issuedescriptionactionschema,
	    onSubmit: async (values) => {
            setLoader(true);
            const f = new FormData();
            f.append('issue_type_id', values.issue_type_id);
			f.append('desc_id', values.desc_id);
			f.append('action', values.action);
			f.append('external_deadline', values.external_deadline);
			f.append('internal_deadline', values.internal_deadline);
			f.append('status', values.status);
            Action.createIssueDescriptionAction(f).then((data) => {
                console.log('////////', data);
                if(data.error == true) {
                    setLoader(false);
                    toast.error(data.message);
                }

                if(data.success == true)
                {
                    setLoader(false);
                    toast.success(data.message);
                    router.push('/admin/issue/'+issue?.issue_type_detail_id);

                }
            }).catch((error) => {
                toast.error('unable to create issue description action');
                console.log(error);
                setLoader(false);
            });
		},
	});

	const { errors, touched, setFieldValue, handleChange, handleSubmit } = formik;

    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5">Create Issue Description Action</h1>
            </div>
            <div className="flex justify-start text-center">
                <Link href={`/admin/issue/${issue?.issue_type_detail_id}`} className="w-44 py-2 px-6 bg-primary flex items-center justify-center font-normal">Back</Link>
            </div>
            <div className="flex justify-between mt-6">
                <div className="w-1/2 mr-8 border py-6 px-4">
                    <form onSubmit={handleSubmit} method="POST">
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-light mb-3 text-[#002855]">Committee:</span>
                            <div className="text-sm text-[#646464]">{issue?.committee?.name}</div>
                        </label>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-light mb-3 text-[#002855]">Issue:</span>
                            <div className="text-sm text-[#646464]" dangerouslySetInnerHTML={{ __html:issue?.name}}></div>
                        </label>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-light mb-3 text-[#002855]">Issue Description:</span>
                            <div className="text-sm text-[#646464]" dangerouslySetInnerHTML={{ __html:issueDescription?.description}}></div>
                        </label>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-light mb-3 text-[#002855]">Action:</span>
                            <div>
                                <CKeditor
                                    name="action"
                                    onChange={(data) => {
                                        setFieldValue("action", data);
                                        setFieldValue("issue_type_id", params.id);
                                        setFieldValue("desc_id", params.descId);
                                    }}
                                />
                                {errors?.action && touched?.action && <span className="text-sm font-light text-[red]">{errors?.action}</span>}
                            </div>
                        </label>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-light mb-3 text-[#002855]">External Deadline:</span>
                            <div>
                                <DatePicker 
                                    onChange={(date) => {
                                        setExternalDeadline(date)
                                        setFieldValue('external_deadline', new Date(date).toLocaleDateString("en-US"))
                                    }} 
                                    minDate={new Date()}
                                    selected={externalDeadline}
                                    className="w-full h-[38px] border outline-none"
                                    name="external_deadline"
                                />
                                {errors?.external_deadline && touched?.external_deadline && <span className="text-sm font-light text-[red]">{errors?.external_deadline}</span>}
                            </div>
                        </label>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-light mb-3 text-[#002855]">Internal Deadline:</span>
                            <div>
                                <DatePicker 
                                    minDate={new Date()}
                                    onChange={(date) => {
                                        setInternalDeadline(date)
                                        setFieldValue('internal_deadline', new Date(date).toLocaleDateString("en-US"))
                                    }} 
                                    className="w-full h-[38px] border outline-none"
                                    name="internal_deadline"
                                    selected={internalDeadline}
                                />
                                {errors?.internal_deadline && touched?.internal_deadline && <span className="text-sm font-light text-[red]">{errors?.internal_deadline}</span>}
                            </div>
                        </label>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-light mb-3 text-[#002855]">Status:</span>
                            <select name="status" className="w-full h-[38px] py-2 px-2 outline-none bg-white border text-sm" onChange={handleChange}>
                                <option>Please Select Status</option>
                                <option value={7}>Open</option>
                                <option value={8}>Closed</option>
                            </select>
                            {errors?.status && touched?.status && <span className="text-sm font-light text-[red]">{errors?.status}</span>}
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

export default IssueDescriptionAction;