import { Injectable } from '@angular/core';

export type DayName =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday';
export interface RawSlot {
  time: string;
  subject: string;
  instructor?: string;
  room?: string;
}
export interface RawGroup {
  name: string;
  schedule: Record<DayName, RawSlot[]>;
}
export interface GroupsFile {
  groups: RawGroup[];
}

export type TimetableEntry = {
  start: string;
  end: string;
  subject: string;
  teacher?: string;
  room?: string;
};
export type Group = {
  name: string;
  entriesByDay: Record<DayName, TimetableEntry[]>;
};

@Injectable({ providedIn: 'root' })
export class JsonTimetableService {
  async load(url = '/timetable.json'): Promise<Group[]> {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok)
      throw new Error(
        `Failed to fetch ${url}: ${res.status} ${res.statusText}`,
      );
    const data = (await res.json()) as GroupsFile;

    const groups: Group[] = data.groups.map((g) => {
      const entriesByDay: Record<DayName, TimetableEntry[]> = {
        Sunday: [],
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
      };
      (Object.keys(g.schedule) as DayName[]).forEach((day) => {
        entriesByDay[day] = (g.schedule[day] || [])
          .map((s) => {
            const { start, end } = this.splitRange(s.time);
            return {
              start,
              end,
              subject: s.subject,
              teacher: s.instructor || undefined,
              room: s.room || undefined,
            };
          })
          .sort((a, b) => a.start.localeCompare(b.start));
      });
      return { name: g.name, entriesByDay };
    });

    return groups;
  }

  private splitRange(range: string): { start: string; end: string } {
    // Accept "HH:MM-HH:MM" (with optional spaces)
    const m = range.trim().match(/^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/);
    if (!m) return { start: '00:00', end: '00:00' };
    const norm = (s: string) => {
      const [h, mm] = s.split(':').map(Number);
      const hh = h % 24;
      return `${hh < 10 ? '0' : ''}${hh}:${mm < 10 ? '0' : ''}${mm}`;
    };
    return { start: norm(m[1]), end: norm(m[2]) };
  }
}
