import { Directive, Input, OnInit, OnDestroy, ElementRef, ComponentRef, ViewContainerRef } from '@angular/core';
import { RepoService } from './repo.service';



@Directive({
  selector: '[hotkeys]'
})
export class HotkeysDirective implements OnInit, OnDestroy {
  pkgName = '[ng-keytrap]';
  @Input('hotkeys') hotkeys: any;
  sub;
  subs;
  constructor(private hotkeyrepo: RepoService
  ) {
    this.subs = [];
  }

  ngOnInit() {

    if (!(this.hotkeys instanceof Array)) {
      console.error(this.pkgName, 'hot keys directive must have array as input. for exmaple ["control.t", "Add Test", testhandler]');
    } else if (this.hotkeys.length > 0 && typeof this.hotkeys[0] === 'string') {
      if (this.hotkeys.length < 3) console.error(this.pkgName, 'single hot key must have 3 inputs, for key, description and handler function')
      if (typeof this.hotkeys[2] !== 'function') console.error(this.pkgName, 'third input must be a function');
      const sub = this.add(this.hotkeys);
      console.log('adding 2', this.hotkeys);
      this.subs.push(this.hotkeys);
    } else {
      this.hotkeys.forEach(element => {
        //console.log('hot keys 3', element);
        if (element.length < 3) {
          console.error(this.pkgName, 'hot keys input for', element, 'must contain at least 3 elements');
          return;
        }
        this.add(element);
        this.subs.push(element);
      });
    }
  }


  /**
   * 
   * @param el 
   *   
   */
  add(el: any[]) {
    if (el.length === 4)
      this.hotkeyrepo.addShortcut(el[0], el[1], el[2], el[3]);
    else this.hotkeyrepo.addShortcut(el[0], el[1], el[2]);
  }


  ngOnDestroy() {
    this.subs.forEach(element => {
      if (element.length === 4 && element[3].priority !== 1)
        this.hotkeyrepo.removeShortCut(element[0], element[2], element[3].priority);
      else this.hotkeyrepo.removeShortCut(element[0], element[2]);
    });
  }

}
