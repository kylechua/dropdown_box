<div><b>Dropdown Box</b>
<ul>
    <li>Opens when box is clicked, or a keypress is detected while box is in focus</li>
    <li>Closes when box loses focus, or if the box is open and in focus and the user presses enter or clicks on it</li>
    <li>Saves a new chosen option when a user clicks on it, or presses enter while the new option is selected</li>
    <li>Options can be navigated with up/down arrow keys, or searched for by typing (alphanumeric or spaces, not case-sensitive)</li>
</ul>
</div>
<div>
<b>PUBLIC FUNCTIONS</b>

<b>$.dropdownBox(items[])</b>

    Creates a dropdown box in the <div> which called it. Initially, the box is closed.
    The first argument is the default item (e.g. item[0] = "Choose a Month", item[1] = "January").
    Do not create more than one box per container.

    args:
        - items: array of items to include in the dropdownBox.

<b>$.getValue()</b>

    Returns the currently selected item of box in the given <div>. If the default item is
    selected, returns undefined.

<b>$.delete()</b>
    
    Removes the dropdown box from the given <div>
</div>