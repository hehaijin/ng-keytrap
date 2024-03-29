import { Injectable, Inject } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { CheatsheetComponent } from './cheatsheet/cheatsheet.component';


interface Hotkey {
  key: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class RepoService {

  hotkeyfunctions;  // the registry of handler functions possibly with proiroty set.
  hotkeyDisposes;

  maxPriority;

  //variables for sequence key combo
  comboKeyGap = 500;
  prekey;  // previous key;
  prekeyTimeStamp;
  currentkey; //current key; 
  currentKeyTimeStamp;

  constructor(
    private eventManager: EventManager,
    private dialog: MatDialog,
    //  @Inject(Document) document: Document,
  ) {

    this.hotkeyfunctions = new Map();
    this.hotkeyDisposes = new Map();
    this.prekeyTimeStamp = new Date();
    this.maxPriority = -1;
    this.addShortcut('shift.?', 'shortcut', () => this.openDiaglog());
    this.eventManager.addGlobalEventListener('window', 'keydown', (event) => {
      console.log('keydown', event.key);
      this.prekey = this.currentkey;
      this.prekeyTimeStamp = this.currentKeyTimeStamp;
      this.currentkey = event.key;
      this.currentKeyTimeStamp = new Date();

    });
  }

  addShortcut(key, desc, handler, options?) {
    console.log('adding hot keys', key, desc, handler);
    console.log(key, options);
    let event;
    if (key.includes('->')) {
      const keys = key.split('->');
      const realkey = keys[1];
      event = `keydown.${realkey}`;
    } else {
      event = `keydown.${key}`;
    }

    //this.hotkeys.set(key, desc);
    //console.log('hotkeys', this.hotkeys);
    console.log('hotkey function', this.hotkeyfunctions);
    let priority = 1;
    if (options && options.priority) priority = options.priority;
    if (this.hotkeyfunctions.has(key)) {
      if (!this.hotkeyfunctions.get(key).has(priority)) {
        this.hotkeyfunctions.get(key).set(priority, []);
      }
    } else {
      this.hotkeyfunctions.set(key, new Map());
      this.hotkeyfunctions.get(key).set(priority, []);
    }
    const arr = this.hotkeyfunctions.get(key).get(priority);
    arr.push({ func: handler, desc: desc });
    if (!this.hotkeyDisposes.has(key)) {
      if (key.includes('->')) {
        const keys = key.split('->');
        const realkey = keys[1];
        console.log('real key', realkey);
        const dispose = this.eventManager.addGlobalEventListener('window', event, this.seqKeyHandler(realkey));
        this.hotkeyDisposes.set(key, dispose);
      } else {
        const dispose = this.eventManager.addGlobalEventListener('window', event, this.keyHandler(key));
        this.hotkeyDisposes.set(key, dispose);
      }
    }
    this.setMaxPriority();
  }


  removeShortCut(key, handler, priority = 1) {
    let arr = this.hotkeyfunctions.get(key).get(priority);
    if (arr.length === 1) {
      this.hotkeyfunctions.get(key).delete(priority);
      if (this.hotkeyfunctions.get(key).size === 0) {
        this.hotkeyfunctions.delete(key);
        this.hotkeyDisposes.get(key)(); // remove the global handler
      }
    }
    let ind = arr.findIndex((ele) => ele.func === handler);
    arr.splice(ind, 1);
  }

  getHotkeysList() {
    this.setMaxPriority();
    let result = [];
    for (let key of Array.from(this.hotkeyfunctions.keys())) {
      let map = this.hotkeyfunctions.get(key);
      let priority = -1;
      let funcArr;
      for (let p of map) {
        console.log('iterating', p);
      }
      let ps: number[] = Array.from(map.keys());
      for (const p of ps) {
        if (p > priority) {
          priority = p;
          funcArr = map.get(p);
        }
      }
      if (priority === this.maxPriority) {
        let f = funcArr[0];
        result.push({ key: key, desc: f.desc });
      }
    }
    return result;
  }


  keyHandler(key) {
    return (event) => {
      this.setMaxPriority();
      const map = this.hotkeyfunctions.get(key);
      console.log('hotkey functions', map);

      let priority = -1;
      let funcArr = [];
      let keys: number[] = Array.from(map.keys());
      for (let p of keys) {
        if (p > priority) {
          priority = p;
          funcArr = map.get(p);
        }
      }
      console.log(key);
      if (funcArr.length > 1) console.warn('Key', key, 'has more than 1 handler active');
      let f = funcArr[0].func; // make sure always have at least 1
      if (priority === this.maxPriority)
        f(event);
    }
  }

  seqKeyHandler(key) {
    return event => {
      console.log('checking combo');
      console.log('time gap', this.currentKeyTimeStamp - this.prekeyTimeStamp);
      if (this.currentKeyTimeStamp - this.prekeyTimeStamp > this.comboKeyGap) return;
      this.setMaxPriority();
      const seqkey = this.prekey + '->' + key;
      if (!this.hotkeyfunctions.has(seqkey)) return;
      const map = this.hotkeyfunctions.get(seqkey);
      console.log('hotkey functions', map);
      let priority = -1;
      let funcArr = [];
      let keys: number[] = Array.from(map.keys());
      for (let p of keys) {
        if (p > priority) {
          priority = p;
          funcArr = map.get(p);
        }
      }
      console.log(key);
      if (funcArr.length > 1) console.warn('Key', key, 'has more than 1 handler active');
      let f = funcArr[0].func; // make sure always have at least 1
      if (priority === this.maxPriority)
        f(event);
    }
  }


  setMaxPriority() {
    let r = -1;
    for (let key of Array.from(this.hotkeyfunctions.keys())) {
      let map = this.hotkeyfunctions.get(key);
      let keys: number[] = Array.from(map.keys());
      for (const p of keys) {
        if (p > r) {
          r = p;
        }
      }
    }
    this.maxPriority = r;
    console.log('max prio', this.maxPriority);
  }


  openDiaglog() {
    if (this.dialog.openDialogs.length === 0)
      this.dialog.open(CheatsheetComponent, {
        width: '500px',
        data: {}
      });
  }

}
