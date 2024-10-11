"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Moment from 'react-moment';
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { GrPowerReset } from "react-icons/gr";
import Action from "../../../../lib/action";
import toast from "react-hot-toast";
import DocumentSkeleton from "../../../../../components/skeleton/document-skeleton";
import useDebounce from "../../../../hooks/useDebounce";
import Pagination from "../../../../../components/Pagination";

const ArchivedDocuments = () => {
    const [loader, setLoader] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [sorting, setSorting] = useState('');
    const [committee, setCommittee] = useState('');
    const [committees, setCommittees] = useState([]);
    const [documents, setDocuments] = useState([]);
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
            getArchivedDocumentListing(queryString);
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

    const getFileExtension = (url) => {
        // Use URL constructor to handle complex URLs
        const pathname = new URL(url).pathname;
        // Extract the extension from the last segment of the path
        return pathname.substring(pathname.lastIndexOf('.') + 1);
    }

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

    const getArchivedDocumentListing = (queryString) => {
        Action.getArchivedDocuments(queryString).then((data) => {
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
            toast.error('unable to get archived document listing');
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
    return (
        <>
            <div className="border-b mb-8">
                <h1 className="text-3xl text-[#002855] font-light pb-5">Archived Document Library</h1>
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
                <p className="text-[#555555] font-medium">Showing {fromItem} to {toItem} of {totalItems} Archived Document Libray</p>
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
                                            <span className="block text-[#646464] text-sm font-light">
                                            {
                                                document?.doclib_committees.map((committe, cIndex) => (
                                                    <span key={cIndex}>{committe?.committee?.short_name}</span>
                                                ))
                                            }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="">
                                        <Link href={`/admin/archived/documents/${document?.id}`} className="py-2 px-4 bg-primary text-[#002855] w-auto inline-block text-center rounded ml-2 mr-2">View</Link>
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
                    </>
                }
            </div>
        </>
    )
}

export default ArchivedDocuments;