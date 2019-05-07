/*jslint browser: true*/
/*global $, jQuery, alert*/


/* var jsdom = require('jsdom');
const { JSDOM } = jsdom;

const { document } = (new JSDOM('')).window;
global.document = document; */
const noUiSlider = require('nouislider');
const wNumb = require('wnumb');
const tree = require('./treetest.js');
const _ = require('lodash');
$(document).ready(function () {
 
    $(window).on("load", function() {
        function loadup() {$("#bioofbob").animate({opacity: 1}, 3000);}

        loadup();
    });
    var weekdays = [
      "Sunday", "Monday", "Tuesday",
      "Wednesday", "Thursday", "Friday",
      "Saturday"
    ];
    
    var months = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    function timestamp(str) {
      if (!str) {
        var z = new Date().getTime();
      }
      else {
        var z = new Date(str).getTime();
      }
      console.log(z);
      return z;
    }

    var dateSlider = document.getElementById('fullname'); 
    var threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    threeMonthsAgo = threeMonthsAgo.getTime();
    console.log(threeMonthsAgo);
      noUiSlider.create(dateSlider, {
      // Create two timestamps to define a range.
        connect: true,
        range: {
            min: timestamp('2009'),
            max: timestamp('')
        }, 
    
      // Steps of one week
        step: 7 * 24 * 60 * 60 * 1000,
    
      // Two more timestamps indicate the handle starting positions.
        start: [threeMonthsAgo, timestamp('')],
    
      // No decimals
        format: wNumb({
            decimals: 0
        })
      }); 
      var dateValues = [
        document.getElementById('event-start'),
        document.getElementById('event-end')
      ];
      
      var Dates = new Object(), start = Date(), end = Date;
      dateSlider.noUiSlider.on('update', function (values, handle) {
        var date = new Date(+values[handle]);
        console.log("aasa" + Dates.end);
        Dates.start = new Date(+values[0]);
        Dates.end = new Date(+values[1]);
        dateValues[handle].innerHTML = formatDate(date);
        module.exports.dates = Dates;
        return Dates;
      });
      
      
      
      // Create a list of day and month names.
      
      // Append a suffix to dates.
      // Example: 23 => 23rd, 1 => 1st.
      function nth(d) {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
      }
      
      // Create a string representation of the date.
      function formatDate(date) {
        return weekdays[date.getDay()] + ", " +
            date.getDate() + nth(date.getDate()) + " " +
            months[date.getMonth()] + " " +
            date.getFullYear();
      }
      
});
