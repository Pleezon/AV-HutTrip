import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, shareReplay, catchError, of} from 'rxjs';


export interface HutMap {
  nameToId: { [key: string]: number };
}

export interface Hut {
  hut_id: string;
  name: string;
}

export interface SelectedHut {
  hut_id: string;
  name: string;
  date: Date;
}

export interface HutAvailabilityEntry {
  hutStatus: 'OPEN' | 'CLOSED';
  freeBeds: number | null;
  percentage: 'AVAILABLE' | 'NEARLY FULL' | 'FULL' | 'CLOSED' | 'CLOSED';
}

export interface HutAvailability {
  mapping: Map<Date, HutAvailabilityEntry>;
}

@Injectable({
  providedIn: 'root'
})
export class HutService {
  private mappingUrl = 'https://raw.githubusercontent.com/Pleezon/AV-HutTrip/refs/heads/main/resources/hut_map.json';
  private availabilityBaseUrl = '/api/hut-availability';
  private hutMapCache$: Observable<HutMap>;
  private availabilityCache: Map<string, Observable<HutAvailability>> = new Map();
  private selectedHuts: SelectedHut[] = [];
  private baseDate: Date = new Date();

  constructor(private http: HttpClient) {
    this.hutMapCache$ = this.http.get<HutMap>(this.mappingUrl).pipe(
      catchError(error => {
        console.error('Error loading hut map:', error);
        return of({ nameToId: {} });
      }),
      map(response => {
        return response;
      }),
      shareReplay(1)
    );
  }

  /**
   * Elasticsearch-like search for hut names
   * @param query The search query
   * @returns Array of matching huts
   */
  searchHuts(query: string): Observable<Hut[]> {
    if (!query) {
      return this.getAllHuts();
    }

    const normalizedQuery = query.toLowerCase();
    return this.hutMapCache$.pipe(
      map(hutMap => {
        const matches: Hut[] = [];
        for (const [name, id] of Object.entries(hutMap.nameToId)) {
          if (name.toLowerCase().includes(normalizedQuery)) {
            matches.push({
              hut_id: id.toString(),
              name
            });
          }
        }
        return matches;
      })
    );
  }

  /**
   * Get all available huts
   * @returns Array of all huts
   */
  private getAllHuts(): Observable<Hut[]> {
    return this.hutMapCache$.pipe(
      map(hutMap =>
        Object.entries(hutMap.nameToId).map(([name, id]) => ({
          hut_id: id.toString(),
          name
        }))
      )
    );
  }

  /**
   * Get availability information for a specific hut
   * @param hutId The ID of the hut
   * @param forceRefresh Force a refresh of the cache
   * @returns Observable of availability information
   */
  getHutAvailability(hutId: string, forceRefresh: boolean = false): Observable<HutAvailability> {
    const cacheKey = `hut_${hutId}`;

    if (!forceRefresh && this.availabilityCache.has(cacheKey)) {
      return this.availabilityCache.get(cacheKey)!;
    }

    interface ApiResponse {
      freeBedsPerCategory: { [key: string]: number };
      freeBeds: number | null;
      hutStatus: 'SERVICED' | 'CLOSED';
      date: string;
      dateFormatted: string;
      totalSleepingPlaces: number;
      percentage: 'AVAILABLE' | 'NEARLY FULL' | 'FULL' | 'CLOSED';
    }

    const availability$ = this.http.get<ApiResponse[]>(
      `${this.availabilityBaseUrl}?hutId=${hutId}`
    ).pipe(
      map(response => {
        const mapping = new Map<Date, HutAvailabilityEntry>();
        for (const entry of response) {
          const date = new Date(entry.date);
          // Normalize the date to midnight UTC
          date.setUTCHours(0, 0, 0, 0);
          mapping.set(date, {
            freeBeds: entry.freeBeds,
            hutStatus: entry.hutStatus === 'SERVICED' ? 'OPEN' : 'CLOSED',
            percentage: entry.percentage
          });
        }
        return {mapping};
      }),
      shareReplay(1)
    );

    this.availabilityCache.set(cacheKey, availability$);
    return availability$;
  }

  /**
   * Clear the availability cache for a specific hut or all huts
   * @param hutId Optional: The ID of the hut to clear from cache
   */
  clearAvailabilityCache(hutId?: number): void {
    if (hutId) {
      this.availabilityCache.delete(`hut_${hutId}`);
    } else {
      this.availabilityCache.clear();
    }
  }

  addSelectedHut(hut: Hut, baseDate: Date): void {
    this.baseDate = new Date(baseDate);
    this.baseDate.setUTCHours(0, 0, 0, 0);
    this.updateAllDates();

    const selectedHut: SelectedHut = {
      ...hut,
      date: this.getDateForPosition(this.selectedHuts.length),
    };
    this.selectedHuts.push(selectedHut);
  }

  getSelectedHuts(): SelectedHut[] {
    return this.selectedHuts;
  }

  removeSelectedHut(hut: SelectedHut): void {
    const index = this.selectedHuts.indexOf(hut);
    if (index !== -1) {
      this.selectedHuts.splice(index, 1);
      // Update dates for all huts after the removed one
      this.updateAllDates();
    }
  }

  updateBaseDate(newDate: Date): void {
    this.baseDate = new Date(newDate);
    this.baseDate.setUTCHours(0, 0, 0, 0);
    this.updateAllDates();
  }

  private updateAllDates(): void {
    this.selectedHuts.forEach((hut, index) => {
      hut.date = this.getDateForPosition(index);
    });
  }

  private getDateForPosition(position: number): Date {
    const date = new Date(this.baseDate);
    date.setDate(date.getDate() + position);
    return date;
  }
}
