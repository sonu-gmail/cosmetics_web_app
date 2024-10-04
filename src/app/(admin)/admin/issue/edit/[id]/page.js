"use client";
import dynamic from 'next/dynamic';
import { useState, useEffect } from "react";
import Link from "next/link";
import Select from 'react-select';
import { useFormik } from "formik";
import { LuLoader2 } from "react-icons/lu";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Action from "../../../../../lib/action";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
//import CKeditor from "../../../../../../components/CKeditor";
import { issueschema } from "../../../../../schemas/issue";

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

const EditIssue = ({params}) => {
    const {id} = params;
    const [loader, setLoader] = useState(false);
    const [issue, setIssue] = useState('');
    const [committeeName, setCommitteeName] = useState();
    const [committeeId, setCommitteeId] = useState('');
    const [committees, setCommittees] = useState([]);
    const [editorData, setEditorData] = useState('');
    const [selectedPriority, setSelectedPriority] = useState(null);
    const [selectedCommittees, setSelectedCommittees] = useState([]);
    const [assignedCommittees, setAssignedCommittees] = useState([]);

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
        Action.getIssueDetail(id).then((data) => {
            if(data.success == true)
            {
                setIssue(data.data?.issueDetails);
                setCommitteeName(data.data?.issueDetails?.committee?.name);
                setCommitteeId(data.data?.issueDetails?.committee?.id);
                setEditorData(data.data?.issueDetails?.name)
                let priority = priorityOptions.find(item => item.value == data.data?.issueDetails.priority_detail_id);
                setFieldValue("priority", priority.value);
                setSelectedPriority(priority);
                let assignedCommittees = data.data?.issueDetails.assigned_type_id;
                setSelectedCommittees(assignedCommittees.split(","))
            }
        }).catch((error) => {
            toast.error('unable to get issue type detail');
            console.log(error);
        });
    }, [])

    useEffect(() => {
        const newEvenNumbers = [];
        if(committees.length > 0) {
            setFieldValue("committees", selectedCommittees); 
            committees.forEach(committee => {
                if(selectedCommittees.includes(committee.value.toString())) {
                    console.log(committee);
                    newEvenNumbers.push(committee)
                }
            })

        }
        setAssignedCommittees(newEvenNumbers);
    }, [selectedCommittees])

    const handleCommitte = (option) => {
        setAssignedCommittees(option);
    }

    const handlePriority = (option) => {
        setSelectedPriority(option);
    }
    const formik = useFormik({
        initialValues:{
            status:1,
            name:"", 
            priority:"", 
            committees:[]
        },
	    validationSchema: issueschema,
	    onSubmit: async (values) => {
            console.log(values);
            setLoader(true)
            const f = new FormData();
            f.append('issue_id', id);
            f.append('committee_id', committeeId);
			f.append('name', values.name);
			f.append('priority', values.priority);
			f.append('status', values.status);
            values.committees.forEach((item) => f.append("committees[]", item))
            Action.editIssue(f).then((data) => {
                console.log(data);
                if(data.success == true)
                {
                    console.log('-----=',data);
                    setLoader(false);
                    toast.success(data.message);
                    router.push('/admin/issue/'+issue.issue_type_detail_id);

                }
            }).catch((error) => {
                toast.error('unable to update issue');
                console.log(error);
                setLoader(false);
            });
		},
	});
	
    const { errors, touched, setFieldValue, handleSubmit } = formik;

    console.log('------->', editorData);
    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5">Edit Issue</h1>
            </div>
            <div className="flex justify-start text-center">
                <Link href={`/admin/issue/${issue.issue_type_detail_id}`} className="w-44 py-2 px-6 bg-primary flex items-center justify-center font-normal">Back</Link>
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
                                    data={editorData}
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
                                value={selectedPriority}
                                placeholder="Please select priority"
                                options={priorityOptions}
                                onChange={(selectedOption) => { 
                                    setFieldValue("priority", selectedOption.value); 
                                    handlePriority(selectedOption);
                                }}
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
                                value={assignedCommittees}
                                options={committees}
                                onChange={(selectedOption) => { 
                                    //console.log(selectedOption);
                                    setFieldValue("committees", selectedOption.map((option) => option.value)); 
                                    handleCommitte(selectedOption);
                                }}
                            />
                            {errors?.committees && touched?.committees && <span className="text-sm text-[red]">{errors?.committees}</span>}
                        </label>
                        {
                            (loader == true) ? <button type="submit" className="flex items-center justify-center bg-primary mt-4 px-16 py-2 rounded text-white w-[220px]"><LuLoader2 size={20} className="loading-icon"/></button> : <button type='submit' className="bg-primary py-2 px-8 text-sm text-[#002855] font-medium mt-4">Update</button>
                        }
                    </form>
                </div>
            </div>
        </>
    )
}

export default EditIssue;