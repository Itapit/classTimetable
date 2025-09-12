import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TimetableService } from '../timetable/services/json-parser.service';

interface GroupOption {
  label: string;
  value: string; // groupId
}

@Component({
  selector: 'app-group-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectButtonModule],
  templateUrl: './group-selector.component.html',
  styleUrls: ['./group-selector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupSelectorComponent implements OnInit {
  /** two-way bindable: [(group)] */
  @Input() group: string | null = null;
  @Output() groupChange = new EventEmitter<string>();

  options: GroupOption[] = [];

  constructor(private readonly timetable: TimetableService) {}

  ngOnInit(): void {
    this.options = this.timetable
      .getGroupIds()
      .map((g) => ({ label: g.label, value: g.id }));
    if (!this.group && this.options.length) {
      this.group = this.options[0].value;
      this.groupChange.emit(this.group);
    }
  }

  onSelect(groupId: string) {
    // `onChange` from SelectButton gives value directly (single mode)
    this.group = groupId;
    this.groupChange.emit(groupId);
  }

  trackOpt = (_: number, opt: GroupOption) => opt.value;
}
