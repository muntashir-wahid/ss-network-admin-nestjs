import { Injectable } from '@nestjs/common';
import {
  ApiResponse,
  PaginatedResponse,
} from './interfaces/response-formatter.interface';

@Injectable()
export class ResponseFormatterService {
  /**
   * Format paginated response
   */
  formatPaginatedResponse<T>(
    data: T[],
    page: number,
    perPage: number,
    total: number,
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / perPage);
    const nextPage = page * perPage < total ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      status: 'success',
      data,
      meta: {
        page,
        perPage,
        total,
        totalPages,
        nextPage,
        prevPage,
      },
    };
  }

  /**
   * Format success response
   */
  formatSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
      status: 'success',
      data,
      ...(message && { message }),
    };
  }

  /**
   * Format error response
   */
  formatErrorResponse(message: string, statusCode?: number) {
    return {
      status: 'error',
      message,
      ...(statusCode && { statusCode }),
    };
  }
}
