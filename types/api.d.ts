type ApiResponseData<T> = {
  status: 'ok' | 'error';
  error?: string;
  data?: T;
}