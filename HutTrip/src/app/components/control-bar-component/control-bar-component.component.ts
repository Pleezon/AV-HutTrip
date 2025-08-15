import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HutSearchComponentComponent } from '../hut-search-component/hut-search-component.component';
import { DatePickerComponentComponent } from '../date-picker-component/date-picker-component.component';
import { HutService, Hut } from '../../services/hut.service';

@Component({
  selector: 'control-bar-component',
  standalone: true,
  imports: [CommonModule, HutSearchComponentComponent, DatePickerComponentComponent],
  templateUrl: './control-bar-component.component.html',
  styleUrls: ['./control-bar-component.component.css']
})
export class ControlBarComponentComponent {
  selectedDate: string = '';

  constructor(private hutService: HutService) {}

  onHutSelected(hut: Hut) {
    const date = this.selectedDate ? new Date(this.selectedDate) : new Date();
    this.hutService.addSelectedHut(hut, date);
  }

  onDateSelected(date: string) {
    this.selectedDate = date;
    this.hutService.updateBaseDate(new Date(date));
  }
}
