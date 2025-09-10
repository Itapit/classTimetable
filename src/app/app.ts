import { Component } from '@angular/core';
import { TitleComponent } from './title/title.component';

@Component({
  selector: 'app-root',
  imports: [TitleComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'classTimetable';
}
