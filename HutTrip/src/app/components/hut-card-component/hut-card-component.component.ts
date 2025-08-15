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
  private lastDate?: Date;

  constructor(private hutService: HutService) {}

  ngOnInit() {
    this.lastDate = this.hut.date;
    this.loadAvailability();
  }

  ngDoCheck() {
    if (this.lastDate?.getTime() !== this.hut.date.getTime()) {
      this.lastDate = this.hut.date;
      this.loadAvailability();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hut'] && !changes['hut'].firstChange) {
      this.lastDate = this.hut.date;
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
    const hutDate = this.hut.date;
    const dateStr = hutDate.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    // Get the hut's position from the service to determine the day number
    const hutIndex = this.hutService.getSelectedHuts().findIndex(h =>
      h.hut_id === this.hut.hut_id && h.date.getTime() === this.hut.date.getTime()
    );

    return `Day ${hutIndex + 1} - ${dateStr}`;
  }

  get reservationLink(): string {
    const dateFrom = this.hut.date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const dateTo = new Date(this.hut.date);
    dateTo.setDate(dateTo.getDate() + 1);
    const dateToStr = dateTo.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    return `https://www.hut-reservation.org/reservation/book-hut/${this.hut.hut_id}/wizard?dateFrom=${dateFrom}&dateTo=${dateToStr}`;
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
      return 'Hut not in system';
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
