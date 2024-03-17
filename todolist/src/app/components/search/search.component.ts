import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Component for searching functionality.
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  /**
   * Event emitter for search events.
   */
  @Output() searchEvent = new EventEmitter<string>();

  /**
   * The search term entered by the user.
   */
  searchTerm = '';

  /**
   * Emits the search term to the parent component.
   */
  search(): void {
    this.searchEvent.emit(this.searchTerm);
  }
}
