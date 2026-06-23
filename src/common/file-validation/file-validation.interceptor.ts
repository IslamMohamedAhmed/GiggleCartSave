import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  constructor(private mainKey?: string) { 
    this.mainKey = mainKey;
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (!request.file && (!request.files || !request.files[`${this.mainKey}`] || request.files[`${this.mainKey}`].length === 0)) {
      throw new BadRequestException('Files are missing!!');
    }
    return next.handle();
  }
}
