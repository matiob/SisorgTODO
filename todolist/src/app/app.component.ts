import { Component } from '@angular/core';

/**
 * Root component of the application.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  /**
   * Title of the application.
   */
  title = 'todolist';
}
