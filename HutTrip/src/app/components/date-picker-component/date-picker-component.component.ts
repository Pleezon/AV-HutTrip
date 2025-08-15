import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'date-picker-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-picker-component.component.html',
  styleUrls: ['./date-picker-component.component.css']
})
export class DatePickerComponentComponent {
  @Output() dateChange = new EventEmitter<string>();

  selectedDate: string = new Date().toISOString().split('T')[0];
  disabled = false;

  constructor() {
    setTimeout(() => this.onDateChange(), 0);
  }

  onDateChange() {
    this.dateChange.emit(this.selectedDate);
  }
}
