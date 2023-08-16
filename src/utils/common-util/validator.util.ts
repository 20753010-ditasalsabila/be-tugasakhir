import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export default class ValidatorUtil {
  validateDateBetween(start: Date, end: Date): boolean {
    const startDate: dayjs.Dayjs = dayjs(start);
    const endDate: dayjs.Dayjs = dayjs(end);
    const isValid: boolean = startDate.isValid() && endDate.isValid();

    if (!isValid) return false;

    return isValid && endDate.isSameOrAfter(startDate);
  }
}
