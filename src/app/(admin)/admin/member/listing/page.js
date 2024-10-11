"use client";
import { useState, useEffect } from "react";
import Action from "../../../../lib/action";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import { PiFoldersDuotone } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { GrPowerReset } from "react-icons/gr";
import toast from "react-hot-toast";
import MemberSkeleton from "../../../../../components/skeleton/member-skeleton";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Pagination from "../../../../../components/Pagination";
import useDebounce from "../../../../hooks/useDebounce";

const MemberListing = () => {
    const [open, setOpen] = useState(false)
    const [memberId, setMemberId] = useState('');
    const [members, setMembers] = useState([]);
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
            getMemmbers(queryString);
        }
    },[debouncedValue])

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
        getMemmbers(queryString);
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

    const getMemmbers = (filters) => {
        Action.getMembers(filters).then((data) => {
            console.log(data);
            if(data.success == true)
            {
                setMembers(data.data.data);
                setFromItem(data.data?.from);
                setToItem(data.data?.to)
                setItemsPerPage(data.data?.per_page)
                setTotalItems(data.data?.total)
                setLoader(false);
            }
        }).catch((error) => {
            toast.error('unable to get members listing');
            setLoader(false);
            console.log(error);
        });
    }

    const handleDialogBox = (id) => {
        setMemberId(id);
        setOpen(true);
    }

    const handleDeleteAction = () => {
        Action.deleteMember(memberId).then((data) => {
            if(data.success == true)
            {
                setOpen(false);
                setMemberId('');
            }
        }).catch((error) => {
            toast.error('unable to delete member');
            console.log(error);
            setOpen(false);
        });
    }
    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5">Members</h1>
            </div>
            <div className="flex justify-end text-center">
                <Link href={`/admin/member/create`} className="w-44 py-2 px-6 bg-primary flex items-center justify-center font-medium"><FaPlus size={16} className="mr-1" />Create</Link>
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
                    <select name="stype" value={sorting} className="w-48 focus:outline-none py-2 px-4 border text-[#002855] font-light" onChange={handleFilter}>
                        <option value=''>Sort By</option>
                        <option value={`first_name_asc`}>First Name Ascending</option>
                        <option value={`first_name_desc`}>First Name Desecding</option>
                        <option value={`last_name_asc`}>Last Name Ascending</option>
                        <option value={`last_name_desc`}>Last Name Desecding</option>
                    </select>
                    <button className="bg-primary px-4 py-2 ml-2 mr-2 text-white" onClick={handleSearchAction}><CiSearch size={18}/></button>
                    <button className="bg-primary px-4 py-2 ml-2 mr-2 text-white" onClick={handleResetAction}><GrPowerReset size={18}/></button>
                </div>
                <p className="text-[#555555] font-medium">Showing {fromItem} to {toItem} of {totalItems} Members</p>
            </div>
            <div className="mt-8">
                {
                    (loader == true) ? <MemberSkeleton /> : <>
                        <table className="table-auto border w-full">
                            <thead className="bg-primary">
                                <tr>
                                    <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">First Name</th>
                                    <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Last Name</th>
                                    <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Company / Association</th>
                                    <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Job Title</th>
                                    <th className="w-auto px-4 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Member of Committee</th>
                                    <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Email</th>
                                    <th className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854] uppercase border-r border-r-[#35a694]">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    members.length > 0 && members.map((member, index) => (
                                        <tr key={index}>
                                            <td className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854]">{member?.user.first_name}</td>
                                            <td className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854]">{member?.user.last_name}</td>
                                            <td className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854]">{member?.company}</td>
                                            <td className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854]">{member?.job_title}</td>
                                            <td className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854]">
                                                {
                                                    member?.member_committees.length > 0 && member?.member_committees.map((committee, cIndex) => (
                                                        <span className="block py-1 px-1" key={cIndex}>{committee?.committee.short_name}</span>
                                                    )) 
                                                }
                                            </td>
                                            <td className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854]">{member?.user.email}</td>
                                            <td className="w-auto px-6 py-3 text-left text-xs font-medium text-[#002854]">
                                                <Link href={`/admin/member/view/${member?.user.id}`} className="text-[#002854] block bg-primary text-center py-2 px-2 mb-2 text-sm rounded-sm">View</Link>
                                                <Link href={``} className="text-[#002854] block bg-primary text-center py-2 px-2 mb-2 text-sm rounded-sm" onClick={() => handleDialogBox(member?.id)}>Delete</Link>
                                                <Link href={`/admin/member/edit/${member?.user.id}`} className="text-[#002854] block bg-primary text-center py-2 px-2 mb-2 text-sm rounded-sm">Edit</Link>
                                            </td>
                                        </tr>
                                    ))
                                }
                                {
                                    ( members.length == 0) ? <>
                                        <tr>
                                            <td colSpan={7} className="px-6 py-3 text-center text-xs font-medium text-[#002854]">Data Not Found</td>
                                        </tr>
                                    </> : ''
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
                    </>
                }
            </div>
            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop transition className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"/>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                Delete account
                            </DialogTitle>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                Are you sure you want to delete your account ?
                                </p>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                            type="button"
                            onClick={() => handleDeleteAction()}
                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            data-autofocus
                            onClick={() => setOpen(false)}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                            Cancel
                        </button>
                        </div>
                    </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default MemberListing;