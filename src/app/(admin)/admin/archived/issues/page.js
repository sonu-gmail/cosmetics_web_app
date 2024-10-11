"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Moment from 'react-moment';
import { FaUpload } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { GrPowerReset } from "react-icons/gr";
import Action from "../../../../lib/action";
import toast from "react-hot-toast";
import IssueSkeleton from "../../../../../components/skeleton/issue-skeleton";
import useDebounce from "../../../../hooks/useDebounce";
import Pagination from "../../../../../components/Pagination";

const ArchivedIssue = () => {
    const [loader, setLoader] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [issues, setIssues] = useState([]);
    const [sorting, setSorting] = useState('');
    const [committee, setCommittee] = useState('');
    const [committees, setCommittees] = useState([]);
    const [filterValues, setFilterValues] = useState({sval: '',stype: '', page:'', committee:''});
    const [fromItem, setFromItem] = useState(0)
    const [toItem, setToItem] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const debouncedValue = useDebounce(filterValues, 500);

    useEffect(() => {
        const queryString = new URLSearchParams(filterValues).toString();
        if (debouncedValue) {
            getArchivedIssueListing(queryString);
        }
    },[debouncedValue])

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
    console.log(committees);
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

    function handleCommitteFilter(e) {
        const { name, value } = e.target;
        setCommittee(value);
        const updatedValues = {
        ...filterValues,
        [name]: value,
        };
        setFilterValues(updatedValues);
    }

    const handleSearchAction = () => {
        const queryString = new URLSearchParams(filterValues).toString();
    }

    const handleResetAction = () => {
        const updatedValues = {
            ...filterValues,
            ['sval']: '',
            ['stype']: '',
            ['page']: '',
            ['committee']: '',
        };
        setFilterValues(updatedValues);
        setSearchValue('');
        setSorting('');
        setCommittee('')
        setCurrentPage(1);
    }

    const getArchivedIssueListing = (queryString) => {
        Action.getArchivedIssue(queryString).then((data) => {
            if(data.success == true)
            {
                setIssues(data.data.data);
                setFromItem(data.data?.from);
                setToItem(data.data?.to)
                setItemsPerPage(data.data?.per_page)
                setTotalItems(data.data?.total)
                setLoader(false);
            }
        }).catch((error) => {
            setLoader(false);
            toast.error('unable to get archived issue listing');
            console.log(error);
        });
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

        if(id == 4) {
            return 'Monitoring';
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

    const getIssueCommittee = (id) => {
        if(committees.length > 0) {
            const committee = committees.find(committee => committee.value === id);
            return committee.label
        }

        return null;
    }
    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5">Archived Issue</h1>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex">
                    <input 
                        type="text"
                        placeholder="Search"
                        name="sval"
                        value={searchValue}
                        onChange={handleSearch} 
                        className="focus:outline-none border-b py-2 px-2"
                    />
                    <select value={sorting} className="w-48 focus:outline-none py-2 px-4 border text-[#002855] font-light" name="stype" onChange={handleFilter}>
                        <option value=''>Filter</option>
                        <option value={`newest to oldest`}>Newest to Oldest</option>
                        <option value={`oldest to newest`}>Oldest to Newest</option>
                    </select>
                    <select value={committee} className="w-48 focus:outline-none py-2 px-4 border ml-1 text-[#002855] font-light" name="committee" onChange={handleCommitteFilter}>
                        <option value=''>committee</option>
                        {
                            committees.length > 0 && committees.map((committe, index) => (
                                <option value={committe.value} key={index}>{committe.label}</option>
                            ))
                        }
                    </select>
                    <button className="bg-primary px-4 py-2 ml-2 mr-2 text-white" onClick={handleSearchAction}><CiSearch size={18}/></button>
                    <button className="bg-primary px-4 py-2 ml-2 mr-2 text-white" onClick={handleResetAction}><GrPowerReset size={18}/></button>
                </div>
                <p className="text-[#555555] font-medium">Showing {fromItem} to {toItem} of {totalItems} Archived Issue</p>
            </div>
            {
                (loader == true) ? <IssueSkeleton /> :
                <div className="mt-8">
                    <table className="table-auto border w-full">
                        <thead className="bg-primary">
                            <tr>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Committee</th>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Issue</th>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Priority</th>
                                <th className="w-56 px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Brief Description</th>
                                <th className="w-auto px-4 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Actions</th>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">External Deadline</th>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Internal Deadline</th>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Status</th>                                                                                     
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Last Updated</th>
                                <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Final Document</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (issues.length <= 0) ? <tr><td className="text-center text-sm py-4" colSpan={9}>No Data Found</td></tr> : <>
                                {
                                    issues.map((issue, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="w-auto px-6 py-3 text-left text-sm font-medium text-[#002854] border-r border-b">{getIssueCommittee(issue?.issue_type_detail_id)}</td>
                                            <td className="w-auto px-6 py-3 text-left text-sm font-medium text-[#002854] border-r border-b"dangerouslySetInnerHTML={{ __html:issue.name}}></td>
                                            <td className="w-auto px-6 py-3 text-left text-sm font-medium text-[#002854] border-r border-b">{IssuePriority(issue.priority_detail_id)}</td>
                                            <td colSpan={6}>
                                                <table>
                                                <tbody>
                                                {
                                                    issue?.descriptions.map((desc, dIndex) => (
                                                        <tr key={dIndex}>
                                                            <td className="w-auto px-6 py-3 text-left text-sm font-medium text-[#002854] border-r" dangerouslySetInnerHTML={{ __html:desc?.description}}></td>
                                                            <td colSpan={5}>
                                                                <table>
                                                                    <tbody>
                                                                        {
                                                                            desc?.actions.map((action, aIndex) => (
                                                                                <tr key={aIndex}>
                                                                                    <td className="w-auto px-6 py-3 text-left text-sm font-medium text-[#002854] border-r border-b" dangerouslySetInnerHTML={{ __html:action?.action}}></td>
                                                                                    <td className="w-auto px-6 py-3 text-left text-sm font-medium text-[#002854] border-r border-b">{action?.external_deadline}</td>
                                                                                    <td className="w-auto px-6 py-3 text-left text-sm font-medium text-[#002854] border-r border-b">{action?.internal_deadline}</td>
                                                                                    <td className="w-auto px-6 py-3 text-left text-sm font-medium text-[#002854] border-r border-b">{ActionStatus(action?.status_detail_id)}</td>
                                                                                    <td className="w-auto px-6 py-3 text-left text-sm font-medium text-[#002854] border-r border-b">{action?.created_at}</td>
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
                                            <td className="w-auto px-6 py-3 text-center text-sm font-medium text-[#002854] border-r border-b"><FaUpload size={15}/></td>
                                        </tr>
                                    ))
                                }
                                </> 
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

export default ArchivedIssue;