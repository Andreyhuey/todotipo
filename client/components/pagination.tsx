import { Button } from "@/components/ui/button";
import ShowView from "./show-view";
import { JSX } from "react";
import { MoveRight, MoveLeft } from "lucide-react";

interface PaginationProps {
  ellipsis?: boolean;
  currentPage: number;
  lastPage: number;
  onPageChange: (currentPage: number) => void;
}

export const Pagination = ({
  currentPage,
  lastPage,
  onPageChange,
  ellipsis,
}: PaginationProps) => {
  const renderPageNumbers = () => {
    const pageNumbers: JSX.Element[] = [];

    if (ellipsis) {
      if (lastPage <= 6) {
        // If there are 6 or fewer pages, show all currentPage numbers
        for (let i = 0; i < lastPage; i++) {
          pageNumbers.push(
            <Button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`p-2 rounded-full h-[30px] w-[30px] bg-white text-[#777A88] ${
                i + 1 === currentPage ? " bg-light-gray text-primary-400" : ""
              }`}
            >
              {i + 1}
            </Button>
          );
        }
      } else {
        // Show the first 3 pages
        for (let i = 0; i < 3; i++) {
          pageNumbers.push(
            <Button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`p-2 rounded-full h-[30px] w-[30px] bg-white text-[#777A88] ${
                i + 1 === currentPage ? " bg-light-gray text-primary-400" : ""
              }`}
            >
              {i + 1}
            </Button>
          );
        }

        // Add ellipsis if the current currentPage is beyond the first 4
        if (currentPage > 5) {
          pageNumbers.push(<span key="ellipsis1">...</span>);
        }

        // Show pages around the current currentPage
        for (
          let i = Math.max(4, currentPage - 1);
          i <= Math.min(currentPage + 1, lastPage - 3);
          i++
        ) {
          pageNumbers.push(
            <Button
              key={i}
              onClick={() => onPageChange(i)}
              className={`p-2 rounded-full h-[30px] w-[30px] bg-white text-[#777A88] ${
                i === currentPage ? " bg-light-gray text-primary-400" : ""
              }`}
            >
              {i}
            </Button>
          );
        }

        // Add ellipsis if the current currentPage is not near the end
        if (currentPage < lastPage - 4) {
          pageNumbers.push(<span key="ellipsis2">...</span>);
        }

        // Show the last 3 pages
        for (let i = lastPage - 2; i <= lastPage; i++) {
          pageNumbers.push(
            <Button
              key={i}
              onClick={() => onPageChange(i)}
              className={`p-2 rounded-[8px] h-[30px] w-[30px] bg-white text-[#777A88] ${
                i === currentPage ? " bg-light-gray text-primary-400" : ""
              }`}
            >
              {i}
            </Button>
          );
        }
      }

      return pageNumbers;
    } else {
      if (lastPage <= 6) {
        // If there are 6 or fewer pages, show all currentPage numbers
        for (let i = 0; i < lastPage; i++) {
          pageNumbers.push(
            <Button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`p-2 rounded-[100px] h-[30px] w-[30px] bg-white text-[#777A88] ${
                i + 1 === currentPage && "bg-black-100 text-white"
              }`}
            >
              {i + 1}
            </Button>
          );
        }
      } else {
        // Show the first 3 pages
        for (let i = 0; i < 3; i++) {
          pageNumbers.push(
            <Button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`p-2 rounded-[100px] h-[30px] w-[30px] bg-white text-[#777A88] ${
                i + 1 === currentPage && "bg-black-100 text-white"
              }`}
            >
              {i + 1}
            </Button>
          );
        }

        // Add ellipsis if the current currentPage is beyond the first 4
        if (currentPage > 5) {
          pageNumbers.push(<span key="ellipsis1">...</span>);
        }

        // Show pages around the current currentPage
        for (
          let i = Math.max(4, currentPage - 1);
          i <= Math.min(currentPage + 1, lastPage - 3);
          i++
        ) {
          pageNumbers.push(
            <Button
              key={i}
              onClick={() => onPageChange(i)}
              className={`p-2 rounded-[100px] h-[30px] w-[30px] bg-white text-[#777A88] ${
                i + 1 === currentPage && "bg-black-100 text-white"
              }`}
            >
              {i}
            </Button>
          );
        }

        // Add ellipsis if the current currentPage is not near the end
        if (currentPage < lastPage - 4) {
          pageNumbers.push(<span key="ellipsis2">...</span>);
        }

        // Show the last 3 pages
        for (let i = lastPage - 2; i <= lastPage; i++) {
          pageNumbers.push(
            <Button
              key={i}
              onClick={() => onPageChange(i)}
              className={`p-2 rounded-[100px] h-[30px] w-[30px] bg-white text-[#777A88] ${
                i + 1 === currentPage && "bg-black-100 text-white"
              }`}
            >
              {i}
            </Button>
          );
        }
      }

      return pageNumbers;
    }
  };

  return (
    <>
      <ShowView when={!ellipsis}>
        <div className="flex items-center gap-5 justify-end p-5 overflow-x-auto">
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-2 rounded-[100px] border-brand-gray border bg-white text-black disabled:bg-white"
          >
            <MoveLeft name="dashed-arrow-left" className="h-[20px] w-[20px]" />
            <p>Previous</p>
          </Button>
          <div className="flex items-center gap-4">{renderPageNumbers()}</div>
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= lastPage}
            className="flex items-center gap-2 rounded-[100px] border-brand-gray border bg-white text-black disabled:bg-white"
          >
            <p>Next</p>
            <MoveRight className="h-[20px] w-[20px]" />
          </Button>
        </div>
      </ShowView>

      <ShowView when={!!ellipsis}>
        <div className="flex items-center gap-5 justify-between p-5 overflow-x-auto">
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-2 rounded-[1000px] border-[#D0D5DD] border bg-white text-black disabled:bg-white"
          >
            <p>Previous</p>
            <MoveLeft name="dashed-arrow-left" className="h-[20px] w-[20px]" />
          </Button>
          <div className="flex items-center gap-4">{renderPageNumbers()}</div>
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= lastPage}
            className="flex items-center gap-2 rounded-[1000px] border-[#D0D5DD] border bg-white text-black disabled:bg-white"
          >
            <p>Next</p>
            <MoveRight className="h-[20px] w-[20px]" />
          </Button>
        </div>
      </ShowView>
    </>
  );
};
