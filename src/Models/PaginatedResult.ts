export interface PaginatedResult<T> {
    list: T[];
    totalCount: number;
}