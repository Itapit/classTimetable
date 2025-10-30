import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import scheduleJson from './app/data/schedule.json';
import { SCHEDULE_DATA } from './app/timetable/schedule.token';

const scheduleData: unknown = (scheduleJson as any)?.default ?? scheduleJson;
// h
bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    { provide: SCHEDULE_DATA, useValue: scheduleData },
  ],
}).catch((err) => console.error(err));
