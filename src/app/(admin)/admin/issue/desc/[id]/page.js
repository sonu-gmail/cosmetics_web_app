"use client";
import dynamic from 'next/dynamic';
import { useState, useEffect } from "react";
import Link from "next/link";
//import CKeditor from "../../../../../../components/CKeditor";
import Action from "../../../../../lib/action";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { LuLoader2 } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { issuedescriptionschema } from "../../../../../schemas/issuedecription";

const CKeditor = dynamic(() => import('../../../../../../components/CKeditor'), { 
    loading: () => <Skeleton height={288} width={`100%`} />,
    ssr: false 
});

const AddIssueDescription = ({params}) => {

    const [issue, setIssue] = useState(null);
    const [loader, setLoader] = useState(false);
    const [editorData, setEditorData] = useState('');
    const router = useRouter();

    useEffect(() => {
        Action.getIssueDetail(params.id).then((data) => {
            if(data.success == true)
            {
                setIssue(data.data?.issueDetails);
            }
        }).catch((error) => {
            toast.error('unable to get Issue Detail');
            console.log(error);
        });
    }, [])

    const formik = useFormik({
        initialValues:{
            issue_type_id:"",
            description:"",
            issue_id:""
        },
	    validationSchema: issuedescriptionschema,
	    onSubmit: async (values) => {
            setLoader(true)
            console.log(values);
            const f = new FormData();
            f.append('issue_type_id', values.issue_type_id);
			f.append('description', values.description);
			f.append('issue_id', values.issue_id);
            Action.createIssueDescription(f, params.id).then((data) => {
                console.log(data);
                if(data.success == true)
                {
                    console.log(data);
                    setLoader(false);
                    toast.success(data.message);
                    router.push('/admin/issue/'+issue?.issue_type_detail_id);

                }
            }).catch((error) => {
                toast.error('unable to create issue description');
                console.log(error);
                setLoader(false);
            });
		}
	});

    const { errors, touched, setFieldValue, handleSubmit } = formik;

    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5">Create Issue Description</h1>
            </div>
            <div className="flex justify-start text-center">
                <Link href={`/admin/issue/${issue?.committee?.id}`} className="w-44 py-2 px-6 bg-primary flex items-center justify-center font-normal">Back</Link>
            </div>
            <div className="flex justify-between mt-6">
                <div className="w-1/2 mr-8 border py-6 px-4">
                    <form onSubmit={handleSubmit}  method="POST">
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-light mb-3 text-[#002855]">Committee:</span>
                            <div className="text-sm text-[#646464]">{issue?.committee?.name}</div>
                            <input
                                type="hidden" 
                                name="issue_type_id"
                                defaultValue={issue?.issue_type_detail_id}
                            />
                            <input
                                type="hidden" 
                                name="issue_id"
                                defaultValue={issue?.id}
                            />
                        </label>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-light mb-3 text-[#002855]">Issue:</span>
                            <div className="text-sm text-[#646464]" dangerouslySetInnerHTML={{ __html:issue?.name}}></div>
                        </label>
                        <label className="block mb-4 mr-2">
                            <span className="block text-sm font-light mb-3 text-[#002855]">Description:</span>
                            <div>
                                <CKeditor
                                    name="name"
                                    data={editorData}
                                    onChange={(data) => {
                                        setFieldValue("description", data);
                                        setFieldValue("issue_type_id", issue?.issue_type_detail_id);
                                        setFieldValue("issue_id", issue?.id);
                                    }}
                                />
                                {errors?.description && touched?.description && <span className="text-sm text-[red]">{errors?.description}</span>}
                            </div>
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

export default AddIssueDescription;