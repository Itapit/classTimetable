export type DayOfWeek =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export interface Period {
  id: string;
  name?: string;
  start: string; // "HH:MM"
  end: string; // "HH:MM"
}

export interface PeriodTemplate {
  id: string;
  label: string;
  periods: Period[];
}

/** Catalog definition for a class (color-coded) */
export interface ClassDef {
  subject: string;
  teacher: string;
  color: string; // hex "#RRGGBB" or "#RGB"
}

/** A scheduled cell now references a classId + optional room/notes */
export interface ScheduleEntry {
  periodId: string;
  classId: string; // key in TimetableRoot.classes
  room?: string;
  notes?: string;
}

export interface DaySchedule {
  day: DayOfWeek;
  classes: ScheduleEntry[];
}

export interface Group {
  id: string;
  label: string;
  templateId: string;
  applyTemplateToDays?: DayOfWeek[];
  week: DaySchedule[];
}

export interface TimetableRoot {
  version: string;
  periodTemplates: PeriodTemplate[];
  classes: Record<string, ClassDef>; // NEW
  groups: Group[];
}

/** ---------- View models for the transposed table (periods as rows) ---------- */

export interface ResolvedCell {
  subject: string;
  teacher: string;
  color: string;
  room?: string;
  notes?: string;
}

export interface PeriodRowT {
  periodId: string;
  title: string; // e.g., "Period 1"
  start: string; // "08:00"
  end: string; // "08:45"
  /** key = dayOfWeek */
  cells: Record<DayOfWeek, ResolvedCell | null>;
}

export interface GroupViewByPeriods {
  groupId: string;
  groupLabel: string;
  templateLabel: string;
  dayHeaders: DayOfWeek[]; // columns
  rows: PeriodRowT[]; // periods as rows
}
