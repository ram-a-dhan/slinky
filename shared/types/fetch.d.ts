export interface IParams<T = {}> {
  page?: number;
  size?: number;
  sort?: keyof T;
  order?: "asc" | "desc";
  search?: string;
}

export type IRes<T = any> = T extends void ? {
  statusCode: number;
  statusMessage: string;
} : {
  statusCode: number;
  statusMessage: string;
  data: T;
}

export type IResPage<T = any> = T extends void ? {
  statusCode: number;
  statusMessage: string;
} : {
  statusCode: number;
  statusMessage: string;
  data: T;
  paging: IPaging;
}

export interface IPaging {
  page: number;
  size: number;
}