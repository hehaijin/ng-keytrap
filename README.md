# ng-keytrap
A keyboard shortcut library for Angular 2+   .
Depends on Angular Material for now. 

# Features

## Dynamic HotKey CheatSheet
Shift+? to display a list of currently available shortcut keys
The list will be dynamic and only contains actionable keyboard shortcuts.
## Auto remove listener
Automatically remove event listener when component is destroyed, so you do not have to manually do it. 
That is why directives are used in this library, as removal can be done in onDestroy hook.

## Sequential short key support. 
For example, you can define a shortcut key as first press a, and then press t, for a function 'add ticket', while  e->t key bombo for 'edit ticket'.
key combos needs to be easy to remember, otherwise it is not quite useful. 
2 keys sequence are supported. 

## no external dependency. 

## same key combo for multiple actions
Of course, only one action will be fired at a time.


## easy dialog support.
when a modal dialog is opened, only accept keys that is for the dialog?
Easy, give the hotkey a priority property.

# Usage
```
npm i ng-keyboardshortcut 
```

```
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ShortcutNgModule,
    MatDialogModule,      
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

The library uses directive to add keyboard shortcuts.
The event listener will be attached to the global window object, so it does not matter which DOM element you are attached to. 
Examples:
```
[hotkeys]="['c', 'start search', hotkeyHandler]"  // single key, caps not sensitive
[hotkeys]="['c', 'start search', hotkeyHandler, {priority: 2}]"  // single key, caps not sensitive
[hotkeys]="[['c', 'start search', hotkeyHandler1],  ['d', 'start search', hotkeyHandler2]]"    // multiple key
[hotkeys]="['c->d', 'start search', hotkeyHandler]"  //  sequence short cut key.   caps sensitive
[hotkeys]="['control.d', 'start search', hotkeyHandler]"   // combo short cut key. //caps not sensitive.
[hotkeys]="['alt.shift.d', 'start search', hotkeyHandler]"    // combo short cut key.
```

the hotkeys directive takes an Array(or an Array of Array) of inputs. 
each Array has 3 elements, first the key. can be a single key like 'a', or combo keys like 'alt.a', 'shift.a', 'control.a', 'meta.a'.
second is description.
third is the function name in the component.


In the component, you can define the function as:
### The arrow function format is requried as it will always be called on the component. 
```
testhotkey= (event: KeyboardEvent)=>{
	event.preventDefault();  
	event.stopPropagation();
	
	this.openEditDialog();
};
```
### The arrow function format is requried as it will always be called on the component. 












