type ApiResponseData<T> = {
  status: 'ok' | 'error';
  error?: string;
  data?: T;
}

type PaginationData = {
  currentPage: number;
  nextPage: number | null;
}

type LoadMoreResult = {
  hasMore: boolean;
}