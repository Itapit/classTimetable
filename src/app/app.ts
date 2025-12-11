import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { TitleComponent } from './title/title.component';
import { TimetableComponent } from './timetable/timetable.component';
import { GroupSelectorComponent } from './group-selector/group-selector.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    TitleComponent,
    TimetableComponent,
    GroupSelectorComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  selectedGroupId: string | null = null;
  private keyBuffer = '';
  private keyBufferTimeout: any;

  ngOnInit(): void {
    // Check if dark mode was previously enabled
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      document.body.classList.add('dark-mode');
    }
  }

  @HostListener('window:keypress', ['$event'])
  handleKeyPress(event: KeyboardEvent): void {
    // Ignore if user is typing in an input field
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    // Clear the previous timeout
    if (this.keyBufferTimeout) {
      clearTimeout(this.keyBufferTimeout);
    }

    // Add the key to the buffer
    this.keyBuffer += event.key.toLowerCase();

    // Check if the buffer ends with 'dm'
    if (this.keyBuffer.endsWith('dm')) {
      this.toggleDarkMode();
      this.keyBuffer = '';
    }

    // Clear the buffer after 1 second of no typing
    this.keyBufferTimeout = setTimeout(() => {
      this.keyBuffer = '';
    }, 1000);
  }

  toggleDarkMode(): void {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark.toString());
  }

  isDarkMode(): boolean {
    return document.body.classList.contains('dark-mode');
  }
}
