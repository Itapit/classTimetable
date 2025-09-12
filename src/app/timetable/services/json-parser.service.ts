import { Inject, Injectable } from '@angular/core';
import {
  DayOfWeek,
  Group,
  GroupView,
  PeriodHeader,
  PeriodTemplate,
  TimetableRoot,
  ClassEntry,
  DayRow,
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

@Injectable({ providedIn: 'root' })
export class TimetableService {
  constructor(@Inject(SCHEDULE_DATA) private data: TimetableRoot) {}

  getGroupIds(): { id: string; label: string }[] {
    return this.data.groups.map((g) => ({ id: g.id, label: g.label }));
  }

  getGroupView(groupId: string): GroupView {
    const group = this.findGroup(this.data.groups, groupId);
    const template = this.findTemplate(
      this.data.periodTemplates,
      group.templateId,
    );

    const periodsSorted = [...template.periods].sort(
      (a, b) => this.timeToMin(a.start) - this.timeToMin(b.start),
    );

    const headers: PeriodHeader[] = periodsSorted.map((p) => ({
      id: p.id,
      title: p.name ?? p.id,
      start: p.start,
      end: p.end,
    }));

    const allowedDays = new Set(
      group.applyTemplateToDays?.length ? group.applyTemplateToDays : DAY_ORDER,
    );

    const dayMap = new Map<DayOfWeek, Map<string, ClassEntry>>();
    for (const d of group.week) {
      if (!allowedDays.has(d.day)) continue;
      const m = new Map<string, ClassEntry>();
      for (const c of d.classes) m.set(c.periodId, c);
      dayMap.set(d.day, m);
    }

    const rows: DayRow[] = DAY_ORDER.filter((d) => allowedDays.has(d)).map(
      (day) => {
        const m = dayMap.get(day) ?? new Map<string, ClassEntry>();
        const cells: Record<string, ClassEntry | null> = {};
        for (const h of headers) cells[h.id] = m.get(h.id) ?? null;
        return { day, cells };
      },
    );

    return {
      groupId: group.id,
      groupLabel: group.label,
      templateLabel: template.label,
      headers,
      rows,
    };
  }

  // helpers
  private findGroup(groups: Group[], id: string): Group {
    const g = groups.find((x) => x.id === id);
    if (!g) throw new Error(`Group '${id}' not found`);
    return g;
  }

  private findTemplate(
    templates: PeriodTemplate[],
    id: string,
  ): PeriodTemplate {
    const t = templates.find((x) => x.id === id);
    if (!t) throw new Error(`Period template '${id}' not found`);
    return t;
  }

  private timeToMin(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  }
}
