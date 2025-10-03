import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class UserDuplicateEmailFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const driverError: any = exception.driverError;
    if (driverError.code === 'ER_DUP_ENTRY') {
      return response.status(409).json({ error: 'User with this email already exists!' });
    }

    return response.status(500).json({ error: 'Database error occurred!' });
  }
}
