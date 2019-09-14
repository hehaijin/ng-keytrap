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

## No external dependency. 

## Same key combo for multiple actions
Only one action will be fired at a time.

## Easy dialog support.
One common use caes for keyboard shortcut is that when a dialog is opened, 
Shortcuts on the webpage should not be activated.
Usually you need to public some logic in the key handle function to detect if dialog is opened.
Here, you can give a priority property to the shortcut.
The presence of a higher priority will shield all lower priority shortcuts from activated.

# Usage
```
npm i ng-keytrap
```

```
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgKeytrapModule,
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
each Array has 3 elements.
first the key. can be a single key like 'a', or combo keys like 'alt.a', 'shift.a', 'control.a', 'meta.a'.
second is description.
third is the function name in the component.
a forth optional element.


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












