import { Component, OnInit, Inject } from '@angular/core';
import { RepoService } from '../repo.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-cheatsheet',
  templateUrl: './cheatsheet.component.html',
  styleUrls: ['./cheatsheet.component.css']
})
export class CheatsheetComponent implements OnInit {

  hotkeys = [];

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
     private diaglogref: MatDialogRef<CheatsheetComponent>,
    private hotkeyrepo: RepoService
  ) { }


  ngOnInit() {
    console.log('cheat sheet init');
    this.hotkeys = this.hotkeyrepo.getHotkeysList();
  }

  
  handleHotkey = () => {
    this.close();
  }

  close() {
    this.diaglogref.close();
    console.log('close called');
  }

}
