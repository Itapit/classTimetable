import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title',
  imports: [CommonModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css',
})
export class TitleComponent {
  text = 'הציטוט היומי';

  quotes: string[] = [
    'אני בשירותים (ירדן דרורי)',
    'לא טוב',
    'מוביט זה פרוקסי של איראן',
  ];

  quote: string;

  constructor() {
    // Pick a quote based on the day of year for daily rotation
    const day = Math.floor(Date.now() / 86400000);
    this.quote = this.quotes[day % this.quotes.length];
  }
}
