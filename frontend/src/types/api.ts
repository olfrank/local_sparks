export type ApiResponse<TData = unknown> = {
  status: number;
  data: TData;
};

export type ApiErrorData = unknown;

export type CallbackRequestPayload = {
  phone: string;
};
