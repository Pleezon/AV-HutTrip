import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { HutCardComponentComponent } from '../hut-card-component/hut-card-component.component';
import { HutService, SelectedHut } from '../../services/hut.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hut-list-component',
  standalone: true,
  imports: [CommonModule, HutCardComponentComponent, DragDropModule],
  templateUrl: './hut-list-component.component.html',
  styleUrls: ['./hut-list-component.component.css']
})
export class HutListComponentComponent implements OnInit, OnDestroy {
  selectedHuts: SelectedHut[] = [];
  private subscription?: Subscription;

  constructor(private hutService: HutService) {}

  ngOnInit() {
    this.selectedHuts = this.hutService.getSelectedHuts();
    this.subscription = this.hutService.selectedHuts$.subscribe(huts => {
      this.selectedHuts = huts;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onDrop(event: CdkDragDrop<SelectedHut[]>) {
    moveItemInArray(this.selectedHuts, event.previousIndex, event.currentIndex);
    this.hutService.updateHutOrder(this.selectedHuts);
  }

  removeHut(hut: SelectedHut): void {
    this.hutService.removeSelectedHut(hut);
  }
}
