import '../css/style.css';
import '../css/nouislider.css';
import {Container, Row, Col, Form} from 'react-bootstrap';
import Spinner from 'react-spinner-material';


import TreeView from './treeview';
import {styles} from './styles.js';
console.log(styles);
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, CartesianAxis, LineChart, Line,
    } from 'recharts';
import { get } from 'http';
var link2 = "";
var link3 = "mu-library.herokuapp.com";
var link = "http://localhost:5000";
const React = require('react');
const ReactDOM = require('react-dom');
const {decorators} = require('react-treebeard');

const main = require('./javascript.js');
const msPerDay = 1000 * 60 * 60 * 24;
const {StyleRoot} = require('radium');    
const filters = require('react-treebeard/example/filter.js'); 
//  const styles = require('styles.js');
var data = {}   ;
var extra = [];
var history = [];
const content = document.getElementById('tree');
const spinnerDiv = document.getElementById('spinner');
const HELP_MSG = 'Select A Node To See Its Data Structure Here...';

var Dates = new Object(), start = new Date, end = new Date;
Dates.start = new Date('2019-03-01');
Dates.end = new Date('2019-05-30');
var months = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "June", "July",
    "Aug", "Sept", "Oct",
    "Nov", "Dec"
  ];

var sort_by = function(field, reverse, primer){

    var key = primer ? 
        function(x) {return primer(x[field])} : 
        function(x) {return x[field]};
 
    reverse = !reverse ? 1 : -1;
 
    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
      } 
 }
$(document).ready(function () { 
    'use strict';

// CONFIG FOR LOCAL DEV


    function formatDate(date) {
        return months[date.getMonth()] + " " + date.getDate() +  ", " +
            date.getFullYear();
      }


     
// ###################################################### GENERATE DATA ###################################################### 
// ###################################################### GENERATE DATA ######################################################  
// ###################################################### GENERATE DATA ######################################################  

    var generateUntouchedMusicData = function(sortBy, limit) {
        var request = $.ajax({
            type: 'POST',
            crossDomain: true,
            url: link + '/untouched',
            dataType: 'json',
            data: {sortBy: sortBy, limit:limit},
            success: function(result) { }
        });
        request.done(function(dataRcvd) {
        extra = dataRcvd;
     //   console.log(dataRcvd);
        for (var i = 0; i<extra.length; i++) {                
            var newDate = main.shortDateFormat(new Date(Number(extra[i].FolderCreationDate)));
            extra[i].FolderCreationDate = newDate;
            extra[i].AlbumPlaycount = (extra[i].Playcount / extra[i].Tracklist.length).toFixed(2);
            extra[i].Numtracks = extra[i].Tracklist.length;
        }         
        return extra;

    });
    };
    generateUntouchedMusicData('"Playcount", "FolderCreationDate"', '"Playcount" IS NOT NULL');



    var generateData = function(timeRange) {
        var daterange = JSON.stringify(timeRange);
        var request = $.ajax({
            type: 'POST',
            url: link,
            dataType: 'json',
            data: {Dates : daterange},
            success: function(result) { }
        });
        request.done(function(dataRcvd) {         
            data = {'name':'x', toggled: true, 'children': []};
            for (var i = 0; i<dataRcvd.length; i++) {
                var trackDuration = new Date(Number(dataRcvd[i].Duration));
                
                if (!data.children.filter(e => e.name === dataRcvd[i].ArtistName).length > 0) {
                    // ARTIST
                    data.children.push({'name': dataRcvd[i].ArtistName, 'count':1, 'children': [], 'type':'band'
                    , 'category':dataRcvd[i].Category});                    
                    var artist = data.children.find(x => x.name === dataRcvd[i].ArtistName);
                    // ALBUMS
                    artist.children.push({'name': dataRcvd[i].AlbumName, 'count':1, 'tracks' : [], 'artist': dataRcvd[i].ArtistName, 'genre':dataRcvd[i].Genre, 'type':'album', 'year':dataRcvd[i].Year, 'category':dataRcvd[i].Category });
                    var album = artist.children.find(x => x.name === dataRcvd[i].AlbumName);
                    // TRACKS
                    album.tracks.push({'name': dataRcvd[i].TrackName, 'count':1, 'artist':dataRcvd[i].ArtistName, 'album':dataRcvd[i].AlbumName,
                    'duration':trackDuration.getTime(), 'genre':dataRcvd[i].Genre, 'year':dataRcvd[i].Year, 'trackNo':dataRcvd[i].TrackNo, 
                    'type':'track', 'id':(dataRcvd[i]), 'fullCount':dataRcvd[i].Playcount });
                }
                else {
                    var artist = data.children.find(x => x.name === dataRcvd[i].ArtistName);
                    artist.count += 1;
                    if (!artist.children.filter(a => a.name === dataRcvd[i].AlbumName).length > 0) {
                        // ALBUMS
                        artist.children.push({'name': dataRcvd[i].AlbumName, 'tracks' : [], 'count':1, 'artist': dataRcvd[i].ArtistName, 
                        'genre':dataRcvd[i].Genre, 'type':'album', 'year':dataRcvd[i].Year, 'category':dataRcvd[i].Category});
                        var album = artist.children.find(x => x.name === dataRcvd[i].AlbumName);
                        // TRACKS
                        album.tracks.push({'name': dataRcvd[i].TrackName, 'count':1, 'artist':dataRcvd[i].ArtistName, 'album':dataRcvd[i].AlbumName, 
                        'duration':trackDuration.getTime(), 'genre':dataRcvd[i].Genre, 'year':dataRcvd[i].Year, 'trackNo':dataRcvd[i].TrackNo, 
                        'type':'track', 'id':(dataRcvd[i]), 'fullCount':dataRcvd[i].Playcount });
                    }
                    else {
                        var album = artist.children.find(x => x.name === dataRcvd[i].AlbumName);
                        album.count += 1;
                        if (!album.tracks.filter(z => z.name === dataRcvd[i].TrackName).length > 0) {
                            // TRACKS
                            album.tracks.push({'name': dataRcvd[i].TrackName, 'count':1, 'artist':dataRcvd[i].ArtistName, 'album':dataRcvd[i].AlbumName, 
                            'duration':trackDuration.getTime(), 'genre':dataRcvd[i].Genre, 'year':dataRcvd[i].Year, 'trackNo':dataRcvd[i].TrackNo, 
                            'type':'track', 'id':(dataRcvd[i]), 'fullCount':dataRcvd[i].Playcount});
                        }
                        else {
                            var track = album.tracks.find(x => x.name === dataRcvd[i].TrackName);
                            track.count += 1;
                        }
                    }
                }   
            }
            for (var i = 0; i<data.children.length; i++) {                
                for (var a = 0; a<data.children[i].children.length; a++) {
                    data.children[i].children[a].tracks.sort(sort_by('trackNo', false));
                }
                
            }
            data.children.sort(sort_by('count', true));
            data.children.forEach(x => {
                x.children.sort(sort_by('count', true));
            });
       //     Rndr();
            ReactDOM.render(<TreeView data={data}/>, content);
            return data;


        });
    };
    generateData(Dates);

    var getCategoryHistory = function() { 
        fetch(link + "/categoryHistory", {headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin":"*",
             "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            }, method: 'get'})
            .then(res => res.json())
            .then(
            (result) => {
                let rangeStart = Dates.start;
                let rangeEnd = Dates.end;
                let min = Infinity, max = -Infinity
                for (var i = 0; i < result.length; i++ ) {
                    let scr = new Date(Number(result[i].TimePlayed));
                    let sc = scr.getTime();
                    if (scr >= rangeStart && scr <= rangeEnd) {
                        let c = scr.getTime();
                        if (c < min) {
                            min = c;
                        }
                        if (c > max) {
                            max = c;
                        }
                    }
                }
                var diff = Math.floor((max - min) / msPerDay);
                if (diff > 900) {
                    for (var i = 0; i<result.length; i++) {

                        var scrobbleDate = new Date(Number(result[i].TimePlayed));
                        var c = scrobbleDate.getFullYear()
                        if (history.filter(x => x.name.toString() === c.toString()).length > 0) {
                            var oldValue = history.find(x => x.name.toString() === c.toString());
                            if (oldValue[result[i].Category]) {
                                oldValue[result[i].Category] += 1;
                            }
                            else {                                                
                                oldValue[result[i].Category] = 1;
                            }
                        }
                        else {
                            var chartObj = {'name':c.toString()};
                            chartObj[result[i].Category] = 1;
                            history.push(chartObj);
                        }    
                    }
                }
                if (diff < 901 && diff > 31) {
                    for (var i = 0; i<result.length; i++) {
                        var scrobbleDate = new Date(Number(result[i].TimePlayed));
                      //  console.log(scrobbleDate);
                       // console.log(rangeStart);
                        var c = months[scrobbleDate.getMonth()] + " " + scrobbleDate.getFullYear();
                        if (scrobbleDate >= rangeStart && scrobbleDate <= rangeEnd) {
                            if (history.filter(x => x.name.toString() === c.toString()).length > 0) {
                                var oldValue = history.find(x => x.name.toString() === c.toString());
                                if (oldValue[result[i].Category]) {
                                    oldValue[result[i].Category] += 1;
                                }
                                else {                                                
                                    oldValue[result[i].Category] = 1;
                                }
                            }
                            else {
                                var chartObj = {'name':c.toString()};
                                chartObj[result[i].Category] = 1;
                                history.push(chartObj);
                            }  
                        }  
                    }
                }
               /* for (var i = 0; i < album.scrobbles.length; i++) {
                    var scrobbleDate = new Date(album.scrobbles[i]);
                    if (scrobbleDate >= rangeStart && scrobbleDate <= rangeEnd) {
                        var c = months[scrobbleDate.getMonth()] + " " + scrobbleDate.getFullYear();
                        if (albumYearChartOptions.filter(x => x.name === c).length > 0) {
                            var oldValue = albumYearChartOptions.find(x => x.name === c);
                            oldValue.count += 1;
                        }
                        else {
                            albumYearChartOptions.push({'name':c, 'count':1, 'sortcode':scrobbleDate.getTime()});
                        }                                             
                    }                                       
                }*/
                history.sort(sort_by('name', false));
                ReactDOM.render(<TreeView extra={extra} history={history}/>, content);

               // return history;
            //    generateData(Dates);
            },
            (error) => {
                console.log(error);
                console.log("overalldatafetch - error in api");
                });             
    };
    getCategoryHistory();

    decorators.Header = ({style, node}) => {
        const iconType = node.children ? '' : 'caret-right ';
        const iconClass = `fa fa-${iconType}`;
        const iconStyle = {marginRight: '5px'};
    
        return (
            <div style={style.base}>
                <div style={style.title}>
                    <i className={iconClass} style={iconStyle}/>    
                    {node.name}                    
                </div>
                <div style={style.count}>
                    {node.count}                    
                </div>
            </div>
        );
    };

// ###################################################### NODEVIEWER COMPONENT ######################################################  
// ###################################################### NODEVIEWER COMPONENT ######################################################  
// ###################################################### NODEVIEWER COMPONENT ######################################################  



// ###################################################### PARENT COMPONENT ###################################################### 
// ###################################################### PARENT COMPONENT ######################################################  
// ###################################################### PARENT COMPONENT ######################################################  

    

// ###################################################### RIGHT SIDE INFORMATION LIST ######################################################    
// ###################################################### RIGHT SIDE INFORMATION LIST ######################################################    
// ###################################################### RIGHT SIDE INFORMATION LIST ######################################################



      class SpinnerLoad extends React.Component {
        constructor(props) {
            super(props);
        }
        render () {
          return (
            <div style={styles.spinner}>
                <Spinner size={120} spinnerColor={"#333"} spinnerWidth={2} visible={true} />
            </div>
            );   
        }
      }
      
      ReactDOM.render(<SpinnerLoad/>, spinnerDiv);
    


    /*var Rndr = function() {
        console.log("Rendering");


    };*/
   // exports.rndr = Rndr(); 
    $("#testing2").click(function() {
        data.sort(sort_by('name', true));
        ReactDOM.render(<TreeView/>, content);
    });
//    Rndr();
  //  generateData(Dates);
    $("#updateRange").click(function () {generateData(main.dates);});

    return extra;
});

export {extra, data, history, spinnerDiv, link, Dates, months, sort_by, msPerDay};

