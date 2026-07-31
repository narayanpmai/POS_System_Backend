export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function buildPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const totalPages = Math.ceil(total / safeLimit) || 1;

  return {
    items,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };
}
