import { Component } from '@angular/core';
import { TitleComponent } from './title/title.component';
import { TimetableComponent } from './timetable/timetable.component';

@Component({
  selector: 'app-root',
  imports: [TitleComponent, TimetableComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'classTimetable';
  group = 'A';
}
