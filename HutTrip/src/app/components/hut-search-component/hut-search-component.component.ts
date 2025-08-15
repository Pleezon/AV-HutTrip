import { Component, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { Hut, HutService } from '../../services/hut.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'hut-search-component',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective],
  templateUrl: './hut-search-component.component.html',
  styleUrls: ['./hut-search-component.component.css']
})
export class HutSearchComponentComponent implements OnInit, OnDestroy {
  @Output() selectHut = new EventEmitter<Hut>();

  searchQuery = '';
  showResults = false;
  disabled = false;
  searchResults: Hut[] = [];

  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription;

  constructor(private hutService: HutService) {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  ngOnInit() {
  }

  private performSearch(query: string, show_results=true) {
    this.hutService.searchHuts(query).subscribe(results => {
      this.searchResults = results;
      this.showResults = show_results;
    });
  }

  onSearchInput() {
    this.showResults = true;  // Show results as soon as user starts typing
    this.searchSubject.next(this.searchQuery);
  }

  onAddCustom() {
    if (this.searchQuery.trim()) {
      const customHut: Hut = {
        hut_id: '0',
        name: this.searchQuery.trim()
      };
      this.selectHut.emit(customHut);
      this.showResults = false;
      this.searchQuery = '';
    }
  }

  onHutSelect(hut: Hut) {
    this.selectHut.emit(hut);
    this.showResults = false;
    this.searchQuery = "";
    this.performSearch("", false);
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }
}
