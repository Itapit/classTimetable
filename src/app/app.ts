import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleComponent } from './title/title.component';
import { TimetableComponent } from './timetable/timetable.component';
import { GroupSelectorComponent } from './group-selector/group-selector.component';
import { CommonModule } from '@angular/common';
import { UnderWorkComponent } from './under-work/under-work.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    TitleComponent,
    TimetableComponent,
    GroupSelectorComponent,
    UnderWorkComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  selectedGroupId: string | null = null;
}
