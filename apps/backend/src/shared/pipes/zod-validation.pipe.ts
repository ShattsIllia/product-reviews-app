import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(data: unknown) {
    const result = this.schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join('.') || 'root',
        message: err.message,
      }));
      throw new BadRequestException({
        message: 'Validation failed',
        errors,
      });
    }

    return result.data;
  }
}
