import { useState, useEffect } from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => 
{
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        setTotalPages(Math.ceil(totalItems / itemsPerPage));
    }, [totalItems, itemsPerPage]);

    const handleClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex items-center justify-end gap-2 mt-5">
            <button 
                onClick={() => handleClick(currentPage - 1)} 
                disabled={currentPage === 1}
                className="py-3 px-4 border-0 bg-[#f0f0f0] cursor-pointer disabled:opacity-50"
                >
                Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                    <button
                    key={page}
                    onClick={() => handleClick(page)}
                    className={`py-2 px-4 border-0 ${currentPage === page ? 'bg-primary text-white' : ''}`}
                    >
                    {page}
                    </button>
                );
            })}

            <button 
                onClick={() => handleClick(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="py-3 px-4 border-0 bg-[#f0f0f0] cursor-pointer disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
