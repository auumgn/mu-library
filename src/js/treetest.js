import '../css/style.css';
import '../css/nouislider.css';
import {Container, Row, Col, Form} from 'react-bootstrap';
import Spinner from 'react-spinner-material';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, CartesianAxis, LineChart, Line,
    } from 'recharts';
    import { throttle, debounce } from 'throttle-debounce';
import { get } from 'http';
$(document).ready(function () { 
    'use strict';
    var link = "";
    var link3 = "https://mu.serveo.net";
    var link2 = "http://localhost:5000";
    const React = require('react');
    const ReactDOM = require('react-dom');
    const PropTypes = require('prop-types');
    const {Treebeard} = require('react-treebeard');
    const {decorators} = require('react-treebeard');
    
    const main = require('./javascript.js');
    const {StyleRoot} = require('radium');    
    const filters = require('react-treebeard/example/filter.js'); 
 //   const styles = require('./node_modules/react-treebeard/example/styles.js');
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
    const albumColorCodes = ['#A40606', '#2978A0', '#315659', '#1D3461', '#2D232E', '#561643', '#55DDE0']
    const msPerDay = 1000 * 60 * 60 * 24;
    function formatDate(date) {
        return months[date.getMonth()] + " " + date.getDate() +  ", " +
            date.getFullYear();
      }

    var sort_by = function(field, reverse, primer){

        var key = primer ? 
            function(x) {return primer(x[field])} : 
            function(x) {return x[field]};
     
        reverse = !reverse ? 1 : -1;
     
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
          } 
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

    const Checkbox = props => (
        <input readOnly key={props.id} onClick={props.handleCheckElement} type="checkbox" checked={props.isChecked} value={props.value} />
      )

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
            ReactDOM.render(<TreeExample data={data}/>, content);
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
                ReactDOM.render(<TreeExample extra={extra} history={history}/>, content);

               // return history;
            //    generateData(Dates);
            },
            (error) => {
                console.log(error);
                console.log("overalldatafetch - error in api");
                });             
    };
    getCategoryHistory();
    const styles = {
        styleRootInlineBlock : {
            display: 'inline-block',
        },
        styleRootFlex : {
            display: 'flex'
        },
        spinner : {
            position:"absolute",
            top:"0",
            right:"0",
            left:"0",
            bottom:"0",
            margin:"auto",
            height:"120px",
            width:"120px",
        },
        component: {
            verticalAlign: 'top',
            paddingLeft: '20px',
            '@media (max-width: 640px)': {
                width: '100%',
                display: 'block'
            },
            '@media (max-width: 460px)': {
             //   paddingRight: "3px",
                paddingLeft: "12px",
            }
        },
        appcontainer: {
            width:'100%',
        },
        searchBox: {
            position: 'relative', 
            width: "100%",        
            '@media (max-width: 767px)': {
                width: '100%',
                maxWidth: "none",
            }  
        },
        nodeViewer: {
            marginBottom: "20px",
        },
        Infolist: {
            settings : {
                maxHeight: "0",
                opacity: "0",
                transition: "0.2s ease-out",
                maxWidth: "450px",
                marginLeft: "auto",
                padding: "0 10px 0 0",
                '@media (max-width: 460px)' : {
                    padding: "0 25px 0 10px",
                    marginLeft: "0",
                }
            },
            button : {
                display: "block",
                marginLeft: "auto",
                marginBottom: "10px",
            },
            title: {

            },
            extraInfo: {
                fontSize: "11px",
            },
            header : {
              maxWidth: "450px",
              marginLeft: "auto",
              borderBottom: "1px solid gainsboro", 
              '@media (max-width: 460px)' : {
                marginLeft: "0",
                maxWidth: "100vh !important",
            } 
            },
            headerTitle : {
                display:"inline-block",
                '@media (max-width: 460px)' : {
                    paddingLeft: "10px"
                }
            },
            headerCog : {
                cursor: "pointer",
                position:"absolute",
                right : "5px",
                top: "0",
                display:"inline-block",
                ':hover' : {color:"cornflowerblue"},
                '@media (max-width: 767px)' : {
                    right: "15px",
                }
            }
        },
        menu: {
            buttonRow : {
                position: "absolute",
                zIndex: "1",                
                marginLeft: "15px",
                width: "calc(5px + 100%)",
                fontSize: "12px",
                backgroundColor: "white",
                display:"flex",
                maxWidth: "450px",
                '@media (max-width: 767px)': {
                    position:"relative",
                    maxWidth: "49%",
                    marginLeft :"0",
                    paddingLeft :"15px",
                },
                '@media (max-width: 460px)': {
                    marginTop: "27px",
                    maxWidth: "100%",
                }
                 
            },
            homeButton : {
                background: "none",
                marginLeft: "2px",
                padding: "0 20px 0 20px",
                borderBottom: "1px solid gainsboro",
                borderRight: "1px solid gainsboro",
                borderTop: "none",
                borderLeft: "none",
                height: "22px",
                minWidth: "70px",
                maxWidth: "100px",
                '@media (max-width: 767px)': {
                    minWidth: "50px",
                    padding: "0 8px 0 8px",
                }
            },
            sortButton : {
                background: "none",
                borderRight: "none",
                borderLeft: "none",
                borderTop: "none",
                minWidth: "100px",
                maxWidth: "100px",
                borderBottom: "1px solid gainsboro",
                padding: "0",
                '@media (max-width: 460px)': {
                    minWidth: "90px",
                }
            },
        },
        viewer: {
            main : {
                mainHeader: {
                    fontSize: "18px",
                    fontWeight: "600",
                    margin: "10px 0 20px 10px",
                },
                tickBoxContainer : {
                    display: "inline-block",
                    width: "20%",
                    verticalAlign: "top",
                    '@media (max-width: 1240px)': {
                        width: '25%',
                         },
                    '@media (max-width: 1065px)': {
                    width: '33%',
                        }
                },
                tickBoxLabel : {
                    paddingLeft:"3px",
                    display: "inline-block",

                    width: "80%",
                },
                tickBox : {
                    verticalAlign: "top",
                    display: "inline-block",
                },
                tickBoxes: {
                    marginBottom: "20px",
                    paddingLeft: "40px",
                    paddingRight: "30px",
                    '@media (max-width: 400px)': {
                        paddingLeft: "20px",
                        paddingRight: "0",
                            }
                },
                tickBoxMaster : {
                    marginBottom: "15px",
                },
                chartSpinnerContainer : {
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    marginTop: "100px",
                    width: "150px",
                },
                chartSpinner : {
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "100px",
                },
                chartSpinnerText : {
                    marginTop: "20px",
                    textAlign: "center",
                },
                charts : {

                }
            },
            base: {
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                backgroundColor: 'white',
                padding: '20px',
                color: 'black',
                minHeight: '250px',
                verticalAlign: 'top',
                position: 'relative',
            },
            title : {
                display: 'inline'
            },
            countBox : {
                display:'inline-block',
                marginLeft: 'auto',               
                position: 'relative',
                width: '200px',
                height: '15px',
                "@media (max-width: 1200px)": {
                    maxWidth: "100px",
                },
                "@media (max-width: 600px)": {
                    maxWidth: "100px",
                }
            },
            countNum : {
                paddingLeft: '7px',
                display:'inline-block',
                minWidth: '30px',
                backgroundColor: '#444',
                color: 'white',
                height: '23px',            
            },
            duration : {
                display:'inline-block',
                marginRight: '10px',          
                textAlign : 'right',     
            },
            countDuration : {
                float:'right',
                marginLeft: 'auto',
             //   paddingLeft: '10px',
            },
            artistName : {
                fontSize: '24px',
                marginBottom: '10px',

            },
            albumName : {
                fontSize: '24px',
                marginBottom: '10px',
            },
            albumArtistName : {
                fontSize: '16px',
                marginBottom: '5px',
                cursor: "pointer",
                display: "inline-block",
                ":hover": {color:"cornflowerblue"}
            },
            albumArt : {
                display: 'inline-block',
                maxWidth: '200px',
                display: 'inline-block',
                verticalAlign: 'top',
                marginRight: '25px',
                marginBottom: '20px',
                '@media (max-width: 1200px)': {
                    maxWidth:'100%',
                }            
            },
          /*   albumTime : {
                display: 'inline-block',
                marginRight: '20px',
            },
            albumPlaycount : {
                display: 'inline-block',
                marginRight: '20px'
            },
            releaseYear : {
                display:'inline-block'
            },*/
            albumExtraInfo : {
                
            },
            albumMainInfo : {
                display:'inline-block'
            },
            albumInfo: {
                display: 'flex',
            },
            chart : {
                float: 'unset',
                order: 5,
                marginTop: '20px',
                display: 'inline-block',
            },
            tracksRangeStatus: {
                cursor: "pointer",
                marginBottom: '5px',
                display: "inline-block",
                ':hover': {color:"cornflowerblue"},
            },       
            enableChartIcon: {
                display: "inline-block",
                fontSize: "30px",
                marginRight: "10px",
                verticalAlign :"super",
                ":hover": {
                    color:"cornflowerblue",
                }
            },
            band : {
                Headers : {
                    fontSize: '15px',
                    fontWeight: '600',
                    marginBottom: '10px',
                },
                albumListItems : {
                    marginBottom: '40px',
                },
                chart : {
                    float: 'unset',
                    order: 5,
                    marginBottom: '20px',
                    display: 'inline-block',
                },
                bandInfo : {
                    marginBottom: '15px',
                },
                bandInfoBlock : {
                    display: 'inline-block',
                    marginRight: "30px",
                },
                miniHeader : {
                    fontWeight: '600',
                    fontSize: '18px',
                },
            },
            albumList : {
                artwork : {
                    maxWidth: '40px',
                    display: 'inline-block',
                    verticalAlign: 'top',
                },
                info: {
                    display: 'inline-block',
                    paddingLeft: '10px',
                },
                title : {
                    fontSize: '15px'
                },
                year : {
                    fontSize: '11px',
                },
                countBox : {
                    display:'inline-block',
                    width: '200px',
                    height: '15px',
                    float: 'right',
                    verticalAlign: 'top',
                    "@media (max-width: 1200px)": {
                        maxWidth: "100px",
                    },
                    "@media (max-width: 600px)": {
                        maxWidth: "100px",
                    }
                },
                countNum : {
                    paddingLeft: '7px',
                    display:'inline-block',
                    height: '30px', 
                    verticalAlign: 'top',
                    paddingTop: '4px',
                    minWidth: '30px',
                    backgroundColor: '#444',
                    color: 'white'  
                }
            }
        }
    };
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

    class NodeViewer extends React.Component {
        constructor(props) {
            super(props);
            console.log("aa");
            console.log(data);
            this.state = {checkAll:false, obj:this.props.node, extraData : history, check:false, mainData:data, checked:false, enableCharts: false, defaultCheckAll: true,
                 enableAlbumCharts: false, categories:[
                {id:1, value:"Alt", isChecked:false, color:"#ff1800"},
                {id:2, value:"Folk", isChecked:false, color:"#09be00"},
                {id:3, value:"City Pop", isChecked:false, color:"#608eff"},
                {id:4, value:"Jazz", isChecked:false, color:"#815400"},
                {id:5, value:"Powerviolence", isChecked:false, color:"#800000"},
                {id:6, value:"Friends", isChecked:false, color:"#ff00dc"},
                {id:7, value:"Noise Rock", isChecked:false, color:"#666666"},
                {id:8, value:"Shugazi", isChecked:false, color:"#bf0065"},
                {id:9, value:"Drone", isChecked:false, color:"#90d1f1"},
                {id:10, value:"Post-rock", isChecked:false, color:"#2b009c"},
                {id:11, value:"Ambient", isChecked:false, color:"#00d1ae"},
                {id:12, value:"Now", isChecked:false, color:"#643373"},
                {id:13, value:"Free", isChecked:false, color:"#c54e06"},
                {id:14, value:"Math", isChecked:false, color:"#930200"},
                {id:15, value:"Pre", isChecked:false, color:"#ff9e09"},
                {id:16, value:"Psych", isChecked:false, color:"#db85a2"},
                {id:22, value:"Industrial", isChecked:false, color:"#003d3e"},
                
                {id:18, value:"Post", isChecked:false, color:"#373434"},
                {id:19, value:"Hip-hop", isChecked:false, color:"#f1ee8f"},
                {id:23, value:"Classical", isChecked:false, color:"#b2ff00"},
                {id:26, value:"Kraut", isChecked:false, color:"#a75a16"},
                {id:27, value:"EBM", isChecked:false, color:"#576596"},
                {id:28, value:"Various Rock", isChecked:false, color:"#b3b46f"},
                {id:29, value:"Pop", isChecked:false, color:"#c10596"},
                {id:21, value:"Electronic", isChecked:false, color:"#00ff3e"},
                {id:17, value:"Hardcore & Crossover", isChecked:false, color:"#872d2d"},
                {id:20, value:"Minimal Wave", isChecked:false, color:"#661a83"},
                
                {id:24, value:"Noise & Power Electronics", isChecked:false, color:"#000000"},
                {id:25, value:"Singer-songwriter", isChecked:false, color:"#6baf77"},
                
            ]};
            this.handleClick = this.handleClick.bind(this);
            this.timePeriod = this.timePeriod.bind(this);
            this.getArtwork = this.getArtwork.bind(this);
        //    this.getAlbumData = this.getAlbumData.bind(this);
       //     this.getCategoryHistory = this.getBandData.bind(this);
            this.msToMinSec = this.msToMinSec.bind(this);
            this.getScrobbleTimes = this.getScrobbleTimes.bind(this);
            this.toggleCheck = this.toggleCheck.bind(this);
            this.handleClickReturn = this.handleClickReturn.bind(this);
         //   this.getResults = this.getResults.bind(this);         
        }

        handleCheckElement = (event) => {
            let categories = this.state.categories;
            categories.forEach(category => {
               if (category.value === event.target.value)
               category.isChecked =  event.target.checked;
            })
            this.setState({categories: categories});
        }

        handleAllChecked = (event) => {
            let categories = this.state.categories;
            categories.forEach(category => category.isChecked = event.target.checked);
            this.setState({categories: categories, defaultCheckAll: event.target.checked});
        }

        msToMinSec(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
          }

        getScrobbleTimes (data) {
            fetch("https://localhost:5000/getScrobbleTimes", {headers: {
            "Content-Type": "application/json",
            "ACcess-Control-Allow-Origin":"*",
             "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            }, method: 'post', body: JSON.stringify(data)})
            .then(res => res.json())
            .then(
            (result) => {
                var artist = this.state.mainData.children.find(x => x.name === data.artist);
                var album = artist.children.find(x => x.name === data.name);
                album.scrobbles = result;
                this.setState({obj:data});
            },
            (error) => {
                console.log(error);
                console.log("overalldatafetch - error in api");
                });            
        }

        timePeriod (data) {
            fetch("https://localhost:5000/overallAlbumData", {headers: {
            "Content-Type": "application/json",
            "ACcess-Control-Allow-Origin":"*",
             "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            }, method: 'post', body: JSON.stringify(data)})
            .then(res => res.json())
            .then(
            (result) => {
                var artist = this.state.mainData.children.find(x => x.name === data.artist);
                var album = artist.children.find(x => x.name === data.name);
                album.tracklist = result;
                if (album.tracklist && album.tracklist.length > 1){
                    for (var i = 0; i<album.tracklist.length; i++){
                        var dur = new Date(album.tracklist[i].duration);
                        album.tracklist[i].duration = dur.getTime();
                    }
                }
            //    this.setState({obj:data});
            },
            (error) => {
                console.log(error);
                console.log("overalldatafetch - error in api");
                });
        }

        getArtwork(data) {
            fetch("http://localhost:5000/getArtwork", {headers: {
                "Content-Type": "application/json",
                "ACcess-Control-Allow-Origin":"*",
                 "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                }, method: 'post', body: JSON.stringify(data)})
                .then(res => res.json())
                .then(
                (result) => {
                    var artist = this.state.mainData.children.find(x => x.name === data.artist);
                    var album = artist.children.find(x => x.name === data.name);
                    album.albumArt = "data:image/jpeg;base64," + result[0].AlbumArt;
               //     this.setState({obj:data});
                },
                (error) => {
                    console.log(error);
                    console.log("getartwork - error in api");
                    });
        }

        toggleCheck() {
            this.setState(prevState => ({check:!prevState.check}));
        }

        handleClick = (e, data) => {
        /*    if (data.type == 'band') {
                if (!data.scrobbles) {                
                 //   this.getBandData(data);
                }
                else {
                    this.setState({obj:data});
                }

            }
            else {*/
                this.setState({obj:data});
          //  }
        }    
        
        handleClickReturn = (albumArtist) => {
            this.doThis(albumArtist);
            }      

        doThis = (obj) => {            
            this.props.toggle(obj);  
            this.setState({obj:obj});
        }

        generateChart = () => {            
            if (this.state.enableCharts) {                
                this.setState({enableCharts:false});
            }
            else {
                this.setState({enableCharts:true});
            }
        }
        generateAlbumChart = () => {
            let tracksHeader = document.getElementById('albumPageTracklist');
            if (this.state.enableAlbumCharts) {
              //  tracksHeader.style.marginTop = "20px";           
                this.setState({enableAlbumCharts:false});
            }
            else {
             //   tracksHeader.style.marginTop = 0;
                this.setState({enableAlbumCharts:true});
            }
        }

        componentDidUpdate (previousProps, previousState) {            
            // ??????????????
            if (previousProps.node !== this.props.node) {
                this.handleClick(null, this.props.node);
                this.setState({
                    obj: this.props.node, mainData:this.props.data});
            }
            if (!this.state.checkAll) {
                let categories = this.state.categories;
                categories.forEach(category => category.isChecked = true);
                this.setState({categories: categories, checkAll: true});
            }
            if (this.state.obj) {
                var listTitle = document.getElementsByClassName('list-item-title');
                var listCountBox = document.getElementsByClassName("list-item-countBox");
                var listTrack = document.getElementsByClassName("list-item");
                if (listTrack) {
                    try {
                    for (var i = 0; i<listTrack.length; i++) {
                        listTitle[i].style.width = (listTrack[i].offsetWidth - (listCountBox[i].offsetWidth + 40)).toString() + "px";
                    }    }
                    catch (error) {
                        console.log(error);
                                        }         
                    
                }
                var listTitleContainer = document.getElementsByClassName('band-list-item-title-container');
                var listCountBox = document.getElementsByClassName("band-list-item-countBox");
                var listTrack = document.getElementsByClassName("band-list-item");
                if (listTrack) {
                    try {
                    for (var i = 0; i<listTrack.length; i++) {
                        listTitleContainer[i].style.width = (listTrack[i].offsetWidth - (listCountBox[i].offsetWidth + 100)).toString() + "px";
                    }    }
                    catch (error) {
                        console.log(error);
                    }  
                }
               switch (this.state.obj.type) {
                    case "band":
                    var bandPageAlbumList = document.getElementById("bandPageAlbumList");
                    if (bandPageAlbumList) {
                        bandPageAlbumList.style.marginTop = "-15px";
                    }
                    else {
                        bandPageAlbumList.style.marginTop = "-15px";
                    }
                    var artist = this.state.obj;
                    var albums = this.state.obj.children;
                    if (this.state.check) {                        
                        for (var i = 0; i<albums.length; i++){
                            if (albums[i].tracklist) {
                                albums[i]['varCount'] = albums[i].fullCount; 
                            }
                            else {
                                albums[i]['varCount'] = albums[i].count; 
                            }
                        }
                        for (var i = 0; i<artist.allTracks.length; i++){
                            artist.allTracks[i]['varCount'] = artist.allTracks[i].count; 
                        }
                    }
                    else {
                        for (var i = 0; i<albums.length; i++){
                            albums[i]['varCount'] = albums[i].count; 
                        }
                        for (var i = 0; i<artist.allTracks.length; i++){
                            artist.allTracks[i]['varCount'] = artist.allTracks[i].count; 
                        }
                    }
                    var countBoxes = document.getElementsByClassName(this.state.obj.name + 'albums'); 
                    var countBoxes2 = document.getElementsByClassName(this.state.obj.name + 'tracks');
                    var min = Infinity, max = -Infinity, min2 = Infinity, max2 = -Infinity;
                    
                    for (var i = 0; i < albums.length; i++ ) {
                        if (albums[i].varCount < min) {
                            min = albums[i].varCount;
                        }
                        if (albums[i].varCount > max) {
                            max = albums[i].varCount;
                        }
                    }
                    var mult = 100 / (Number(max) - Number(min) + 1);
                    for (var a = 0; a < countBoxes.length; a++) {
                        var width = (Number(countBoxes[a].textContent) - Number(min) + 1) * mult;
                        countBoxes[a].style.width = width + "%";
                    } 
                    ///
                    if (this.state.obj.allTracks) {
                        var tracks = this.state.obj.allTracks;
                        for (var i = 0; i < tracks.length; i++ ) {
                            if (tracks[i].varCount < min2) {
                                min2 = tracks[i].varCount;
                            }
                            if (tracks[i].varCount > max2) {
                                max2 = tracks[i].varCount;
                            }
                        }
                        var mult2 = 100 / (Number(max2) - Number(min2) + 1);
                        for (var b = 0; b < countBoxes2.length; b++) {
                            var width2 = (Number(countBoxes2[b].textContent) - Number(min2) + 1) * mult2;
                            countBoxes2[b].style.width = width2 + "%";
                        } 

                    }
                    break;
                    case "album":
                    var albumPageTracklist = document.getElementById('albumPageTracklist');
                    if (this.state.enableAlbumCharts) {
                        albumPageTracklist.style.marginTop = 0;
                        }
                    else 
                    {
                        albumPageTracklist.style.marginTop = "15px";
                    }
                       
                    
                    if (this.state.check) {
                        console.log(this.state);
                        
                        var artist = this.state.mainData.children.find(x => x.name === this.state.obj.artist);
                        if (artist) {
                            var album = artist.children.find(x => x.name === this.state.obj.name);
                            if (album.tracklist && album.tracklist.length > 0 ) {var albumSongs = album.tracklist}
                            else {var albumSongs = this.state.obj.tracks;this.toggleCheck();}
                        }
                        else {var albumSongs = this.state.obj.tracks;this.toggleCheck();}
                    }
                    else {
                        console.log(this.state);
                        var albumSongs = this.state.obj.tracks;
                    }
                    var countBoxes = document.getElementsByClassName(this.state.obj.name + 'playcount'); 
                    var min = Infinity, max = -Infinity;
                    for (var i = 0; i < albumSongs.length; i++ ) {
                        if (albumSongs[i].count < min) {
                            min = albumSongs[i].count;
                        }
                        if (albumSongs[i].count > max) {
                            max = albumSongs[i].count;
                        }
                    }
                    var mult = 100 / (Number(max) - Number(min) + 1);
                    for (var a = 0; a < countBoxes.length; a++) {
                        var width = (Number(countBoxes[a].textContent) - Number(min) + 1) * mult;
                        countBoxes[a].style.width = width + "%";
                    } 

                    break;
                    case "track":
                    break;                    
                }              
            } else {
                
                if (this.props.history && this.props.history.length > 0) {
                    let charts = document.getElementById('mainPageCharts');
                    let chartSpinner = document.getElementById('chartSpinner');
                    if (chartSpinner) {
                        chartSpinner.style.opacity = 0;
                        charts.style.position = "static";
                        charts.style.opacity = 1;
                    }                    
                }
            }  
          }
// ********************************************************* RENDER *********************************************************
// ********************************************************* RENDER *********************************************************
// ********************************************************* RENDER *********************************************************
// ********************************************************* RENDER *********************************************************
// ********************************************************* RENDER *********************************************************
// ********************************************************* RENDER *********************************************************
        render() {
            var {obj} = this.state;
            const style = styles.viewer;
            var midscreen = document.getElementById('midscreen');
            if (midscreen) { 
                var chartWidth = midscreen.offsetWidth - 100;
            }           
            if (this.state.obj) { 
                switch (this.state.obj.type) {
                    case "band":
                    var artist = this.state.obj;              
                    var albumsClassName = this.state.obj.name + 'albums';
                    var tracksClassName = this.state.obj.name + 'tracks';
                    var plays = 0;
                    var timeSpentListening = 0;
                    this.state.obj.allTracks = [];
                    for (var i = 0; i < artist.children.length; i++) {
                        let album = artist.children[i];
                        if (album.albumArt && album.albumArt.length > 23) {  
                            album.albumArt = album.albumArt;                            
                        } 
                        else {
                            album.albumArt = "https://www.focus-on-success.co.uk/assets/img/placeholder-square-1.png";
                        }
                    }
                    if (this.state.check) {
                        var status = "Overall";
                        var rangeStart = -Infinity;
                        var rangeEnd = Infinity;                        
                        for (var i = 0; i<artist.children.length; i++){
                            let album = artist.children[i];
                            if (album.tracklist) {
                                album['varCount'] = album.fullCount; 
                                plays += album.fullCount;
                                for (var z = 0; z < album.tracklist.length; z++) {
                                    if (!album.tracklist[z].count) {
                                        album.tracklist[z].count = 0;
                                    }
                                    artist.allTracks.push(album.tracklist[z]);
                                    let dur = album.tracklist[z].duration * album.tracklist[z].count;
                                    timeSpentListening += dur;
                                }                                
                            }
                            else {
                                album['varCount'] = album.count; 
                                plays += album.count;
                                for (var z = 0; z < album.tracks.length; z++) {
                                    artist.allTracks.push(album.tracks[z]);
                                }  
                            }
                        }
                        for (var i = 0; i<artist.allTracks.length; i++){
                            artist.allTracks[i]['varCount'] = artist.allTracks[i].count; 
                        }
                    }
                    else {
                        var rangeStart = Dates.start;
                        var rangeEnd = Dates.end;
                        var status = "From " + months[rangeStart.getMonth()] + " " + rangeStart.getDate() + ", " + rangeStart.getFullYear() + " to " + months[rangeEnd.getMonth()] + " " + rangeEnd.getDate() + ", " + rangeEnd.getFullYear();
                        for (var i = 0; i<artist.children.length; i++){
                            let album = artist.children[i];
                            album['varCount'] = album.count; 
                            plays += album.count;
                            for (var z = 0; z < album.tracks.length; z++) {
                                artist.allTracks.push(album.tracks[z]);
                                let dur = album.tracks[z].duration * album.tracks[z].count;
                                timeSpentListening += dur;
                            }  
                        }
                        for (var i = 0; i<artist.allTracks.length; i++){
                            artist.allTracks[i]['varCount'] = artist.allTracks[i].count; 
                        }
                    }
                    timeSpentListening = msToMinSec(timeSpentListening);

                    /*
                    *
                    * ALBUM LIST IN BAND WINDOW
                    *
                    */

                    var albumListItems = this.state.obj.children.map((album) =>
                    <li  className={'band-list-item'} onClick={((e) => this.handleClick(e, album))}>
                        <div>
                            <img style={style.albumList.artwork} src={album.albumArt} />
                            <div className='band-list-item-title-container' style={style.albumList.info}>
                                <div className='band-list-item-title' style={style.albumList.title}>{album.name}</div>                                
                                <div style={style.albumList.year}>{album.year}</div>
                            </div>
                            <StyleRoot style={style.albumList.countBox}><div className='band-list-item-countBox' style={style.albumList.countBox}>
                                <div style={style.albumList.countNum} className={albumsClassName}>{album.varCount}</div>
                            </div></StyleRoot>
                        </div>                               
                    </li>);
                    
                    /*
                    *
                    // TOP 25 TRACKS IN BAND WINDOW
                    *
                    */
                    artist.allTracks.sort(sort_by('count', true));
                    var trackListItems = artist.allTracks.slice(0, 25).map((track) =>
                    <li className={'album-list-item'}>
                        <div className={'album-list-item-div list-item'}>
                            <div className='list-item-title' style={style.title}>{track.name}</div>
                            <StyleRoot  style={style.countDuration}><div className='list-item-countBox' style={style.countDuration}>
                                <div style={style.duration}>{this.msToMinSec(track.duration)}</div>
                                <div style={style.countBox}>
                                    <div style={style.countNum} className={tracksClassName}>{track.varCount}</div>
                                </div>
                            </div></StyleRoot>
                        </div>
                    </li> );

                    // ITERATE OVER ALBUMS
                    
                    var albumYearChartOptions = [];
                    var min = Infinity, max = -Infinity, firstListenDate = Infinity;
                    for (var a = 0; a < artist.children.length; a++) {
                        var album = artist.children[a];
                        if (!album.year) {
                            album.year = "Unknown year";
                        }
                        if (!album.category) {
                            album.category = "Unknown";
                        }
                        if (album.scrobbles && album.scrobbles.length > 0) {
                            for (var i = 0; i < album.scrobbles.length; i++ ) {
                                let scrobbleDate = new Date(Number(album.scrobbles[i]));
                                let sc = scrobbleDate.getTime();
                                if (sc < firstListenDate) { 
                                    firstListenDate = sc;                                  
                                }
                                if (scrobbleDate >= rangeStart && scrobbleDate <= rangeEnd) {
                                    let c = scrobbleDate.getTime();
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

                                for (var i = 0; i<album.scrobbles.length; i++) {
                                    var scrobbleDate = new Date(Number(album.scrobbles[i]));
                                    if (scrobbleDate >= rangeStart && scrobbleDate <= rangeEnd) {
                                        var c = scrobbleDate.getFullYear()
                                        if (albumYearChartOptions.filter(x => x.name === c).length > 0) {
                                            var oldValue = albumYearChartOptions.find(x => x.name === c);
                                            if (oldValue[album.name]) {
                                                oldValue[album.name] += 1;
                                            }
                                            else {                                                
                                                oldValue[album.name] = 1;
                                            }
                                        }
                                        else {
                                            var chartObj = {'name':c, 'sortcode':scrobbleDate.getTime()};
                                            chartObj[album.name] = 1;
                                            albumYearChartOptions.push(chartObj);
                                        }      
                                    }                                  
                                }
                            }
    
                            else if (diff < 901 && diff > 31) {

                                for (var i = 0; i < album.scrobbles.length; i++) {
                                    var scrobbleDate = new Date(Number(album.scrobbles[i]));
                                    if (scrobbleDate >= rangeStart && scrobbleDate <= rangeEnd) {
                                        var c = months[scrobbleDate.getMonth()] + " " + scrobbleDate.getFullYear();
                                        if (albumYearChartOptions.filter(x => x.name === c).length > 0) {
                                            var oldValue = albumYearChartOptions.find(x => x.name === c);
                                            if (oldValue[album.name]) {
                                                oldValue[album.name] += 1;
                                            }
                                            else {                                                
                                                oldValue[album.name] = 1;
                                            }
                                        }
                                        else {
                                            var chartObj = {'name':c, 'sortcode':scrobbleDate.getTime(), 'amt':2500};
                                            chartObj[album.name] = 1;
                                            albumYearChartOptions.push(chartObj);
                                        }                                             
                                    }                                       
                                }
                            }
                            else if (diff < 32) {
                                
                                for (var i = 0; i < album.scrobbles.length; i++) {
                                    var scrobbleDate = new Date(Number(album.scrobbles[i]));
                                    if (scrobbleDate >= rangeStart && scrobbleDate <= rangeEnd) {
                                        var c = months[scrobbleDate.getMonth()] + " " + scrobbleDate.getDate() + ", " + scrobbleDate.getFullYear();
                                        if (albumYearChartOptions.filter(x => x.name === c).length > 0) {
                                            var oldValue = albumYearChartOptions.find(x => x.name === c);
                                            if (oldValue[album.name]) {
                                                oldValue[album.name] += 1;
                                            }
                                            else {                                                
                                                oldValue[album.name] = 1;
                                            }
                                          
                                        }
                                        else {
                                            var chartObj = {'name':c, 'sortcode':scrobbleDate.getTime()};
                                            chartObj[album.name] = 1;
                                            albumYearChartOptions.push(chartObj);
                                        }   
    
                                    }                                     
                                }
                            }
                            albumYearChartOptions.sort((a,b) => (a.sortcode > b.sortcode) ? 1 : ((b.sortcode > a.sortcode) ? -1 : 0));
                        } 
                        else if (!firstListenDate) {
                            firstListenDate = "Unknown";
                        }
                    } 
                    if (!artist.category) {
                        artist.category = "Unknown";
                    }
                    firstListenDate = new Date(firstListenDate);
                    firstListenDate = months[firstListenDate.getMonth()] +  " " + firstListenDate.getFullYear();    
                    var bars = artist.children.map((alb, index) => <Bar dataKey={alb.name} barSize={10} fill={albumColorCodes[index]} />);                   
                    
                    if (this.state.enableCharts) {                            
                        var historyChart =  <div>
                                                <div style={style.band.Headers}>Listening History</div>
                                                    <div className='allCharts' id='bandChart' style={style.band.chart}>
                                                        <BarChart
                                                            layout={'horizontal'}
                                                            width={chartWidth}
                                                            height={200}
                                                            data={albumYearChartOptions}
                                                            barCategoryGap='30%'
                                                            margin={{
                                                            top: 5, right: 5, left: 5, bottom: 5,
                                                            }}
                                                        >
                                                            <CartesianAxis viewBox="3 3 3 3"/>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="name" type="category"/>
                                                            <YAxis />
                                                            <Tooltip />
                                                            <Legend />
                                                            {bars}
                                                        </BarChart>
                                                    </div>
                                                </div> 
                    }
                    else {                            
                        var historyChart = ""
                    }
                    
                    
                             
                    return (
                        <div style={style.base}>
                            <div style={style.artistName}>{this.state.obj.name}</div>                            
                            <StyleRoot style={styles.styleRootInlineBlock}><i onClick={this.generateChart} style={style.enableChartIcon} className="fa fa-bar-chart" aria-hidden="true"></i></StyleRoot>
                            <StyleRoot style={styles.styleRootInlineBlock}>
                                <div style={style.tracksRangeStatus} onClick={(e) => this.toggleCheck()}>
                                <div>Range:</div>
                                <div>{status}</div>
                                </div>
                            </StyleRoot>
                            <div style={style.band.bandInfo}>
                                <div style={style.band.bandInfoBlock}>
                                    <div>Listens</div>
                                    <div style={style.band.miniHeader}>{plays}</div>
                                </div>
                                <div style={style.band.bandInfoBlock}>
                                    <div>Category</div>
                                    <div style={style.band.miniHeader}>{this.state.obj.category}</div>
                                </div>
                                <div style={style.band.bandInfoBlock}>
                                    <div>Time listened</div>
                                    <div style={style.band.miniHeader}>{timeSpentListening}</div>
                                </div>
                                <div style={style.band.bandInfoBlock}>
                                    <div>Listening since</div>
                                    <div style={style.band.miniHeader}>{firstListenDate}</div>
                                </div>
                            </div>
                            {historyChart}                   
                            <div id='bandPageAlbumList' style={style.band.Headers}>Albums</div>   
                            <div style={style.band.albumListItems}>{albumListItems}</div>
                            <div style={style.band.Headers}>Top Tracks</div>
                            <ol style={style.band.allTracks}>{trackListItems}</ol>                            
                        </div>
                    );
                    // ********************************************************* ALBUM RENDER *********************************************************
                    // ********************************************************* ALBUM RENDER *********************************************************
                    // ********************************************************* ALBUM RENDER *********************************************************
                    case "album":
                    var album = this.state.obj;
                    if (this.state.check) {
                        var status = "Overall";
                        var rangeStart = -Infinity;
                        var rangeEnd = Infinity;
                        if (album.tracklist && album.tracklist.length > 0 ) {
                            for (var i = 0; i < album.tracklist.length; i++ ) {
                                if (!album.tracklist[i].count) {
                                    album.tracklist[i].count = 0;
                                }
                            }
                            var albumSongs = album.tracklist;
                        }
                        else {var albumSongs = album.tracks;} 
                    }
                    else {
                        var rangeStart = Dates.start;
                        var rangeEnd = Dates.end;
                        var albumSongs = album.tracks;
                        var status = "From " + months[rangeStart.getMonth()] + " " + rangeStart.getDate() + ", " + rangeStart.getFullYear() + " to " + months[rangeEnd.getMonth()] + " " + rangeEnd.getDate() + ", " + rangeEnd.getFullYear();
                    }
                    if (album.albumArt && album.albumArt.length > 23) {   
                        var artwork = album.albumArt;
                    }
                    else {
                        var artwork = "https://www.focus-on-success.co.uk/assets/img/placeholder-square-1.png";
                    }
                    if (album.tracklist && album.tracklist.length > 0 ) {
                        var runTime = 0;
                        var fullCount = 0;
                        var trackCounter = 0;
                        for (var i = 0; i<albumSongs.length; i++) {
                            runTime += Number(albumSongs[i].duration);
                            fullCount += Number(albumSongs[i].count);
                            trackCounter += 1;
                        }
                        runTime = msToMinSec(runTime);
                        fullCount = Math.floor((fullCount / trackCounter ) * 100) / 100 + " (" + fullCount + ")";
                    }
                    else {
                        var runTime = "Unknown";
                        var fullCount = "Unknown";
                    }
                    if (album.scrobbles && album.scrobbles.length > 0) {
                        var min = Infinity, max = -Infinity;
                        for (var i = 0; i < album.scrobbles.length; i++ ) {
                            let scrobbleDate = new Date(Number(album.scrobbles[i]));
                            if (scrobbleDate >= rangeStart && scrobbleDate <= rangeEnd) {
                                let c = scrobbleDate.getTime();
                                if (c < min) {
                                    min = c;
                                }
                                if (c > max) {
                                    max = c;
                                }
                            }
                        }
                        var diff = Math.floor((max - min) / msPerDay);
                        var albumYearChartOptions = [];
                        if (diff > 900) {
                            
                            for (var i = 0; i<album.scrobbles.length; i++) {
                                var scrobbleDate = new Date(Number(album.scrobbles[i]));
                                if (scrobbleDate >= rangeStart && scrobbleDate <= rangeEnd) {
                                    var c = scrobbleDate.getFullYear()
                                    if (albumYearChartOptions.filter(x => x.name === c).length > 0) {
                                        var oldValue = albumYearChartOptions.find(x => x.name === c);
                                        oldValue.count += 1;
                                    }
                                    else {
                                        albumYearChartOptions.push({'name':c, 'count':1, 'sortcode':scrobbleDate.getTime()});
                                    }      
                                }                                  
                            }
                        }
                        else if (diff < 901 && diff > 31) {
                            
                            for (var i = 0; i < album.scrobbles.length; i++) {
                                var scrobbleDate = new Date(Number(album.scrobbles[i]));
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
                            }
                            albumYearChartOptions.sort((a,b) => (a.sortcode > b.sortcode) ? 1 : ((b.sortcode > a.sortcode) ? -1 : 0));
                        }
                        else if (diff < 32) {
                            
                            for (var i = 0; i < album.scrobbles.length; i++) {
                                var scrobbleDate = new Date(Number(album.scrobbles[i]));
                                if (scrobbleDate >= rangeStart && scrobbleDate <= rangeEnd) {
                                    var c = months[scrobbleDate.getMonth()] + " " + scrobbleDate.getDate() + ", " + scrobbleDate.getFullYear();
                                    if (albumYearChartOptions.filter(x => x.name === c).length > 0) {
                                        var oldValue = albumYearChartOptions.find(x => x.name === c);
                                        oldValue.count += 1;
                                    }
                                    else {
                                        albumYearChartOptions.push({'name':c, 'count':1, 'sortcode':scrobbleDate.getTime()});
                                    }   

                                }                                     
                            }
                        }
                    }                        

                    if (!album.year) {
                        var releaseYear = "Unknown";
                    }
                    else {
                        var releaseYear = album.year;
                    }
                    var className = album.name + 'playcount';
                    var listItems = albumSongs.map((track) =>
                    <li className={'album-list-item'}>
                        <div className={'list-item'}>
                            <div className='list-item-title' style={style.title}>{track.name}</div>
                            <div className='list-item-countBox' style={style.countDuration}>
                                <div style={style.duration}>{this.msToMinSec(track.duration)}</div>
                                <StyleRoot  style={style.countBox}><div style={style.countBox}>
                                    <div style={style.countNum} className={className}>{track.count}</div>
                                </div></StyleRoot>
                            </div>
                        </div>
                    </li>                    
                    );
                    var albumPageTracklist = document.getElementById('albumPageTracklist');
                    if (this.state.enableAlbumCharts) {
                           // albumPageTracklist.style.marginTop = 0;
                            var albumChart = <div id='chart' style={style.chart}>
                            <BarChart
                                layout={'horizontal'}
                                width={chartWidth}
                                height={200}
                                data={albumYearChartOptions}
                                margin={{
                                top: 5, right: 5, left: 5, bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" type="category"/>
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" barSize={20} fill="#4266a9c7" />
                            </BarChart>
                        </div> 
                        }
                        else {                                                                                  
                            var albumChart = "";
                        }
                    
                    
                    var albumArtist = album.artist;
                    if (this.props.data) {
                        var albumArtistObj = this.props.data.children.find(x => x.name == albumArtist);
                    }
                    return (
                        
                            <div style={style.base}>
                            
                                <div id='albumInfoWindow' style={style.albumInfo}>
                                    <StyleRoot style={styles.styleRootFlex}> <img style={style.albumArt} src={artwork}></img></StyleRoot>
                                    <div style={style.albumMainInfo}>
                                        <StyleRoot> <div style={style.albumArtistName} onClick={((e) => this.handleClickReturn(albumArtistObj))}>{albumArtist}</div></StyleRoot>
                                        <div style={style.albumName}>{this.state.obj.name}</div>
                                        <StyleRoot style={styles.styleRootInlineBlock}><i onClick={this.generateAlbumChart} style={style.enableChartIcon} className="fa fa-bar-chart" aria-hidden="true"></i></StyleRoot>
                                        <StyleRoot style={styles.styleRootInlineBlock}>
                                            <div style={style.tracksRangeStatus} onClick={(e) => this.toggleCheck()}>
                                                <div>Range:</div>
                                                <div>{status}</div>
                                            </div>
                                        </StyleRoot>
                                        <div style={style.albumExtraInfo}>
                                            <div style={style.band.bandInfoBlock}>
                                                <div>Listens:</div>
                                                <div style={style.band.miniHeader}>{fullCount}</div>
                                            </div>
                                            <div style={style.band.bandInfoBlock}>
                                                <div>Category</div>
                                                <div style={style.band.miniHeader}>{this.state.obj.category}</div>
                                            </div>                                    
                                            <div style={style.band.bandInfoBlock}>
                                                <div>Running time:</div>
                                                <div style={style.band.miniHeader}>{runTime}</div>
                                            </div>
                                            <div style={style.band.bandInfoBlock}>
                                                <div>Released:</div>
                                                <div style={style.band.miniHeader}>{releaseYear}</div>
                                            </div>   
                                        </div>                                
                                    </div>                            
                                </div> 
                                
                                {albumChart}
                                <div id='albumPageTracklist' style={style.band.Headers}>Tracks</div>                                
                                <ol>{listItems}</ol>
                                                        
                            </div>
                        
                    );
                    case "track":
                    return (
                        <div style={style.base}>
                            <div style={style.topTitle}>{this.state.obj.name}</div>
                        </div>
                    );
                }
            }
            else {
                var boxes = this.state.categories.map((category, index) => 
                    <div style={style.main.tickBoxContainer}>
                        <div style={style.main.tickBox}><Checkbox handleCheckElement={this.handleCheckElement} {...category}/> </div> 
                        <span style={style.main.tickBoxLabel} >{category.value}</span>
                    </div>                
                )
               
            
                chartWidth += 50;
                var allCategories = [];
                
                if (this.props.history && this.props.history.length > 0) {
                    for (var i = 0; i<this.props.history.length; i++){
                        Object.keys(this.props.history[i]).forEach(e => {
                            var o = {};
                            if (e != "name"){
                                var cat = allCategories.find(a => a.category == e);
                                if (cat) {     
                                    cat.count += this.props.history[i][e];
                                }
                                else {
                                    o.category = e;                                
                                    o.count = this.props.history[i][e];   
                                    allCategories.push(o);                             
                                }
                                
                            }                                                
                        })
                    }
                    
                }
                var tickedBoxes = [];
                var tickedBars = [];
                for (var i = 0; i<this.state.categories.length; i++) {
                    if (this.state.categories[i].isChecked) {
                        var tickedBar = allCategories.find(e => e.category == this.state.categories[i].value);

                        if ((tickedBar) && (tickedBar.category != "Various" || tickedBar.category != "Mixtapes" || tickedBar.category != "Rock")) {
                            tickedBars.push(tickedBar);
                        }
                        
                        tickedBoxes.push(this.state.categories[i]);
                    }
                }
                
                var lines = tickedBoxes.map((box) => <Line type="monotone" dataKey={box.value} stroke={box.color} isAnimationActive={false}/>);
                var barChartHeight = 40 * tickedBars.length;
                if (barChartHeight < 100) barChartHeight = 100; 
                let lineData = this.props.history;
                
                
                return (
                    <StyleRoot>
                        <div id='listeningHistory'>
                            <div style={style.main.mainHeader}>Listening History & Data</div>
                            <div style={style.main.tickBoxes}>
                                <div style={style.main.tickBoxMaster}>
                                <input defaultChecked={this.state.defaultCheckAll} style={style.main.tickBox} readOnly type="checkbox" onClick={this.handleAllChecked} value="checkedall" />
                                <span style={style.main.tickBoxLabel}>Check / Uncheck All</span>
                                </div>                     
                                <div>{boxes}</div>
                            </div>
                            <div id='chartSpinner' style={style.main.chartSpinnerContainer}>  
                                <div style={style.main.chartSpinner} ><Spinner size={100} spinnerColor={"#333"} spinnerWidth={3} visible={true} /></div>   
                                <p  style={style.main.chartSpinnerText}>Generating chart data</p>
                            </div>   
                            <div id='mainPageCharts'>                         
                                <LineChart width={chartWidth} height={600} data={lineData} >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    {lines}

                                </LineChart>
                                <BarChart
                                    layout={'vertical'}
                                    width={chartWidth}
                                    height={barChartHeight}
                                    data={tickedBars}
                                    margin={{
                                    top: 5, right: 15, left: 5, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number"/>
                                    <YAxis width={100} dataKey="category" type="category"/>
                                    <Tooltip/>
                                    <Bar  barSize={20} dataKey="count" fill="#82ca9d" />
                                </BarChart>
                            </div>
                        </div>
                    </StyleRoot>
                  );
            }
        }
    }
    NodeViewer.propTypes = {
        node: PropTypes.object
    };

// ###################################################### PARENT COMPONENT ###################################################### 
// ###################################################### PARENT COMPONENT ######################################################  
// ###################################################### PARENT COMPONENT ######################################################  

    class TreeExample extends React.Component {
        constructor(props) {
            super(props);
            this.state = {data:data,extra:extra, width:window.innerWidth, sortBy:"Sort by: Count", ready:false, tablet:false, mobile:"left"};
            this.getBandData = this.getBandData.bind(this);
            this.onToggle = this.onToggle.bind(this);
            this.tabletSwitchScreen = this.tabletSwitchScreen.bind(this);
            this.mobileSwitchLeft = this.mobileSwitchLeft.bind(this);
            this.mobileSwitchRight = this.mobileSwitchRight.bind(this);
            this.updateDimensions = this.updateDimensions.bind(this);
            this.updatedDim = throttle(200, this.updateDimensions);
        }
        
        updateDimensions() {
            this.setState({width:window.innerWidth});
          }

        extraData(info) {
            console.log("info+ " + info);
        }

        getBandData(data) {
            if (data.type == 'band') {
                var send = {'name': data.name}
                var check1 = false, check2 = false, check3 = false;
            fetch(link + "/overallAlbumData2", {headers: {
                "Content-Type": "application/json",
                "ACcess-Control-Allow-Origin":"*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                }, method: 'post', body: JSON.stringify(send)})
                .then(res => res.json())
                .then(
                (result) => {
                    if (result.data.length > 0) {
                        var artist = this.state.data.children.find(x => x.name === data.name);
                        if (artist) {
                            for (var i = 0; i<result.data.length; i++) {
                                var album = artist.children.find(x => x.name === result.data[i].album);
                                if (album) {
                                    if (!album.tracklist) {
                                        album.tracklist = [];
                                    }
                                    if (!album.tracklist.filter(e => e.name === result.data[i].name).length > 0) {
                                        album.tracklist.push(result.data[i]);  
                                    }                                                                
                                }
                            }
                            for (var z = 0; z<artist.children.length; z++ ) {
                                if (artist.children[z].tracklist && artist.children[z].tracklist.length > 1){
                                    artist.children[z]['fullCount'] = 0;
                                    for (var y = 0; y<artist.children[z].tracklist.length; y++){
                                      //  var dur = new Date(artist.children[z].tracklist[y].duration);
                                      //  artist.children[z].tracklist[y].duration = dur.getTime();                                     
                                        artist.children[z]['fullCount'] += artist.children[z].tracklist[y].count;
                                    }
                                }    

                            }
                        //    this.setState({obj:data});
                        }
                    }
                    if (result.art.length > 0) {
                        var artist = this.state.data.children.find(x => x.name === data.name);
                        if (artist) {
                            for (var i = 0; i<result.art.length; i++) {
                                var album = artist.children.find(x => x.name === result.art[i].AlbumName);
                                if (album) {
                                    album.albumArt = "data:image/jpeg;base64," + result.art[i].AlbumArt;                                    
                                }
                            }
                       //     this.setState({obj:data});
                        }
                    }
                    if (result.scro.length > 0) {
                        var artist = this.state.data.children.find(x => x.name === data.name);
                        if (artist) {
                            // for bands
                            for (var i = 0; i<result.scro.length; i++) {
                                var album = artist.children.find(x => x.name === result.scro[i].AlbumName);
                                if (album) {
                                    if (!album.scrobbles) {
                                        album.scrobbles = [];
                                    }
                                    if (!album.scrobbles.filter(e => e === result.scro[i].TimePlayed).length > 0) {
                                        album.scrobbles.push(result.scro[i].TimePlayed); 
                                    }                                  
                                }
                            }
                            
                        }               
                    }
                    this.setState({obj:data}); 
                },
                (error) => {
                    console.log(error);
                    console.log("overalldatafetch - error in api");
                    });                

            }
                
        }

        initialize = () => {
            var a = document.getElementById('content');
            var b = document.getElementById('toggleRangePeriod');
            a.style.opacity = 1;
            b.style.opacity = 1;
            spinnerDiv.style.opacity = 0;
            setTimeout(function(){ spinnerDiv.style.display = "none"; }, 300);
        }

        onToggle2(node) {
            var {cursor} = this.state;
            node.active = false;
                cursor.active = false;
            if (node.active == true) {
                node.active = false;
                cursor.active = false;
            }

            var zh = this.state;
            this.setState({cursor:node});
        }
        onToggle(node, toggled) {
            var {cursor} = this.state;


            if (cursor) {            
                cursor.active = false;
            }
            if (this.state.width > 460 && this.state.width < 768) {
                this.tabletSwitchScreen("normalize2");
                this.setState({tablet:true, mobile:"mid"})
            }
            else if (this.state.width < 461) {
                this.mobileSwitchLeft("normalizeMid");
                this.setState({tablet:true, mobile:"mid"})
            }
            node.active = true;
            if (node.children) {
                if (!toggled) {
                    if (node == this.state.cursor) {
                        node.toggled = toggled;
                    }
                }
                else {
                    node.toggled = toggled;
                }
                
            }
            if (node.type == 'band') {
                if (!node.children[0].scrobbles) {
                    this.getBandData(node);
                }                            
            }
                this.setState({cursor: node});
            
        }
        tabletSwitchScreen = (e) => {
            const rightList = document.getElementById('rightList');
            const leftList = document.getElementById('leftSideList');
            const buttonRow = document.getElementById('leftButtonRow');
            const midscreen = document.getElementById('midscreen');
            const rightSideList = document.getElementById('rightSideList');
            if (e) {
                if (e == "normalize1") {
                    leftList.style.height = "auto";
                    buttonRow.style.height = "auto";
                    buttonRow.style.opacity = 1;
                    rightList.style.opacity = 1;
                    rightList.style.position = "fixed";
                    leftList.style.position = "relative";
                    rightSideList.style.height = "calc(100vh - 24px)";
                    rightList.style.maxWidth = "44%";
                    rightList.style.width = "100%";
                    midscreen.style.opacity = 0;
                    rightList.style.right = "16px";
                    rightList.style.top = "0px";
                    rightSideList.style.position = "relative";
                }
                else if (e == "normalize2") {
                    leftList.style.height = 0;
                    leftList.style.position = "absolute";
                    buttonRow.style.height = 0;
                    buttonRow.style.opacity = 0
                    midscreen.style.opacity = 1;
                    midscreen.style.height = "100vh";
                    rightList.style.position = "absolute";
                    rightList.style.width = 0;
                }
                else {
                    midscreen.style.opacity = 1;
                    midscreen.style.height = "100vh";
                    rightList.style.maxWidth = "100%";
                    rightList.style.width = "100%";
                    rightList.style.position = "relative";
                    leftList.style.position = "absolute";
                    leftList.style.height = "auto";
                    buttonRow.style.height = "auto";
                    buttonRow.style.opacity = 1;
                    rightList.style.opacity = 1;
                    rightList.style.right = "0px";
                    rightList.style.top = "0px";
                    rightSideList.style.position = "relative";
                    rightSideList.style.float = "right";
                }
            }
            else {
                if (!this.state.tablet) {                    
                    leftList.style.height = 0;
                    leftList.style.position = "absolute";
                    buttonRow.style.height = 0;
                    rightList.style.position = "absolute";
                    buttonRow.style.opacity = 0;
                    rightList.style.width = 0;
                    this.setState({tablet:true, mobile:"mid"})
                }
                else {
                    leftList.style.height = "auto";
                    buttonRow.style.height = "auto";
                    rightSideList.style.height = "calc(100vh - 24px)";
                    buttonRow.style.opacity = 1;
                    rightList.style.width = "100%";
                    rightList.style.opacity = 1;
                    this.setState({tablet:false, mobile:"left"})
                }   
            }
                     

        }

        mobileSwitchLeft = (e) => {
            const rightList = document.getElementById('rightList');
            const leftList = document.getElementById('leftSideList');
            const rightSideList = document.getElementById('rightSideList');
            const buttonRow = document.getElementById('leftButtonRow');
            const midscreen = document.getElementById('midscreen');
            if (e) {
                if (e == "normalizeMid") {
                    leftList.style.height = 0;
                    buttonRow.style.opacity = 0;
                    buttonRow.style.height = 0;
                    leftList.style.position = "absolute";
                    midscreen.style.height = "100vh";
                    midscreen.style.opacity = 1; 
                }
                else if (e == "normalizeLeft") {
                    rightList.style.position = "absolute";
                    leftList.style.position = "relative";                    
                    leftList.style.height = "calc(100vh - 27px)";
                }
                else if (e == "normalizeRight") {
                    rightList.style.right = "-15px";
                    rightList.style.top = 0;
                    rightSideList.style.position = "absolute";
                    rightList.style.position = "relative";
                    rightSideList.style.right = "auto";
                    leftList.style.height = 0;
                    rightSideList.style.height = "calc(100vh - 50px)"; 
                    buttonRow.style.opacity = 0;
                    buttonRow.style.height = 0;
                    midscreen.style.height = 0;
                    rightList.style.maxWidth = "100%";  
                    rightList.style.height = "auto";  
                }
            }
            else {
                if (this.state.mobile == "left") {
                    leftList.style.height = 0;
                    buttonRow.style.opacity = 0;
                    buttonRow.style.height = 0;
                    midscreen.style.height = 0;
                    rightList.style.maxWidth = "100%";               
                    rightList.style.opacity = 1;
                    rightList.style.width = "100%";
                    rightList.style.height = "auto";  
                    leftList.style.position = "absolute";
                    rightSideList.style.height = "calc(100vh - 50px)";              
                    rightList.style.position = "relative";
                    rightList.style.right = "-15px";
                    rightList.style.top = 0;
                    rightSideList.style.position = "absolute";
                    rightSideList.style.right = "auto";
                    this.setState({mobile:"right", tablet:false});
                }
                else if (this.state.mobile == "right") {
                    rightList.style.opacity = 0;
                    rightList.style.height = 0;
                    midscreen.style.height = "100vh";
                    leftList.style.position = "absolute";
                    midscreen.style.opacity = 1; 
                    this.setState({mobile:"mid", tablet:true});
                }
                else if (this.state.mobile == "mid") {
                    midscreen.style.height = 0;
                    leftList.style.height = "calc(100vh - 27px)";
                    buttonRow.style.opacity = 1;
                    leftList.style.position = "relative";
                    buttonRow.style.height = "auto";
                    this.setState({mobile:"left", tablet:false});
                }
            }
        }

        mobileSwitchRight = (e) => {
            const rightList = document.getElementById('rightList');
            const leftList = document.getElementById('leftSideList');
            const rightSideList = document.getElementById('rightSideList');
            const buttonRow = document.getElementById('leftButtonRow');
            const midscreen = document.getElementById('midscreen');            
            if (this.state.mobile == "left") {
                rightList.style.opacity = 0;
                rightList.style.height = 0;
                leftList.style.position = "absolute";
                midscreen.style.height = "100vh";
                midscreen.style.opacity = 1; 
                this.setState({mobile:"mid", tablet:true});                
            }
            else if (this.state.mobile == "right") {
                midscreen.style.height = 0;
                leftList.style.height = "calc(100vh - 27px)";
                leftList.style.position = "relative";
                buttonRow.style.opacity = 1;
                buttonRow.style.height = "auto";
                this.setState({mobile:"left", tablet:false});
            }
            else if (this.state.mobile == "mid") {
                leftList.style.height = 0;
                leftList.style.position = "absolute";
                buttonRow.style.opacity = 0;
                buttonRow.style.height = 0;
                midscreen.style.height = 0;
                rightList.style.maxWidth = "100%";               
                rightList.style.opacity = 1;
                rightList.style.height = "auto";  
                rightList.style.width = "100%";              
                rightList.style.position = "relative";
                rightList.style.right = "-15px";
                rightSideList.style.height = "calc(100vh - 50px)"; 
                rightList.style.top = 0;
                rightSideList.style.position = "absolute";
                rightSideList.style.right = "auto";
                this.setState({mobile:"right", tablet:false});                
            }
        }

        onFilterMouseUp(e) {
            const filter = e.target.value.trim();
            if (!filter) {
                return this.setState({data});
            }
            var filtered = filters.filterTree(data, filter);
            filtered = filters.expandFilteredNodes(filtered, filter);
            this.setState({data: filtered});
        }

        sortState = () => {
            var e = this.state.sortBy;
            if (e == "Sort by: Count") {
                this.state.data.children.sort(sort_by('name', false));
                this.setState({sortBy:"Sort by: A-Z"});
            }
            else {
                this.state.data.children.sort(sort_by('count', true));
                this.setState({sortBy:"Sort by: Count"});
            }
        }

        home = () => {
            if (this.state.cursor) {
                this.state.cursor.active = false;
            }            
            if (this.state.width > 460 && this.state.width < 768) { 
                this.tabletSwitchScreen("normalize2");
            }
            else if (this.state.width < 461) {
                this.mobileSwitchLeft("normalizeMid");
            }
            this.setState({cursor:null, mobile:"mid", tablet:true});
        }
        componentDidUpdate(previousProps, previousState) {
            if (previousProps.data !== this.props.data) {
                this.setState({
                    data: data, extra:extra});
            } 
            window.addEventListener("resize", this.updatedDim);
            
            }

        componentWillUnmount() {
            window.removeEventListener("resize", this.updatedDim);
            }

        componentDidMount() {
            setTimeout(() => {this.initialize()}, 50);
        }

        render(){        
            var {data: Statedata, cursor, extra:Extradata} = this.state;
            const buttonRow = document.getElementById('leftButtonRow');
            var rangeStartText = document.getElementById('event-start');
            var rangeEndText = document.getElementById('event-end');            

            if (buttonRow) {
                if (this.state.width > 767) {
                    rangeStartText.innerHTML = main.dateFormat(main.dates.start);
                    rangeEndText.innerHTML = main.dateFormat(main.dates.end);
                    this.tabletSwitchScreen("normalize3");
                }
                else if (this.state.width > 460 && this.state.width < 768) {
                    rangeStartText.innerHTML = main.dateFormat(main.dates.start);
                    rangeEndText.innerHTML = main.dateFormat(main.dates.end);
                    if (this.state.tablet) {
                        this.tabletSwitchScreen("normalize2");
                    }
                    else {
                        this.tabletSwitchScreen("normalize1");
                    }                    
                }
                else if (this.state.width < 461) {
                    rangeStartText.innerHTML = main.shortDateFormat(main.dates.start);
                    rangeEndText.innerHTML = main.shortDateFormat(main.dates.end);
                    if (this.state.mobile == "left") {
                        this.mobileSwitchLeft("normalizeLeft");
                    }
                    else if (this.state.mobile == "right") {
                        this.mobileSwitchLeft("normalizeRight");
                    }
                    else if (this.state.mobile == "mid") {
                        this.mobileSwitchLeft("normalizeMid");
                    }
                }
            }
            
            return (         
                <StyleRoot id='content'>
                    <Container style={styles.appcontainer}>
                        <div id="mobileMenu">
                            <i onClick={(e) => {this.mobileSwitchLeft()}} className="fa fa-arrow-left" aria-hidden="true"></i>
                            <i onClick={(e) => {this.mobileSwitchRight()}} className="fa fa-arrow-right" aria-hidden="true"></i>
                        </div>
                        <div onClick={(e) => {this.tabletSwitchScreen()}} id="tabletMenu">
                            <i className="fa fa-arrow-right" aria-hidden="true"></i>
                        </div>
                        <Row>
                            <Col xs="12" sm="3" md="3" lg="3">
                                <Row>
                                    <div id='leftButtonRow' style={styles.menu.buttonRow}>
                                        <button style={styles.menu.homeButton} onClick={this.home}>Home</button>
                                        <button style={styles.menu.sortButton} onClick={this.sortState}>{this.state.sortBy}</button>
                                        <div style={styles.searchBox}>
                                            <div className="input-group">
                                                <input className="form-control"
                                                    onKeyUp={this.onFilterMouseUp.bind(this)}
                                                    placeholder="Search"
                                                    type="text"/>
                                            </div>
                                        </div>
                                    </div>                                    
                                </Row>
                                <Row>
                                    <div style={styles.component}>
                                        <Treebeard data={Statedata}
                                                onToggle={this.onToggle}/>
                                    </div>
                                </Row>
                            </Col>
                            <Col id="midscreenInit" xs="12" sm="6" md="6" lg="6">
                                <div id="midscreen" style={styles.component}>
                                    <div style={styles.nodeViewer}>
                                        <NodeViewer node={cursor} ready={this.initialize} toggle={this.onToggle2.bind(this)} data={this.props.data} width={this.state.width} history={history}/>
                                    </div>
                                </div>                                
                            </Col>
                            <Col xs="12" sm="3" md="3" lg="3">

                                <InformationList extra={extra}/>
                                                
                            </Col>
                        </Row>
                    </Container>
                </StyleRoot>               
            );
            
        }
    }

// ###################################################### RIGHT SIDE INFORMATION LIST ######################################################    
// ###################################################### RIGHT SIDE INFORMATION LIST ######################################################    
// ###################################################### RIGHT SIDE INFORMATION LIST ######################################################

    class InformationList extends React.Component {
        constructor(props) {
            super(props);
            this.state = {extra:extra, settings:false};
            this.limit = React.createRef();
            this.order = React.createRef();
            this.sortBy = React.createRef();
        }
        componentDidUpdate(previousProps, previousState) {
            if (previousProps.extra !== this.props.extra) {
                this.setState({
                    extra: this.props.extra});
            }
        }
        toggleSettings = () => {
            var settingsRow = document.getElementById('infoSettingsRow');
            var settings = document.getElementById('infoSettings');
            if (!this.state.settings && settings) {
                settings.style.maxHeight = "250px";
                settings.style.opacity = "1";
                settingsRow.style.height = "auto";
                this.setState({settings:true});
            }
            else {
                settings.style.maxHeight = "0";
                settings.style.opacity = "0";
                settingsRow.style.height = "0";
                this.setState({settings:false});
            }
        }

        updateList = () => {
            if (this.order.current.value == "Descending") {
                var order = "DESC";
            }
            else {
                var order = "";
            }
            if (this.limit.current.value == "None") {
                var limit = '"Playcount" IS NOT NULL';
            }
            else {
                var limit = `("Playcount" < ${this.limit.current.value} AND "Playcount" IS NOT NULL)`
            }
            if (this.sortBy.current.value == "Acquisition date") {
                var sortBy = `"FolderCreationDate" ${order}, "Playcount"`;
            }
            else {
                var sortBy = `"Playcount" ${order}, "FolderCreationDate"`;
            }
            generateUntouchedMusicData(sortBy, limit);        
        }
        render () {
            const style = styles.Infolist;
            var listItems = this.props.extra.map((item) =>
            <li>
                <div style={style.title}>{item.ArtistName} - {item.AlbumName}</div>
                <div style={style.extraInfo}>{item.FolderCreationDate} - {item.AlbumPlaycount} ({item.Playcount})</div>
            </li>);
            return (
                <StyleRoot>
                    <div id="rightList">
                        <Row>
                            <div style={styles.Infolist.header}>
                            <div style={styles.Infolist.headerTitle}>Information</div>
                                <div onClick={this.toggleSettings} style={styles.Infolist.headerCog}><i className="fa fa-gear"></i></div>
                            </div>
                        </Row>
                        <Row  id='infoSettingsRow'>
                            <div id='infoSettings' style={styles.Infolist.settings}>
                                <Form>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Sort by:</Form.Label>
                                        <Form.Control ref={this.sortBy} as="select">
                                        <option>Album plays</option>
                                        <option>Acquisition date</option>                                
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Order:</Form.Label>
                                        <Form.Control ref={this.order} as="select">
                                        <option>Ascending</option>
                                        <option>Descending</option>                                
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Album listen limit:</Form.Label>
                                        <Form.Control ref={this.limit} as="select">
                                        <option>None</option>
                                        <option>1</option>
                                        <option>3</option>
                                        <option>5</option>
                                        <option>10</option>                                
                                        </Form.Control>
                                    </Form.Group>                                        
                                </Form>
                                <button style={styles.Infolist.button} onClick={this.updateList}>Update</button>
                            </div>
                        </Row>
                        <Row> 
                            <ul id="rightSideList">{listItems}</ul>
                        </Row>
                    </div>
                </StyleRoot>
            );
        }
    }

    function msToMinSec(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
      }
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
        ReactDOM.render(<TreeExample/>, content);
    });
//    Rndr();
  //  generateData(Dates);
    $("#updateRange").click(function () {generateData(main.dates);});
});