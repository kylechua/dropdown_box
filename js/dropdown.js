(function($){

/* Creates the drop down box when passed in an array of items. Initially, the box is closed.
*  The first argument is the default item (e.g. item[0] = "Choose a Month", item[1] = "January")
*
*  Handles event listeners for the drop down box
*/
$.fn.dropdownBox = function (items){

// ----------- CONSTRUCTOR ----------- //

    // Create the unorderered list which contains the options
    $(this).append('<ul class="dropdown closed isDefault" style="none" data-selected="-1"></ul>');
    // Hidden text box for keystrokes
    $(this).find('ul').append('<label class="searchInput" style="display:none"></label>');

    // Puts the first argument in the box (e.g. "Choose a Month")
    $(this).find('ul').append('<li class="chosenOption opened"><a href="#">' + items[0] + '</a></li>');

    // Populates the drop down box
    // Initially, everything is hidden except for the default option
    var len = items.length;
    for(var i=1; i<len; i++)
        $(this).find('ul').append('<li class="closed"><a href="#">' + items[i] + '</a></li>');

    console.log("Dropdown box \"" + $(this).attr('id') + "\" created.");


// ------- MOUSE EVENTS -------- //

    // Clicked on box
    $(this).on('click', 'li', function(e){

        var parent = $(this).closest('ul');

        if ($(parent).hasClass('closed')){
            // Box is closed, open box
            $(parent).openBox();
        } else { 
            // Box is open, update value and close box
            var newValue = $(this).find('a').html();
            $(parent).updateChosen(newValue)
            // Close the box
            $(parent).closeBox();
        }

        $('.dropdown').not(parent).each(function(){
            // Close other boxes
            $(this).closeBox();
        });
        e.stopPropagation();
    });

    $(document).on('click', function(e) {
        // Close the nested list when clicking outside of the box
        $('.dropdown:not(.closed)').each(function(){
            $(this).closeBox();
        });
        e.stopPropagation();
    });

// ------- KEYBOARD EVENTS ------- //

    $(this).on('keydown','li', function(e){

        var parent = $(this).closest('ul');

        var input, len, index;
        input = e.keyCode;
        len = parseInt($(parent).children('li').length, 10);
        index = parseInt($(parent).attr('data-selected'), 10);

        // handle tabs
        if (input != 9){
            $(parent).openBox();
        } else {
            return;
        }

        // Scrolling with Arrow Keys
            if (input == 38 || input == 40){
                if (input == 38){ // UP
                    // if at an out of bounds index, start at last index
                    if (index <= 0 || index >= len) index = len - 1;
                    else index = index - 1;
                } else { // DOWN
                    // start at first index
                    if (index < 0 || index >= len-1) index = 0;
                    else index = index + 1;
                }
                // Update Data
                $(parent).attr('data-selected', index.toString());
                var current = $(parent).children('li').eq(index);

                // Recolor selections
                if (!$(parent).hasClass('closed')){
                    current.addClass('selected');
                }
                $(parent).children('li').not(current).each(function(){
                    $(this).removeClass('selected');
                });
            }

        // Search Select
            else if ((input >= 48 && input <= 57) || (input >= 65 && input <=90) // alphanumeric
                     || (input == 32) // space
                     || (input == 8)){ // backspace

                // clear selected items
                $(parent).children('li').each(function(){
                    $(this).removeClass('selected');
                });

                // Numbers, Letters, Backspace
                var textBox = $(parent).find('.searchInput');
                var searchTerm = $(textBox).html();
                var char = String.fromCharCode(input).toLowerCase();

                if (input == 8){ // Backspace
                    // remove last character
                    searchTerm = searchTerm.substring(0, searchTerm.length-1);

                } else {
                    // append character to search term
                    searchTerm = searchTerm + char;
                }

                // set new search term
                $(textBox).html(searchTerm);

                // if we have a search term, select first element which starts with this term
                // var of founditem will be if we found it or not
                var foundItem = $(parent).selectFromSearch(searchTerm);

                // if item doesn't exist anymore, try 
                // the last letter(s) (e.g. "concat" + "i". "concati" has no matches
                                            // search term --> "cation") -- cat is copied over
                // in case the user started typing a new letter in the middle of the word.
                // and if still doesn't work then try with it as the first character
                // (e.g. "loft" + "h" -> "house")
                if (!foundItem){
                    var searchCopy = searchTerm
                    var tryAgain = false;
                    for (i=1; i<searchCopy.length-1; i++){
                        var test = searchCopy.substring(searchCopy.length-(i+1), searchCopy.length-1) + char;
                        $(textBox).html(test);
                        tryAgain = $(parent).selectFromSearch(test);
                        if (tryAgain){
                            $(textBox).html(test);
                            break;
                        }
                    }
                    if (!tryAgain){
                        searchTerm = char;
                        $(textBox).html(searchTerm);
                        $(parent).selectFromSearch(searchTerm);
                    }
                }

            }

        // Save and Close
            else if (input == 13){ // ENTER
                if ($(parent).hasClass('opened')){
                    // update value
                    $(parent).children('li').each(function(){
                        if ($(this).hasClass('selected')){
                            var newValue = $(this).find('a').html();
                            $(this).closest('ul').updateChosen(newValue);
                        }
                    });
                    $(parent).children('ul').closeBox();
                }
            }
            
            
    });

                        // ----------- HELPER FUNCTIONS ----------- //

                        $.fn.openBox = function(){
                            $(this).removeClass('closed');
                            $(this).addClass('opened');
                            $(this).children('li:not(.chosenOption)').each(function(){
                                $(this).addClass('opened');
                                $(this).removeClass('closed');
                            });
                        }

                        $.fn.closeBox = function(){
                            $(this).removeClass('opened');
                            $(this).addClass('closed');
                            $(this).children('li:not(.chosenOption)').each(function(){
                                    $(this).addClass('closed');
                                    $(this).removeClass('opened');
                                    $(this).removeClass('selected');
                            });
                            $(this).children('.searchInput').html("");
                        }

                        $.fn.updateChosen = function(newVal){
                            var oldVal = $(this).find('.chosenOption a');
                            if (oldVal != newVal){
                                $(oldVal).html(newVal);
                                $(this).removeClass('isDefault');
                            }
                        }

                        $.fn.selectFromSearch = function(term){
                            var found = false;
                            if (term.length > 0){
                            $(this).children('li:not(.chosenOption)').each(function(){
                                var value = $(this).find('a').html().toLowerCase();
                                if (value.indexOf(term) == 0){
                                    $(this).addClass('selected');
                                    found = true;
                                    return false;
                                }
                            });
                            return found;
                        }
                        
                }

}
            
/* Returns the item which is currently selected
*  If the item selected is the default value, return undefined
*/
$.fn.getValue = function (){
    if ($(this).find(".dropdown").hasClass('isDefault'))
        return undefined;
    else
        return $(this).find(".chosenOption a").html();
}

/* 
*  Removes the dropdown box from the page
*/
$.fn.delete = function(){
    $(this).empty();
    console.log("Dropdown box \"" + $(this).attr('id') + "\" removed.");
}

} (jQuery));