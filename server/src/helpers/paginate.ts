interface PaginationParams {
  page?: string;
  per_page?: string;
}

interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  perPage: number;
}

export function getPagination({
  page = "1",
  per_page = "12",
}: PaginationParams): PaginationResult {
  const currentPage = Math.max(parseInt(page), 1);
  const perPage = Math.max(parseInt(per_page), 1);

  return {
    skip: (currentPage - 1) * perPage,
    take: perPage,
    page: currentPage,
    perPage,
  };
}
