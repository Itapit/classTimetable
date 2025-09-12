import { InjectionToken } from '@angular/core';
import { TimetableRoot } from './models/timetable';

export const SCHEDULE_DATA = new InjectionToken<TimetableRoot>('SCHEDULE_DATA');
