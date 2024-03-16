import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Output() searchEvent = new EventEmitter<string>();

  searchTerm: string = '';

  search(): void {
    this.searchEvent.emit(this.searchTerm);
  }
}
