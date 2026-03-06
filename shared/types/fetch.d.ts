export interface IParams<T = {}> {
  page?: number;
  limit?: number;
  sort?: keyof T;
  order?: "asc" | "desc";
  search?: string;
}

export interface IStatus<T = any> {
  statusCode: number;
  statusMessage: string;
  data?: T;
}
