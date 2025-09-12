import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { TimetableService } from './services/json-parser.service';
import { GroupViewByPeriods } from './models/timetable';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timetable',
  imports: [CommonModule, TableModule],
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimetableComponent implements OnChanges {
  @Input({ required: true }) groupId!: string;

  view: GroupViewByPeriods | null = null;

  constructor(private readonly service: TimetableService) {}

  ngOnChanges(): void {
    if (!this.groupId) {
      throw new Error('TimetableComponent: groupId input is required');
    }
    this.view = this.service.getGroupViewByPeriods(this.groupId);
  }

  trackDay = (_: number, d: string) => d;

  /** Choose black/white text for contrast against a hex background */
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
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    // YIQ luma approximation
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000' : '#fff';
  }
}
