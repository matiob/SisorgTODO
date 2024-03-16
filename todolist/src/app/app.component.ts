import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title: string = 'todolist';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ){}

  ngOnInit(){
    this.matIconRegistry.addSvgIcon(
      'icon-check',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-check.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'icon-cross',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/icon-cross.svg')
    );
  }

}
