// Month number and name as key value pairs.
let dict_of_months = {0: "January", 1: "February", 2: "March", 3: "April",
                        4: "May", 5: "June", 6: "July", 7: "August", 8: "September",
                        9: "October", 10: "November", 11: "December"};

// Define global variables that are used in multiple functions.
let selecteddate;
// Grab current date
let date = new Date();
let current_month = date.getMonth();
let current_date = date.getDate();
let current_year = date.getFullYear();
let current_day = date.getDay();
let days_in_current_month = new Date(current_year, current_month + 1, 0).getDate();
let days_in_previous_month = new Date(current_year, current_month, 0).getDate();
// Sort table by pick up time when page is initially loaded.
let current_sort = "ptuarrow";

// Dynamically generate order table based on number of orders created.
function buildOrderTable() {
    var db = firebase.database().ref().child("Orders")
    db.on(
        "value",
        function(snap){
            // Grab all orders from the database and split them into keys and values
            dict_of_orders = snap.val();
            all_orders = Object.keys(dict_of_orders);
            all_details = Object.values(dict_of_orders);
            // Create a new row for each order
            for (let i=0; i<all_orders.length-1;i++) {
                let tr = document.createElement("tr");
                tr.id = all_orders[i];
                document.getElementById('dailyDetails').appendChild(tr);
                let details = all_details[i];
                let month = details['Month'] - 1;
                let full_order = []
                full_order.push(month);
                full_order.push(details['Day']);
                full_order.push(details['Year']);
                full_order.push(details['FarmerID']);
                full_order.push(details['Number']);
                full_order.push(details['Produce']);
                full_order.push(details['Quantity']);
                full_order.push(details['CustName']);
                full_order.push(details['Pickup']);
                for (let j=0; j<full_order.length; j++) {
                    let td = document.createElement("td");
                    tr.appendChild(td);
                    td.innerHTML = full_order[j];
                }          
            }
            filterTable();
        }
    )
}

// Create each calendar day dynamically
function createCalendar() {
    let week = 1;
    let day = 1;
    for (i = 0; i <= 5; i++) {
        let tr = document.createElement("tr");
        tr.id = "week" + week;
        document.getElementById("calendartable").appendChild(tr);
        for (j = 0; j <= 6; j++) {
            let td = document.createElement("td");
            td.id = "day" + day;
            tr.appendChild(td);
            td.style.cursor = "pointer";
            // Define actions when each individual date is clicked.
            td.onclick = function() {
                document.getElementById(selecteddate).style.fontWeight = "normal";
                current_date = parseInt(td.innerHTML);
                selecteddate = td.id;
                document.getElementById(selecteddate).style.fontWeight = "bold";
                setMainDate();
                setCalendarDate();
                filterTable();
            }
            day++;
        }
        week++;
    }
}

// Fill each calendar day with a value.
function buildCalendar() {
    // Find what day the first date of the month is on using current date(eg. 7th) and day(eg. Sunday)
    let earliestdate = current_date%7;
    let earliestday = 8 - earliestdate + current_day;
    let firstday = 1;
    if (earliestday > 6) {
        earliestday -= 7;
    }
    // Fill in each calendar day starting from the first of the month to the end of the month.
    for (i = 1; i <= days_in_current_month; i++) {
        document.getElementById("day" + (i + earliestday)).innerHTML = i;
        document.getElementById("day" + (i + earliestday)).style.color = "black";
        //If current date is selected, bold the date. 
        if (i == current_date) {
            document.getElementById("day" + (i + earliestday)).style.fontWeight = "bold";
            selecteddate = document.getElementById("day" + (i + earliestday)).id;
        }
    }
    // Fill in each calendar day for the month previous and style it lightgray.
    for (i = 0; i < earliestday; i++) {
        document.getElementById("day" + (earliestday - i)).innerHTML = days_in_previous_month - i;
        document.getElementById("day" + (earliestday - i)).style.color = "lightgray";
    }
    // Fill in each calendar day for the following month and style it lightgray.
    for (i = days_in_current_month + 1; i + earliestday <= 42; i++) {
        document.getElementById("day" + (i + earliestday)).innerHTML = firstday;
        document.getElementById("day" + (i + earliestday)).style.color = "lightgray";
        firstday++;
    }
    // If day 1 of row 6 is in the next month, hide that row, else display the row.
    if (document.getElementById("day36").style.color == "lightgray") {
        document.getElementById("week6").style.display = "none";
    }
    else {
        document.getElementById("week6").style.display = "table-row";
    }
}

// Recreate the calendar when the user clicks back one month.
function leftarrowclick () {
    // If current month is January, change the month to December and decrement the year.
    if (current_month > 0) {
        current_month -= 1;
    }
    else {
        current_month = 11;
        current_year -= 1;
    }
    document.getElementById(selecteddate).style.fontWeight = "normal";
    current_date = 1;
    date = new Date(current_year, current_month, current_date);
    current_day = date.getDay();
    days_in_current_month = new Date(current_year, current_month + 1, 0).getDate();
    days_in_previous_month = new Date(current_year, current_month, 0).getDate();
    buildCalendar();
    setCalendarDate();
}

// Recreate the calendar when the user clicks forward one month.
function rightarrowclick () {
    // If current month is December, change the month to January and increment the year.
    if (current_month < 11) {
        current_month += 1;
    }
    else {
        current_month = 0;
        current_year += 1;
    }
    document.getElementById(selecteddate).style.fontWeight = "normal";
    current_date = 1;
    date = new Date(current_year, current_month, current_date);
    current_day = date.getDay();
    days_in_current_month = new Date(current_year, current_month + 1, 0).getDate();
    days_in_previous_month = new Date(current_year, current_month, 0).getDate();
    buildCalendar();
    setCalendarDate();
}

// Change the title date on the main page depending on the date selected.
function setMainDate () {
    document.getElementById("titledate").innerHTML = dict_of_months[current_month] + " " + current_date.toString() + " " + current_year.toString();
}
// Change the month and year on the calendar based on the date selected.
function setCalendarDate () {
    document.getElementById("selectedmonth").innerHTML = dict_of_months[current_month];
    document.getElementById("selectedyear").innerHTML = current_year;
}

// Filter the table to only show orders that contain the date selected & belong to the logged in user.
function filterTable() {
    table = document.getElementById("dailyDetails");
    row = table.getElementsByTagName("tr");
    for (i = 1; i < row.length; i++) {
        order = row[i].getElementsByTagName("td");
        if (order[0].innerHTML == current_month && order[1].innerHTML == current_date && order[2].innerHTML == current_year && order[3].innerHTML == current[2]) {
            row[i].style.display = "table-row";
        } 
        else {
            row[i].style.display = "none";
        }
    }
}

// Sort the table in ascending order based on column selected.
function sortTableAscending(column, id) {
    table = document.getElementById("dailyDetails");
    rows = table.rows;
    sorting = true;
    while (sorting) {
        switching = false;
        for (i = 1; i < rows.length - 1; i++) {
            if (rows[i].getElementsByTagName("td")[column].innerHTML > rows[i+1].getElementsByTagName("td")[column].innerHTML) {
                switching = true;
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                break;
            }
        }
        if (switching == false) {
            sorting = false;
        }
    }
    // Highlights the sort arrow that was clicked and remove previous highlight. 
    document.getElementById(current_sort).style.borderTopColor = "lightgray";
    document.getElementById(current_sort).style.borderBottomColor = "lightgray";
    document.getElementById(id).style.borderBottomColor = "grey";
    current_sort = id;
}

// Sort the table in descending order based on column selected.
function sortTableDescending(column, id) {
    table = document.getElementById("dailyDetails");
    rows = table.rows;
    sorting = true;
    while (sorting) {
        switching = false;
        for (i = 1; i < rows.length - 1; i++) {
            if (rows[i].getElementsByTagName("td")[column].innerHTML < rows[i+1].getElementsByTagName("td")[column].innerHTML) {
                switching = true;
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                break;
            }
        }
        if (switching == false) {
            sorting = false;
        }
    }
    // Highlights the sort arrow that was clicked and remove previous highlight. 
    document.getElementById(current_sort).style.borderBottomColor = "lightgray";
    document.getElementById(current_sort).style.borderTopColor = "lightgray";
    document.getElementById(id).style.borderTopColor = "grey";
    current_sort = id;
}

// Invoke functions to create calendar and table when page is loaded.
buildOrderTable();
sortTableAscending(7, current_sort);
createCalendar();
buildCalendar();
setMainDate();
setCalendarDate();
