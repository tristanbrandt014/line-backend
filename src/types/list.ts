import { IContext } from "./";

interface IListParams<F> {
  offset?: number;
  first?: number;
  filters: F;
}

interface IListResult<T> {
  total: number;
  results: T[];
}

export type ListQuery<T, F> = (
  args: IListParams<F>,
  context: IContext
) => Promise<IListResult<T>>;
