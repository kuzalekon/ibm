import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ToPositiveInteger implements PipeTransform {
  transform(value: any) {
    return value ? Math.abs(Number.parseInt(value, 10)) : undefined;
  }
}
