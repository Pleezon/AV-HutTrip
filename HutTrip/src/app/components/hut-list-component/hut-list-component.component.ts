import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HutCardComponentComponent } from '../hut-card-component/hut-card-component.component';
import { HutService, SelectedHut } from '../../services/hut.service';

@Component({
  selector: 'hut-list-component',
  standalone: true,
  imports: [CommonModule, HutCardComponentComponent],
  templateUrl: './hut-list-component.component.html',
  styleUrls: ['./hut-list-component.component.css']
})
export class HutListComponentComponent implements OnInit {
  selectedHuts: SelectedHut[] = [];

  constructor(private hutService: HutService) {}

  ngOnInit() {
    this.selectedHuts = this.hutService.getSelectedHuts();
  }

  removeHut(hut: SelectedHut): void {
    this.hutService.removeSelectedHut(hut);
    this.selectedHuts = this.hutService.getSelectedHuts();
  }
}
