"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type TodosPaginationProps = {
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
};

export function TodosPagination({
  currentPage,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
}: TodosPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => hasPreviousPage && onPageChange(currentPage - 1)}
            className={
              !hasPreviousPage
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {/* First page */}
        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => onPageChange(1)}
              className="cursor-pointer"
            >
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Ellipsis before current range */}
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Previous page */}
        {hasPreviousPage && (
          <PaginationItem>
            <PaginationLink
              onClick={() => onPageChange(currentPage - 1)}
              className="cursor-pointer"
            >
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Current page */}
        <PaginationItem>
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>

        {/* Next page */}
        {hasNextPage && (
          <PaginationItem>
            <PaginationLink
              onClick={() => onPageChange(currentPage + 1)}
              className="cursor-pointer"
            >
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Ellipsis after current range */}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Last page */}
        {currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => onPageChange(totalPages)}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => hasNextPage && onPageChange(currentPage + 1)}
            className={
              !hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
