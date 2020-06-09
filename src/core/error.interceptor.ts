import { Injectable, NestInterceptor, ExecutionContext, BadGatewayException, CallHandler, NotFoundException } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { EntityNotFoundError } from './errors/entityNotFound.error'

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        if (err instanceof EntityNotFoundError) {
          return throwError(new NotFoundException(err.message))
        }
        return throwError(err)
      }),
    )
  }
}
