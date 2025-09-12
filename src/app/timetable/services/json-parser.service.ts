import { Inject, Injectable } from '@angular/core';
import {
  DayOfWeek,
  Group,
  GroupViewByPeriods,
  PeriodTemplate,
  ResolvedCell,
  TimetableRoot,
  ScheduleEntry,
  PeriodRowT,
} from '../models/timetable';
import { SCHEDULE_DATA } from '../schedule.token';

const DAY_ORDER: DayOfWeek[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

@Injectable({ providedIn: 'root' })
export class TimetableService {
  private data: TimetableRoot;

  constructor(@Inject(SCHEDULE_DATA) injected: unknown) {
    if (!isObject(injected)) {
      throw new Error(
        'SCHEDULE_DATA is not an object. Check main.ts provider.',
      );
    }
    if (!Array.isArray((injected as any).periodTemplates)) {
      throw new Error('SCHEDULE_DATA.periodTemplates missing or not array.');
    }
    if (!isObject((injected as any).classes)) {
      throw new Error('SCHEDULE_DATA.classes missing or not object.');
    }
    if (!Array.isArray((injected as any).groups)) {
      throw new Error('SCHEDULE_DATA.groups missing or not array.');
    }
    this.data = injected as unknown as TimetableRoot;
  }

  /** Build transposed view: periods as rows, days as columns, with class colors resolved */
  getGroupViewByPeriods(groupId: string): GroupViewByPeriods {
    const group = this.findGroup(this.data.groups, groupId);
    const template = this.findTemplate(
      this.data.periodTemplates,
      group.templateId,
    );

    // Sort periods by time
    const periodsSorted = [...template.periods].sort(
      (a, b) => this.timeToMin(a.start) - this.timeToMin(b.start),
    );

    const allowedDays = (
      group.applyTemplateToDays?.length ? group.applyTemplateToDays : DAY_ORDER
    ).slice();

    // day -> (periodId -> ScheduleEntry)
    const dayMap = new Map<DayOfWeek, Map<string, ScheduleEntry>>();
    for (const d of group.week) {
      if (!allowedDays.includes(d.day)) continue;
      const m = new Map<string, ScheduleEntry>();
      for (const c of d.classes) m.set(c.periodId, c);
      dayMap.set(d.day, m);
    }

    const rows: PeriodRowT[] = periodsSorted.map((p) => {
      const cells: Record<DayOfWeek, ResolvedCell | null> = {} as any;
      for (const day of allowedDays) {
        const m = dayMap.get(day);
        const entry = m?.get(p.id);
        if (!entry) {
          cells[day] = null;
          continue;
        }
        const def = this.data.classes[entry.classId];
        if (!def) {
          // Unknown classId; still render room/notes if you want
          cells[day] = null;
          continue;
        }
        cells[day] = {
          subject: def.subject,
          teacher: def.teacher,
          color: def.color,
          room: entry.room,
          notes: entry.notes,
        };
      }
      return {
        periodId: p.id,
        title: p.name ?? p.id,
        start: p.start,
        end: p.end,
        cells,
      };
    });

    return {
      groupId: group.id,
      groupLabel: group.label,
      templateLabel: template.label,
      dayHeaders: allowedDays as DayOfWeek[],
      rows,
    };
  }

  // ---- helpers ----
  private findGroup(groups: Group[], id: string) {
    const g = groups.find((x) => x.id === id);
    if (!g) throw new Error(`Group '${id}' not found in schedule.json`);
    return g;
  }

  private findTemplate(templates: PeriodTemplate[], id: string) {
    const t = templates.find((x) => x.id === id);
    if (!t)
      throw new Error(`Period template '${id}' not found in schedule.json`);
    return t;
  }

  private timeToMin(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  }

  getGroupIds(): { id: string; label: string }[] {
    return this.data.groups.map((g) => ({ id: g.id, label: g.label }));
  }
}
