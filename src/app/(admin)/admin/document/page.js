"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Moment from 'react-moment';
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { GrPowerReset } from "react-icons/gr";
import Action from "../../../lib/action";
import toast from "react-hot-toast";
import DocumentSkeleton from "../../../../components/skeleton/document-skeleton";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import useDebounce from "../../../hooks/useDebounce";
import Pagination from "../../../../components/Pagination";

const DocumentLiting = () => {
    const [open, setOpen] = useState(false);
    const [isArchive, setIsArchive] = useState(false);
    const [loader, setLoader] = useState(true);
    const [documentId, setDocumentId] = useState('');
    const [committees, setCommittees] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [sorting, setSorting] = useState('');
    const [committee, setCommittee] = useState('');
    const [filterValues, setFilterValues] = useState({sval: '',stype: '', page:'', committee:''});
    const [fromItem, setFromItem] = useState(0)
    const [toItem, setToItem] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const debouncedValue = useDebounce(filterValues, 500);

    // useEffect(() => {
    //     Action.getDocuments().then((data) => {
    //         if(data.success == true)
    //         {
    //             setDocuments(data.data.data);
    //             setLoader(false);
    //         }
    //     }).catch((error) => {
    //         setLoader(false);
    //         toast.error('unable to get document listing');
    //         console.log(error);
    //     });
    // },[documentId])
    useEffect(() => {
        const queryString = new URLSearchParams(filterValues).toString();
        if (debouncedValue) {
            getDocumentListing(queryString);
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
        getArchivedDocumentListing(queryString);
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

    const getDocumentListing = (queryString) => {
        Action.getDocuments(queryString).then((data) => {
            if(data.success == true)
            {
                setDocuments(data.data.data);
                setFromItem(data.data?.from);
                setToItem(data.data?.to)
                setItemsPerPage(data.data?.per_page)
                setTotalItems(data.data?.total)
                setLoader(false);
            }
        }).catch((error) => {
            setLoader(false);
            toast.error('unable to get document listing');
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

    const getFileExtension = (url) => {
        // Use URL constructor to handle complex URLs
        const pathname = new URL(url).pathname;
        // Extract the extension from the last segment of the path
        return pathname.substring(pathname.lastIndexOf('.') + 1);
    }

    const handleDialogBox = (id) => {
        setDocumentId(id);
        setOpen(true);
    }

    const handleArchiveDialogBox = (id) => {
        setDocumentId(id);
        setIsArchive(true);
    }

    const handleDeleteAction = () => {
        Action.deleteDocument(documentId).then((data) => {
            if(data.success == true)
            {
                setOpen(false);
                setDocumentId('');
                toast.success('Document deleted successfully!');
            }
        }).catch((error) => {
            toast.error('unable to delete document');
            console.log(error);
            setOpen(false);
        });
    }

    const handleArchiveAction = () => {
        Action.archiveDocument(documentId).then((data) => {
            if(data.success == true)
            {
                setIsArchive(false);
                setDocumentId('');
                toast.success('Document archived successfully!');
            }
        }).catch((error) => {
            toast.error('unable to archive document');
            console.log(error);
            setIsArchive(false);
        });
    }

    const handleDownloadAction = (file) => {
        const anchor = document.createElement('a');
        anchor.href = file;
        anchor.target = "_blank";
        anchor.download = 'demo';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5">Document Library</h1>
            </div>
            <div className="flex justify-end text-center">
                <Link href={`/admin/document/create`} className="w-44 py-2 px-6 bg-primary flex items-center justify-center font-medium"><FaPlus size={16} className="mr-1" />Create</Link>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex">
                    <input 
                        type="text"
                        name="sval"
                        value={searchValue}
                        onChange={handleSearch} 
                        placeholder="Search" 
                        className="focus:outline-none border-b py-2 px-2"
                    />
                    <select value={sorting} name="stype" className="w-48 focus:outline-none py-2 px-4 border text-[#002855] font-light" onChange={handleFilter}>
                        <option value=''>Filter</option>
                        <option value={`newest to oldest`}>Newest to Oldest</option>
                        <option value={`oldest to newest`}>Oldest to Newest</option>
                    </select>
                    <select value={committee} name="committee" className="w-48 focus:outline-none py-2 px-4 border ml-1 text-[#002855] font-light" onChange={handleCommitteFilter}>
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
                <p className="text-[#555555] font-medium">Showing {fromItem} to {toItem} of {totalItems} Document Libray</p>
            </div>
            <div className="mt-8">
                {
                    (loader == true) ? <DocumentSkeleton /> : <>
                        {
                            (documents.length > 0) ? <>
                                {
                                    documents.map((document, index) => (
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
                                                <Link href={`/admin/document/edit/${document?.id}`} className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2">Edit</Link>
                                                <Link href={`/admin/document/comment/${document?.id}`} className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2">Comment</Link>
                                                <Link href="" className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2" onClick={() => handleDownloadAction(document?.file)}>Download</Link>
                                                <Link href={`/admin/document/notification/${document?.id}`} className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2">Notification</Link>
                                                <Link href="" className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2" onClick={() => handleArchiveDialogBox(document?.id)}>Archive</Link>
                                                <Link href="" className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2" onClick={() => handleDialogBox(document?.id)}>Delete</Link>
                                            </div>
                                        </div>
                                    ))
                                }
                                <div>
                                    <Pagination 
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                        currentPage={currentPage}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            
                            </> : <>
                            <div className="bg-[#C1DFE0] py-4 px-4 flex justify-between items-center mb-4 rounded">
                                <div className="flex flex-1">No Data Found</div>
                            </div>
                            </>
                        }
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
                                Delete document
                            </DialogTitle>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                Are you sure you want to delete document ?
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
            <Dialog open={isArchive} onClose={setIsArchive} className="relative z-10">
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
                                Archive document
                            </DialogTitle>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                Are you sure you want to archive document ?
                                </p>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                            type="button"
                            onClick={() => handleArchiveAction()}
                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            data-autofocus
                            onClick={() => setIsArchive(false)}
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

export default DocumentLiting;