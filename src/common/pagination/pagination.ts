export declare class PaginatedResult<T> {
  page: number
  pageSize: number
  totalRecords: number
  data: T[]
}

export class Pagination {
  static of(page: number, pageSize: number, totalRecords: number, dto: any) {
    return {
      page,
      pageSize,
      totalRecords,
      data: dto
    }
  }
}
