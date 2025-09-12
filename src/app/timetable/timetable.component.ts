import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { TimetableService } from './services/json-parser.service';
import { GroupView } from './models/timetable';
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

  view: GroupView | null = null;

  constructor(private readonly service: TimetableService) {}

  ngOnChanges(): void {
    if (!this.groupId) {
      throw new Error('TimetableComponent: groupId input is required');
    }
    this.view = this.service.getGroupView(this.groupId);
  }

  trackHeader = (_: number, h: GroupView['headers'][number]) => h.id;
}
