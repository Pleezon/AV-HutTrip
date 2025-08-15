import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { HutService, HutAvailabilityEntry, SelectedHut } from '../../services/hut.service';

@Component({
  selector: 'hut-card-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hut-card-component.component.html',
  styleUrls: ['./hut-card-component.component.css']
})
export class HutCardComponentComponent implements OnInit, OnDestroy, OnChanges {
  @Input() hut!: SelectedHut;
  @Output() remove = new EventEmitter<void>();

  availability?: HutAvailabilityEntry;
  private availabilitySubscription?: Subscription;

  constructor(private hutService: HutService) {}

  ngOnInit() {
    this.loadAvailability();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hut'] && !changes['hut'].firstChange) {
      this.loadAvailability();
    }
  }

  ngOnDestroy() {
    this.availabilitySubscription?.unsubscribe();
  }

  private loadAvailability() {
    if (this.hut.hut_id === '0') {
      this.availability = {
        hutStatus: 'OPEN',
        freeBeds: null,
        percentage: 'AVAILABLE'
      };
      return;
    }

    this.availabilitySubscription = this.hutService
      .getHutAvailability(this.hut.hut_id)
      .subscribe(availability => {
        const targetDate = this.hut.date.toISOString().split('T')[0];
        for (const [date, entry] of availability.mapping.entries()) {
          if (date.toISOString().split('T')[0] === targetDate) {
            this.availability = entry;
            break;
          }
        }
      });
  }

  get formattedDate(): string {
    const hutDate = new Date(this.hut.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    hutDate.setHours(0, 0, 0, 0);

    const diffTime = hutDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const dateStr = hutDate.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    return `Day ${diffDays + 1} - ${dateStr}`;
  }

  get availabilityClass(): string {
    if (this.hut.hut_id === '0') {
      return 'custom-hut';
    }
    if (!this.availability || this.availability.hutStatus === 'CLOSED') {
      return 'not-available';
    }
    switch (this.availability.percentage) {
      case 'AVAILABLE':
        return 'available-many';
      case 'NEARLY FULL':
        return 'available-few';
      case 'FULL':
      case 'CLOSED':
        return 'not-available';
      default:
        return 'placeholder';
    }
  }

  get availabilityText(): string {
    if (this.hut.hut_id === '0') {
      return 'Custom hut';
    }
    if (!this.availability) {
      return 'Loading availability...';
    }
    if (this.availability.hutStatus === 'CLOSED') {
      return 'Closed';
    }
    if (this.availability.freeBeds === 0) {
      return 'Fully booked';
    }
    if (this.availability.freeBeds === null) {
      return 'No availability information';
    }
    return `${this.availability.freeBeds} beds available`;
  }

  onRemove(): void {
    this.remove.emit();
  }
}
