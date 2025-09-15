import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DAILY_QUOTES } from './quotes';

@Component({
  selector: 'app-title',
  imports: [CommonModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css',
})
export class TitleComponent {
  text = 'הציטוט היומי';

  quote: string;

  constructor() {
    // Pick a quote based on the day of year for daily rotation
<<<<<<< Updated upstream
    const day = Math.floor(Date.now() / 86400000);
    this.quote = this.quotes[day % this.quotes.length];
=======
    const day = Math.floor((Date.now() / 86400000));
    this.quote = DAILY_QUOTES[day % DAILY_QUOTES.length];
>>>>>>> Stashed changes
  }
}
