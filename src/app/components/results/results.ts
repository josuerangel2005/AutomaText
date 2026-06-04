import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-results',
  standalone: false,
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results {
  @Input() title: string = '';
  @Input() meta: string = '';
  @Input() snippet: string = '';
}
