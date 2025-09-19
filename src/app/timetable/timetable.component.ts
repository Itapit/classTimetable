import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TimetableService } from './services/json-parser.service';
import { DayOfWeek, GroupViewByPeriods, ResolvedCell } from './models/timetable';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

const DAY_ORDER: DayOfWeek[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

@Component({
  selector: 'app-timetable',
  imports: [CommonModule, TableModule],
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TimetableComponent implements OnChanges, OnInit, OnDestroy {
  nextBreakMinutes: number | null = null;
  nextBreakLabel: string | null = null;
  @Input({ required: true }) groupId!: string;

  view: GroupViewByPeriods | null = null;
  filteredView: GroupViewByPeriods | null = null;

  nowDay: DayOfWeek | null = null;
  nowPeriodId: string | null = null;

  showTodayOnly = false;

  private tickId: any;

  constructor(
    private readonly service: TimetableService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // start ticking every 30s to catch period boundaries and update break timer
    this.tickId = setInterval(() => {
      if (this.view) {
        this.computeNow(this.view);
        this.updateNextBreak();
        this.cdr.markForCheck();
      }
    }, 30_000);
    // Also update immediately
    setTimeout(() => {
      if (this.view) {
        this.updateNextBreak();
        this.cdr.markForCheck();
      }
    }, 0);
  }

  ngOnChanges(): void {
    if (!this.groupId)
      throw new Error('TimetableComponent: groupId input is required');
    this.view = this.service.getGroupViewByPeriods(this.groupId);
    this.computeNow(this.view);
    this.applyFilter();
    this.updateNextBreak();
  }
  /** Compute time (in minutes) until the next break, and label for next break */
  updateNextBreak() {
    if (!this.view || !this.nowDay) {
      this.nextBreakMinutes = null;
      this.nextBreakLabel = null;
      return;
    }
    const mins = this.nowMinutes();
    const todayRows = this.view.rows;
    let foundCurrent = false;
    let currentIdx = -1;
    // Find the current period index
    for (let i = 0; i < todayRows.length; ++i) {
      const row = todayRows[i];
      const start = this.hhmmToMin(row.start);
      const end = this.hhmmToMin(row.end);
      if (mins >= start && mins < end) {
        foundCurrent = true;
        currentIdx = i;
        break;
      }
    }
    if (!foundCurrent) {
      this.nextBreakMinutes = null;
      this.nextBreakLabel = null;
      return;
    }

    // Find the next break period after the current period
    let nextBreakStart: number | null = null;
    let nextBreakLabel: string | null = null;
    for (let i = currentIdx + 1; i < todayRows.length; ++i) {
      const row = todayRows[i];
      // Heuristic: break if periodId starts with 'B', or title/name includes 'break' or 'הפסקה', or if all cells for this row have subject 'הפסקה' or classId 'BREAK'
      const isBreak =
        /^B\d+$/i.test(row.periodId) ||
        /break|הפסקה/i.test(row.title);
      if (isBreak) {
        nextBreakStart = this.hhmmToMin(row.start);
        nextBreakLabel = row.title;
        break;
      }
    }
    if (nextBreakStart != null) {
      this.nextBreakMinutes = nextBreakStart - mins;
      this.nextBreakLabel = nextBreakLabel;
    } else {
      this.nextBreakMinutes = null;
      this.nextBreakLabel = null;
    }
  }

  ngOnDestroy(): void {
    if (this.tickId) clearInterval(this.tickId);
  }

  toggleTodayOnly() {
    this.showTodayOnly = !this.showTodayOnly;
    this.applyFilter();
  }

  applyFilter() {
    if (!this.view) {
      this.filteredView = null;
      return;
    }
    if (!this.showTodayOnly) {
      this.filteredView = this.view;
      return;
    }
    // Filter to only today
    const today = this.nowDay;
    if (!today || !this.view.dayHeaders.includes(today)) {
      this.filteredView = null;
      return;
    }
    this.filteredView = {
      ...this.view,
      dayHeaders: [today],
      rows: this.view.rows.map(row => {
        // Ensure all DayOfWeek keys are present, only today has value, others are null
        const allDays: DayOfWeek[] = [
          'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
        ];
        const filteredCells = {} as Record<DayOfWeek, ResolvedCell | null>;
        for (const d of allDays) {
          filteredCells[d] = d === today ? row.cells[today] : null;
        }
        return {
          ...row,
          cells: filteredCells
        };
      })
    };
  }

  trackDay = (_: number, d: string) => d;

  textColorFor(bgHex: string): string {
    if (!bgHex) return '#000';
    const hex = bgHex.replace('#', '');
    const full =
      hex.length === 3
        ? hex
            .split('')
            .map((c) => c + c)
            .join('')
        : hex.padEnd(6, '0').slice(0, 6);
    const r = parseInt(full.slice(0, 2), 16),
      g = parseInt(full.slice(2, 4), 16),
      b = parseInt(full.slice(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000' : '#fff';
  }

  /** True if this cell is the current lesson */
  isNowCell(day: DayOfWeek, periodId: string): boolean {
    return this.nowDay === day && this.nowPeriodId === periodId;
  }

  /** True if this header day is "today" */
  isToday(day: DayOfWeek): boolean {
    return this.nowDay === day;
  }

  /** True if this row is the current period row */
  isNowRow(periodId: string): boolean {
    return this.nowPeriodId === periodId;
  }

  private computeNow(v: GroupViewByPeriods): void {
    const jsDay = new Date().getDay(); // 0=Sun .. 6=Sat
    const today: DayOfWeek = DAY_ORDER[jsDay];

    // Only highlight if today is in the rendered headers
    if (!v.dayHeaders.includes(today)) {
      this.nowDay = null;
      this.nowPeriodId = null;
      return;
    }

    const mins = this.nowMinutes();

    // Find the period whose [start,end) contains now
    const hit = v.rows.find((row) => {
      const start = this.hhmmToMin(row.start);
      const end = this.hhmmToMin(row.end);
      return mins >= start && mins < end;
    });

    this.nowDay = today;
    this.nowPeriodId = hit ? hit.periodId : null;
  }

  private nowMinutes(): number {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  private hhmmToMin(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  }
}
