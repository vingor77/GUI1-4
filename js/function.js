/*
    Name: Vincent Gordon
    Email: vincent_gordon@student.uml.edu
    Copyright (c) 2023 by Vincent.
    Date of file creation: May 28th 2023 at 12:32 pm
    Last updated by Vincent June 14th 2023 at 11:01 am
    This web page displays the restraints of inputs followed by a form with numeric inputs corresponding to the minimum and maximum values for a multiplication table.
*/

$(function () {
    var maxNum = 50;
    var minNum = -50;

    /*
        Create objects for each of the four inputs holding 3 things: A control variable (error),
        The message element from the HTML, and the input field element from the HTML.
        I chose to use objects since I can change the inner contents while inside of a function call.
    */
    var minRow = {
        error: false,
        msg: $('#minRowError'),
        value: $('#minRow')
    }

    var maxRow = {
        error: false,
        msg: $('#maxRowError'),
        value: $('#maxRow')
    }

    var minCol = {
        error: false,
        msg: $('#minColError'),
        value: $('#minCol')
    }

    var maxCol = {
        error: false,
        msg: $('#maxColError'),
        value: $('#maxCol')
    }

    //Hide the error message as to not appear while no input has been entered.
    minRow.msg.hide();
    maxRow.msg.hide();
    minCol.msg.hide();
    maxCol.msg.hide();

    //Check for whenever a key is no longer being pressed. Run the validation function with the appropriate object passed in.
    minRow.value.keyup(() => {
        if (validateNum(minRow, maxRow)) {
            validateMinMax(minRow, maxRow, "row");
        }
    })
    maxRow.value.keyup(() => {
        if (validateNum(maxRow, minRow)) {
            validateMinMax(minRow, maxRow, "row");
        }
    })
    minCol.value.keyup(() => {
        if (validateNum(minCol, maxCol)) {
            validateMinMax(minCol, maxCol, "col");
        }
    })
    maxCol.value.keyup(() => {
        if (validateNum(maxCol, minCol)) {
            validateMinMax(minCol, maxCol, "col");
        }
    })

    function validateNum(selection, opposite) {
        //Grab the value currently inside of minRow on the page when the key is no longer being pressed down.
        //This then rounds any decimal points to the nearest whole number.
        var value = parseFloat(selection.value.val()).toFixed();

        //Huge numbers break the rounding, so if it does this is a fallback to make it always 1 greater than the max.
        //This causes the checks underneath to operate on it and say it must be between -50 and 50.
        if (selection.value.val().length > 8) {
            value = maxNum + 1;
        }
        
        //Make sure values are within -50 and 50.
        if (selection.value.val().length == 0) {
            selection.msg.show();
            selection.msg.text("Cannot be empty.");
            selection.error = false;
            opposite.msg.hide();
            return false;
        }
        else if(parseInt(value) > maxNum || parseInt(value) < minNum) {
            selection.msg.show();
            selection.msg.text("The value must be between -50 and 50.");
            selection.error = false;
            return false;
        }
        else {
            selection.msg.hide();
            selection.error = true;
            return true;
        }
    }

    function validateMinMax(min, max, type) {
        //Check for empty string. If it is, then this won't work as parseFloat on an empty string causes NaN, not 0.
        //With this in mind, the one with 0 length gets returned false.
        if (min.value.val().length == 0 || max.value.val().length == 0) {
            return false; //Returns false as to end the function call early. No need to continue.
        }

        var minVal = parseInt(parseFloat(min.value.val()).toFixed());
        var maxVal = parseInt(parseFloat(max.value.val()).toFixed());

        if (minVal <= maxVal) {
            min.error = true;
            max.error = true;
            min.msg.hide();
            max.msg.hide();
        }
        else if (minVal > maxNum || minVal < minNum) {
            min.error = true;
            max.error = true;
            max.msg.show();
            if (type == "row") {
                max.msg.text("Must be larger than or equal to the minimum row.");
            }
            else {
                max.msg.text("Must be larger than or equal to the minimum column.");
            }
        }
        else if (maxVal > maxNum || maxVal < minNum) {
            min.error = true;
            max.error = true;
            min.msg.show();
            if (type == "row") {
                min.msg.text("Must be smaller than or equal to the minimum row.");
            }
            else {
                min.msg.text("Must be smaller than or equal to the minimum column.");
            }
        }
        else {
            min.error = false;
            min.msg.show();
            max.error = false;
            max.msg.show();

            if (type == "row") {
                min.msg.text("Must be smaller than or equal to the minimum row.");
                max.msg.text("Must be larger than or equal to the minimum row.");
            }
            else {
                min.msg.text("Must be smaller than or equal to the minimum column.");
                max.msg.text("Must be larger than or equal to the minimum column.");
            }
        }
    }

    button = document.getElementById("createTable");

    button.addEventListener("click", () => {
        if (minRow.error == true && maxRow.error == true && minCol.error == true && maxCol.error == true) {
            var minRowVal = parseInt(parseFloat(minRow.value.val()).toFixed());
            var maxRowVal = parseInt(parseFloat(maxRow.value.val()).toFixed());
            var minColVal = parseInt(parseFloat(minCol.value.val()).toFixed());
            var maxColVal = parseInt(parseFloat(maxCol.value.val()).toFixed());
            var table = document.getElementById("table");
    
            table.innerText = ""; //Get rid of the previous table, then put the new one in.
            reset();

            table.appendChild(populateTable(null, minRowVal, maxRowVal, minColVal, maxColVal));
        }
    })

    function reset() {
        //Resets the values in the input fields and changes the errors.
        //This happens so that the button won't do anything when the inputs are empty, but before any keyup events occur.
        minRow.value.val("");
        maxRow.value.val("");
        minCol.value.val("");
        maxCol.value.val("");

        minRow.error = false;
        maxRow.error = false;
        minCol.error = false;
        maxCol.error = false;
    }

    function populateTable(table, minRow, maxRow, minCol, maxCol) {
        var negCount = 0;
        var offsetCol = 0;
        var offsetRow = 0;
    
        //Create a new table element to populate.
        if (!table) table = document.createElement('table');
    
        /*
        Create the table using tr and td. Create text nodes to insert the calculated value.
        I have made the tables start 1 lower than the minimum row/col so that I can insert the header.
        This is shown as the first 3 pieces of the if statements. The top one is if its the top left corner (which should be empty)
        The 2nd down is if its the first row and the 3rd is if it isn't the first row but is the first column. The 4th is basic calculation.
        */
        for (var i = minRow - 1; i <= maxRow; i++) {
            var row = document.createElement('tr');
            for (var j = minCol - 1; j <= maxCol; j++) {
                //Check if the data cell being added is a header (outside row and column) or a regular cell.
                if (i < minRow) {
                    var th = document.createElement('th');
                    th.setAttribute('class', 'top');
                    row.appendChild(th);
                }
                else if (i >= minRow && j < minCol) {
                    var th = document.createElement('th');
                    th.setAttribute('class', 'side');
                    row.appendChild(th);
                }
                else {
                    row.appendChild(document.createElement('td'));
                }
    
                //check if negative j
                if (j < 0) {
                    if(i < minRow && j < minCol) {
                        row.cells[negCount].appendChild(document.createTextNode(""));
                    }
                    else if(i < minRow) {
                        row.cells[negCount].appendChild(document.createTextNode(minCol + offsetCol));
                        offsetCol++;
                    }
                    else if(j < minCol && i >= minRow) {
                        row.cells[negCount].appendChild(document.createTextNode(minRow + offsetRow));
                        offsetRow++;
                    }
                    else {
                        row.cells[negCount].appendChild(document.createTextNode(i * j));
                    }
                    negCount++;
                }
                else {
                    if(i < minRow && j < minCol) {
                        row.cells[j - minCol + 1].appendChild(document.createTextNode(""));
                    }
                    else if(i < minRow) {
                        row.cells[j - minCol + 1].appendChild(document.createTextNode(minCol + offsetCol));
                        offsetCol++;
                    }
                    else if(j < minCol && i >= minRow) {
                        row.cells[j - minCol + 1].appendChild(document.createTextNode(minRow + offsetRow));
                        offsetRow++;
                    }
                    else {
                        row.cells[j - minCol + 1].appendChild(document.createTextNode(i * j));
                    }
                }
            }
            negCount = 0;
            offsetCol = 0;
            table.appendChild(row);
        }
        return table;
    }
})

function formSubmit() {return false;} //Prevents page refresh.