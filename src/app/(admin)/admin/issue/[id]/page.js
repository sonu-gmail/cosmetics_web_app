"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import { PiFoldersDuotone } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { GrPowerReset } from "react-icons/gr";
import toast from "react-hot-toast";
import Action from "../../../../lib/action";
import { Tooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css'
import IssueSkeleton from "@/components/skeleton/issue-skeleton";
import Pagination from "../../../../../components/Pagination";
import useDebounce from "../../../../hooks/useDebounce";

const IssueTracker = ({ params }) => {
    
    const {id} = params;
    const [issueListing, setIssueLIsting] = useState([]);
    const [loader, setLoader] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [sorting, setSorting] = useState('');
    const [filterValues, setFilterValues] = useState({sval: '',stype: '', page:''});
    const [fromItem, setFromItem] = useState(0)
    const [toItem, setToItem] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const debouncedValue = useDebounce(filterValues, 500);

    useEffect(() => {
        const queryString = new URLSearchParams(filterValues).toString();
        if (debouncedValue) {
            getIssues(queryString);
        }
    }, [debouncedValue])

    function handleSearch(e) {
        const { name, value } = e.target;
        setSearchValue(value)
        const updatedValues = {
        ...filterValues,
        [name]: value,
        };

        setFilterValues(updatedValues);
    }
    
    function handleFilter(e) {
        const { name, value } = e.target;
        setSorting(value);
        const updatedValues = {
        ...filterValues,
        [name]: value,
        };
        setFilterValues(updatedValues);
    }

    const handleSearchAction = () => {
        const queryString = new URLSearchParams(filterValues).toString();
        getIssues(queryString);
    }

    const handleResetAction = () => {
        const updatedValues = {
            ...filterValues,
            ['sval']: '',
            ['stype']: '',
            ['page']: '',
        };
        setFilterValues(updatedValues);
        setSearchValue('');
        setSorting('');
        setCurrentPage(1);
    }

    const handlePageChange = (page) => {
        const updatedValues = {
            ...filterValues,
            ['page']: page,
        };
        setFilterValues(updatedValues);
        setCurrentPage(page);
    };

    const IssuePriority = (id) => {
        if(id == 1) {
            return 'High';
        }

        if(id == 2) {
            return 'Medium';
        }

        if(id == 3) {
            return 'Low';
        }
    };

    const ActionStatus = (id) => {
        if(id == 7) {
            return 'Open';
        }

        if(id == 8) {
            return 'Closed';
        }
    };

    const getIssues = (filter) => {
        Action.getIssueLIsting(id, filter).then((data) => {
            if(data.success == true)
            {
                console.log(data.data);
                setLoader(false);
                setIssueLIsting(data.data?.issue_details?.data);
                setFromItem(data.data?.issue_details?.from);
                setToItem(data.data?.issue_details?.to)
                setItemsPerPage(data.data?.issue_details?.per_page)
                setTotalItems(data.data?.issue_details?.total)
            }
        }).catch((error) => {
            toast.error('unable to get issue  listing');
            setLoader(false);
            console.log(error);
        });
    }

    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5">Issues</h1>
            </div>
            <div className="flex justify-end text-center">
                <Link href={`create/${id}`} className="w-44 py-2 px-6 bg-primary flex items-center justify-center font-medium"><FaPlus size={16} className="mr-1" />Create</Link>
            </div>
            <div className="flex justify-between items-center">
            <div className="flex">
                <input 
                    type="text"
                    name="sval"
                    placeholder="Search"
                    value={searchValue}
                    onChange={handleSearch} 
                    className="focus:outline-none border-b py-2 px-2"
                />
                <select name="stype" value={sorting} className="w-48 focus:outline-none py-2 px-4 border text-[#002855] font-light" onChange={handleFilter}>
                    <option value=''>Filter</option>
                    <option value={'name'}>Name</option>
                    <option value={'desc'}>Description</option>
                    <option value={'action'}>Action</option>
                </select>
                <button className="bg-primary px-4 py-2 ml-2 mr-2 text-white" onClick={handleSearchAction}><CiSearch size={18}/></button>
                <button className="bg-primary px-4 py-2 ml-2 mr-2 text-white" onClick={handleResetAction}><GrPowerReset size={18}/></button>
            </div>
            <p className="text-[#555555] font-medium">Showing {fromItem} to {toItem} of {totalItems} Issues</p>
            </div>
            
            {
                (loader == true) ? <IssueSkeleton /> :
                <div className="mt-8">
                    <table className="table-auto border w-full">
                        <thead className="bg-primary">
                            <tr>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Issue</th>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Proprity</th>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Actions</th>
                                <th className="w-56 px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Brief Description</th>
                                <th className="w-auto px-4 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Actions</th>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Actions</th>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">External Deadline</th>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Internal Deadline</th>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Status</th>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Action</th>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Last Updated</th>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Archive</th>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Final Document</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (issueListing.length < 0) ? <tr></tr> : <>
                                {
                                    issueListing.map((issue, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="w-auto px-6 py-3 text-left text-sm font-medium text-[#002854] border-r border-b" dangerouslySetInnerHTML={{ __html:issue.name}}></td>
                                            <td className="w-auto px-6 py-3 text-left text-sm font-medium text-[#002854] border-r border-b">{IssuePriority(issue.priority_detail_id)}</td>
                                            <td className="w-auto px-6 py-3 text-left text-sm font-medium text-[#002854] border-r border-b">
                                                <Link href={`/admin/issue/desc/${issue.id}`}  data-tooltip-id="add-desc" data-tooltip-content="Add Issue Description" className="flex justify-center items-center py-2 px-2 hover:bg-primary hover:text-[#ffffff]">
                                                    <FaPlus/>
                                                    <Tooltip id="add-desc" />
                                                </Link>
                                                <Link href={`/admin/issue/edit/${issue.id}`} data-tooltip-id="edit-issue" data-tooltip-content="Edit Issue" className="flex justify-center items-center py-2 px-2 hover:bg-[#646464] hover:text-[#ffffff]">
                                                    <FaEdit />
                                                    <Tooltip id="edit-issue" />
                                                </Link>
                                            </td>
                                            <td className="w-auto text-left text-sm font-medium text-[#002854] border-r" colSpan={8}>
                                                <table>
                                                    <tbody>
                                                        {
                                                            issue?.descriptions.length > 0 && issue.descriptions.map((description, dIndex) => (
                                                                <tr key={dIndex} className="border-b last:border-none">
                                                                    <td className="w-56 px-6 py-3 text-sm text-[#002854] border-r" dangerouslySetInnerHTML={{ __html:description.description}}></td>
                                                                    <td className="w-auto px-4 py-3 border-r">
                                                                        <Link href={`/admin/issue/${issue.id}/description/${description.id}/action`}  data-tooltip-id="add-desc" data-tooltip-content="Add Issue Description Action" className="flex justify-center items-center py-2 px-2 hover:bg-primary hover:text-[#ffffff] w-12 m-auto">
                                                                            <FaPlus/>
                                                                            <Tooltip id="add-desc" />
                                                                        </Link>
                                                                        <Link href={`/admin/issue/edit/${issue.id}/description/${description.id}`} data-tooltip-id="edit-issue" data-tooltip-content="Edit Issue Description" className="flex justify-center items-center py-2 px-2 hover:bg-[#646464] hover:text-[#ffffff] w-12 m-auto">
                                                                            <FaEdit />
                                                                            <Tooltip id="edit-issue" />
                                                                        </Link>
                                                                    </td>
                                                                    <td className="w-auto text-left text-sm text-[#002854]" colSpan={6}>
                                                                        <table>
                                                                            <tbody>
                                                                                {
                                                                                    description?.actions.length > 0 && description.actions.map((action, aIndex) => (
                                                                                        <tr key={aIndex}>
                                                                                            <td className="w-auto px-6 py-3 border-r" dangerouslySetInnerHTML={{ __html:action.action}}></td>
                                                                                            <td className="w-auto px-6 py-3 border-r">{action.external_deadline}</td>
                                                                                            <td className="w-auto px-6 py-3 border-r">{action?.internal_deadline}</td>
                                                                                            <td className="w-auto px-6 py-3 border-r">{ActionStatus(action?.status_detail_id)}</td>
                                                                                            <td className="w-auto px-6 py-3 border-r">
                                                                                                <Link href={`/admin/issue/edit/${issue.id}/description/${description.id}/action/${action.id}`}>
                                                                                                    <FaEdit />
                                                                                                </Link>
                                                                                            </td>
                                                                                            <td className="w-auto px-6 py-3 border-r last:border-none">{action?.created_at}</td>
                                                                                        </tr>
                                                                                    ))
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            </td>
                                            <td className="w-auto px-6 py-3 text-left text-sm font-medium text-[#002854] border-r">
                                                <div className="flex justify-center items-center">
                                                    <PiFoldersDuotone size={25}/>
                                                </div>
                                            </td>
                                            <td className="w-auto px-6 py-3 text-left text-sm font-medium text-[#002854] border-r">
                                                <div className="flex justify-center items-center">
                                                    <FaUpload />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                                </> 
                            }
                            {
                                (issueListing.length == 0) && (
                                    <tr>
                                        <td colSpan={13} className="py-4 text-center text-sm">No Data Found</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    <div>
                        <Pagination 
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            }
        </>
    )
}

export default IssueTracker;