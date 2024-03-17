import { Component } from '@angular/core';

/**
 * Component for displaying the header of the application.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  /** Title to be displayed in the header. */
  pageTitle = 'Sisorg TODO';

  /** Options for the menu displayed in the header. */
  menuOptions: string[] = ['ToDo'];
}
