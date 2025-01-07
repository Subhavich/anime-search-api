import React, { useState } from "react";

interface PaginationProps {
  totalPages: number; // Total number of pages available
  currentPage?: number; // The currently active page (initial)
  onPageChange?: (page: number) => void; // Callback for when a page changes
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage = 1,
  onPageChange,
}) => {
  const maxVisiblePages = 2; // Maximum number of pages to display at once
  const [current, setCurrent] = useState<number>(currentPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return; // Prevent invalid pages
    setCurrent(page);
    onPageChange?.(page); // Call parent-provided callback
  };

  // Calculate visible page numbers
  const startPage = Math.max(1, current - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex items-center justify-center gap-2 p-4">
      {/* Go to First Page */}
      <button
        className={`px-3 py-1 rounded-md ${
          current === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-500 hover:bg-blue-100"
        }`}
        onClick={() => handlePageChange(1)}
        disabled={current === 1}
      >
        {"<<"}
      </button>

      {/* Go to Previous Page */}
      <button
        className={`px-3 py-1 rounded-md ${
          current === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-500 hover:bg-blue-100"
        }`}
        onClick={() => handlePageChange(current - 1)}
        disabled={current === 1}
      >
        {"<"}
      </button>

      {/* Page Buttons */}
      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-1 rounded-md ${
            page === current
              ? "bg-blue-500 text-white"
              : "text-blue-500 hover:bg-blue-100"
          }`}
          onClick={() => {
            handlePageChange(page);
          }}
        >
          {page}
        </button>
      ))}

      {/* Go to Next Page */}
      <button
        className={`px-3 py-1 rounded-md ${
          current === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-500 hover:bg-blue-100"
        }`}
        onClick={() => handlePageChange(current + 1)}
        disabled={current === totalPages}
      >
        {">"}
      </button>

      {/* Go to Last Page */}
      <button
        className={`px-3 py-1 rounded-md ${
          current === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-500 hover:bg-blue-100"
        }`}
        onClick={() => handlePageChange(totalPages)}
        disabled={current === totalPages}
      >
        {">>"}
      </button>
    </div>
  );
};

export default Pagination;
