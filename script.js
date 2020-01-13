$(document).ready(function () {

    // GLOBAL VARIABLES -----------------------------------------------------
    let workday = {
        // object of arrays
        date:[],
        startTime: [],
        endTime: [],
        breakTime: [],
        hoursWorked: []
    }

    let $allDateTypeInputs = $('input[type="date"]');
    let $allTimeInInputs = $('label[for="timein"]').siblings('input[type="time"]');
    let $allTimeOutInputs = $('label[for="timeout"]').siblings('input[type="time"]');
    let $allBreakInputs = $('input[type="number"]');
    let $allHoursWorked = $('input[type="text"]');


    // PROMPT ---------------------------------------------------------------
    Swal.fire({
        title: 'Please enter your first and last name.',
        input: 'text',
        inputValidator: (value) => {
            if (!value) {
                // if nothing entered
                $('.name').text('there');
                // use jQuery method: .text()
                // to display "Hi there!"
            } else {
                // if something entered
                $('.name').text(value);
                // use jQuery method: .text()
                // to display name that the user entered on prompt
            }
        }
    });
    
    // EVENT LISTENERS ON WINDOW -------------------------------------------------------
    const hiddenLabels = document.getElementsByClassName("hiddenLabel");

    window.addEventListener("resize", function () {
        for (i = 0; i < hiddenLabels.length; i++) {
            const eachHiddenLabel = hiddenLabels[i];

            //when window is smaller than 780 pixels
            if (window.matchMedia("(max-width:780px)").matches) {
                eachHiddenLabel.classList.remove("visuallyHidden");
            } else {
                eachHiddenLabel.classList.add("visuallyHidden");
            }
        }
    });

    // EVENT LISTENERS ON FORM -------------------------------------------------------
    $('form').on('input', function() {
        // run these functions when the user inputs data on the form
        getStartTime();
        getEndTime();
        getBreakTime();
    });


    $('form.timesheet').on('submit', function() {
        // run these functions when the user hits the submit button on the timesheet form
        event.preventDefault();
        // prevent refresh on submit
        getHoursWorked();
        getTotalHoursWorked();
    });
    

    $('form.earnings').on('submit', function() {
        // run these functions when the user hits the submit button on the earnings form
        event.preventDefault();
        // prevent refresh on submit
        getGrossEarnings();
    });


    // EVENT LISTENER ON DATEPICKER -------------------------------------------------------    

    $('#datepicker').on('input', function(){
        // on user input of datepicker
        
        $allDateTypeInputs.each((index) => {
            // use jQuery method .each() to create a function that will execute for each date type input
            // the ojective of this function is to 
            // i. set the date of each subsequent day and ii. make each date visible

            // objective i. set the date of each subsequent day 
            let datepicker = new Date($('#datepicker').val());
            // using jQuery method: .val() get the value of datepicker
            // using JS method: new Date() "convert" the string to a date object
            // this will allow you to increment the date later

            let nextDay = new Date($('#datepicker').val());
            // create a variable called nextDay which uses first date as a base
            // typeof is string
            
            nextDay.setDate(datepicker.getDate() + (index + 1));
            // using Javascript method .setDate() 
            // set the value of each nextDay to equal date from datepicker + index of each input


            // objective ii. make each date visible
            let month = '' + (nextDay.getMonth() + 1);
            let day = '' + nextDay.getDate();           
            let year = nextDay.getFullYear();
            // store the month, day and year of nextDay into separate variables

            if (month.length < 2) {
                // if the month is less than 2 characters
                month = '0' + month;
                // add 0 in front to make the string 2 characters 
                // this will help us conform to the required format: "yyyy-mm-dd"
            }
            if (day.length < 2) {
                // if the day is less than 2 characters
                day = '0' + day;
                // add 0 in front to make the string 2 characters 
                // conform to the required format: "yyyy-mm-dd"

            }
            
            $(`#date${index + 1}`).val(`${year}-${month}-${day}`)
            // using jQuery method .val()
            // display the value of each date type input
        });   
    }); 


    // FUNCTIONS --------------------------------------------------------------------------
    
    let getStartTime = function() {
        // the objective of this function is to get an array of timein values that are typeof date (object)
        
        $allTimeInInputs.each((index) => {
            // use jQuery method .each() to create a function that will execute for each timein input

            let timeinString = $(`#timein${index + 1}`).val();
            // using jQuery method: .val()
            // get the value of each timein input
            // inputs return typeof string

            let timeinObject = timeinString.split(':');
            // remove the colons
            // this returns typeof object
            // note the values in each index are still typeof string
            
            let timeinHour = timeinObject[0];
            let timeinMinute = timeinObject[1];
            // assign each index to a variable
            
            let startingTime = new Date("1970-1-1 " + `${timeinHour}:${timeinMinute}`);
            // using JS method: new Date()
            // "convert" timein input with typeof string to typeof date (object)

            allStartingTimes = startingTime.getTime();
            // get all timein inputs with typeof date (object) using JS method: .getTime()

            workday.startTime.unshift(allStartingTimes);
            // using JS method: .unshift()
            // insert values from allStartingTimes to the beginning of our array: workday.startTime

            workday.startTime = workday.startTime.slice(0,7);
            // using JS method: .slice()
            // extract indexes 0-6
        });
    }


    let getEndTime = function() {
        // the objective of this function is to get an array of timeout values that are typeof date (object)

        $allTimeOutInputs.each((index) => {
            // use jQuery method .each() to create a function that will execute for each timeout input

            let timeoutString = $(`#timeout${index + 1}`).val();
            // using jQuery method: .val()
            // get the value of each timeout input
            // inputs return typeof string

            let timeoutObject = timeoutString.split(':');
            // remove the colons
            // this returns typeof object
            // note the values in each index are still typeof string

            let timeoutHour = timeoutObject[0];
            let timeoutMinute = timeoutObject[1];
            // assign each index to a variable
            
            let endingTime = new Date("1970-1-1 " + `${timeoutHour}:${timeoutMinute}`);
            // using JS method: new Date()
            // "convert" timeout input with typeof string to typeof date (object)

            allEndingTimes = endingTime.getTime();
            // get all timeout inputs with typeof date (object) using JS method: .getTime()

            workday.endTime.unshift(allEndingTimes);
            // using JS method: .unshift()
            // insert values from allEndingTimes to the beginning of our array: workday.endTime

            workday.endTime = workday.endTime.slice(0,7);
            // using JS method: .slice()
            // extract indexes 0-6
        });
    }


    let getBreakTime = function() {
        // the objective of this function is to get an array of breaktime values that are typeof number

        $allBreakInputs.each((index) => {
            // use jQuery method .each() to create a function that will execute for each break input

            let breakString = $(`#break${index + 1}`).val();
            // using jQuery method: .val()
            // get the value of each breaktime input
            // input returns typeof string

            let breakTime = parseFloat(breakString);
            // using JS function: parseFloat()
            // "convert" breaktime input with typeof string to typeof number

            workday.breakTime.unshift(breakTime);
            // using JS method: .unshift()
            // insert values from breakTime to the beginning of our array: workday.breakTime

            workday.breakTime = workday.breakTime.slice(0,7);
            // using JS method: .slice()
            // extract indexes 0-6
        });
    }
    

    let getHoursWorked = function() {
        // the objective of this function is to calculate hours worked each day
        // and to make these values visible
        // quotient will look like: endTime - startTime
        // desired return: number with 2 decimals max.

        for(let i=0; i < 7; i++) {

            let endTimeNumber = workday.endTime[i]/1000/60/60;
            // "convert" each date (object) in our workday.endTime array to hours

            let startTimeNumber = workday.startTime[i]/1000/60/60;
            // "convert" each date (object) in our workday.startTime array to hours

            let breakTimeNumber = workday.breakTime[i]/60;
            // "convert" each number in our workday.breakTime array from minutes to hours

            let totalHoursWorked = (((endTimeNumber) - (startTimeNumber))-breakTimeNumber).toFixed(2)
            // store the quotient inside a variable
            // use JS method: toFixed() to specify number of decimals

            workday.hoursWorked.unshift(totalHoursWorked);
            // using JS method: .unshift()
            // insert values from totalHoursWorked to the beginning of our array: workday.hoursWorked

            workday.hoursWorked = workday.hoursWorked.slice(0,7)
            // using JS method: .slice()
            // extract indexes 0-6
            // note this is an array of strings**
        }

        $allHoursWorked.each((index) => {
            // use jQuery method .each() to create a function that will execute for each input

            $(`#hoursworked${index}`).val(`${workday.hoursWorked[index]}`)
            // using jQuery method: .val()
            // display the values from our array: workday.hoursWorked
        });
    }


    let getTotalHoursWorked = function() {
        // the objective of this function is to calculate total hours worked
        // and to make these values visible
        // quotient will look like: (endTime - startTime) - breakTime

        let hoursToAdd = workday.hoursWorked.map(function(index) {
            // using JS method: .map()
            // create a new array based on our array: workday.hoursWorked
            // this array should return the same values but with typeof number

            return parseFloat(index);
            // using JS function: parseFloat()
            // "convert" each value in workday.hoursWorked with typeof string to typeof number
        });

        let totalHoursWorked = hoursToAdd.reduce(function(a,b) {
            // using JS method: .reduce()
            // add each value in the array
            
            return a + b
            // the return value of the function is a single value (total hours worked)
        }, 0);

        $('span.hoursworked').text((totalHoursWorked).toFixed(2) + ' hours')
        // using jQuery method: .text()
        // display the value
    }


    let getGrossEarnings = function() {
        // the objective of this function is to calculate gross earnings
        // and to make these values visible
        // quotient will look like: total hours x hourly rate

        let totalHours = $('span.hoursworked').text();
        // using jQuery method: .text()
        // get the value representing total hours 
        // note this is typeof string

        let hourlyRate = $('#hourlyrate').val();
        // using jQuery method: .val()
        // get the value representing hourly rate
        // note this is typeof string

        let grossEarnings = (parseFloat(totalHours) * parseFloat(hourlyRate)).toFixed(2);
        // using JS function: parseFloat()
        // write the quotient

        $('span.earnings').text('$'+ grossEarnings);
        // using jQuery method: .text()
        // display the value
    }


// end of document ready
});
