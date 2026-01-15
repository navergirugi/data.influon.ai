import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'Internal server error';
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && (exceptionResponse as any).message) {
      const msg = (exceptionResponse as any).message;
      message = Array.isArray(msg) ? msg.join(', ') : msg;
    }

    // 에러 로그 출력
    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status}, Message: ${message}`,
    );

    response
      .status(status)
      .json({
        success: false,
        data: null,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
