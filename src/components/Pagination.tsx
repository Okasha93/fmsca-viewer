import React from 'react';
import cn from '../components/cn';

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  startIndex: number;
  endIndex: number;
  total: number;
};

const Pagination = ({
  totalPages,
  currentPage,
  goToPage,
  nextPage,
  prevPage,
  startIndex,
  endIndex,
  total,
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <div className="flex justify-between items-center py-4">
      <p>
        Showing {startIndex + 1} to {endIndex + 1} of {total} entries
      </p>
      <ul className="flex gap-2">
        <li>
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={cn(
              'hover:bg-primary text-primary hover:text-white border w-10 h-10 flex items-center justify-center rounded-full border-primary',
              {
                'bg-primary text-white': currentPage === 1,
              }
            )}
          >
            &lt;
          </button>
        </li>
        {pages.map((page, i) => (
          <li key={i}>
            <button
              onClick={() => goToPage(page)}
              className={cn(
                'hover:bg-primary text-primary hover:text-white border w-10 h-10 flex items-center justify-center rounded-full border-primary',
                {
                  'bg-primary text-white': currentPage === page,
                }
              )}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={cn(
              'hover:bg-primary text-primary hover:text-white border w-10 h-10 flex items-center justify-center rounded-full border-primary',
              {
                'bg-primary text-white': currentPage === totalPages,
              }
            )}
          >
            &gt;
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
