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
const rangeBox = document.getElementById('timespan');
rangeBox.style.height = '0px';
$(document).ready(function () {

    function toggleRangePeriod() {
      var toggle = document.getElementById('toggleRangePeriod');
      var rightSideList = document.getElementById('rightSideList');
      var leftSideList = document.getElementById('leftSideList');   
      if (rangeBox.style.height == '0px') {
        rangeBox.style.height = '64px'
        rangeBox.style.paddingTop = '10px';
        toggle.style.marginBottom = '59px';
        rightSideList.style.maxHeight = 'calc(100vh - 64px)';
        leftSideList.style.maxHeight =  'calc(100vh - 64px)';
      }
      else {
        rangeBox.style.height = '0px';
        rangeBox.style.paddingTop = '0px';
        toggle.style.marginBottom = '0px';
        rightSideList.style.maxHeight = '100vh';
        leftSideList.style.maxHeight =  '100vh';
      }
    }

    $("#toggleRangePeriod").click(function() {
      toggleRangePeriod();
   });
   document.addEventListener("DOMContentLoaded", function(event) { 
     
     
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
      return z;
    }
    var dateFormat = (date) => {
      return weekdays[date.getDay()] + ", " +
          date.getDate() + nth(date.getDate()) + " " +
          months[date.getMonth()] + " " +
          date.getFullYear();
    }

    var shortDateFormat = (date) => {
      return months[date.getMonth()] + " " + date.getDate() +  ", " +
            date.getFullYear();
    }
    var dateSlider = document.getElementById('fullname'); 
    var threeMonthsAgo = new Date('2019-03-01');
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    threeMonthsAgo = threeMonthsAgo.getTime();
      noUiSlider.create(dateSlider, {
      // Create two timestamps to define a range.
        connect: true,
        range: {
            min: timestamp('2019-03-01'),
            max: timestamp('2019-05-30')
        }, 
    
      // Steps of one week
        step: 1 * 24 * 60 * 60 * 1000,
    
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
        Dates.start = new Date(+values[0]);
        Dates.end = new Date(+values[1]);    
        if (window.innerWidth < 461) {
          dateValues[handle].innerHTML = shortDateFormat(date);
        } 
        else {
          dateValues[handle].innerHTML = dateFormat(date);
        }           
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
     

      
      module.exports.dateFormat = dateFormat;
      module.exports.shortDateFormat = shortDateFormat;
});
