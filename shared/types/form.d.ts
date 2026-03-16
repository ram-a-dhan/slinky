import type { FormResolverOptions } from "@primevue/forms";

export interface IFormResolverReturn<T extends object> {
  errors: {
    [key in keyof T]: { message: string }[];
  };
}

export type IFormResolver<T extends object> = ({ values }: FormResolverOptions) => IFormResolverReturn<T>;
