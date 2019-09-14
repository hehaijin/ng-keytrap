import { NgModule } from '@angular/core';
import { CheatsheetComponent } from './cheatsheet/cheatsheet.component';
import { HotkeysDirective } from './hotkeys.directive';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [CheatsheetComponent, HotkeysDirective],
  imports: [
    CommonModule
  ],
  exports: [CheatsheetComponent, HotkeysDirective],
  entryComponents:[CheatsheetComponent]
})
export class NgKeytrapModule { }
