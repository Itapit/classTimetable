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

export interface ClassEntry {
  periodId: string;
  subject: string;
  teacher: string;
  room?: string;
  notes?: string;
}

export interface DaySchedule {
  day: DayOfWeek;
  classes: ClassEntry[];
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
  groups: Group[];
}

/** View models for the component */
export interface PeriodHeader {
  id: string;
  title: string; // e.g. "Period 1"
  start: string; // "08:00"
  end: string; // "08:45"
}

export interface DayRow {
  day: DayOfWeek;
  /** key = periodId */
  cells: Record<string, ClassEntry | null>;
}

export interface GroupView {
  groupId: string;
  groupLabel: string;
  templateLabel: string;
  headers: PeriodHeader[]; // columns in order
  rows: DayRow[]; // one row per day
}
