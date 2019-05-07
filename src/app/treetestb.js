
    import {Container, Row, Col} from 'react-bootstrap';
    import {
        BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
      } from 'recharts';
$(document).ready(function () { 
    'use strict';
    const React = require('react');
    const ReactDOM = require('react-dom');
    const PropTypes = require('prop-types');
    const {Treebeard} = require('react-treebeard');
    const decorators = require('react-treebeard/lib/components/decorators');
    const main = require('./javascript.js');
    const {StyleRoot} = require('radium');    
    const filters = require('react-treebeard/example/filter.js'); 
    const CanvasJSReact = require('./canvasjs.react.js').default;
    const CanvasJS = CanvasJSReact.CanvasJS;
    const CanvasJSChart = CanvasJSReact.CanvasJSChart;
 //   const styles = require('./node_modules/react-treebeard/example/styles.js');
    var data = {'name': 'xxxx', toggled: true,'children': []};
    var extra = [];
    const HELP_MSG = 'Select A Node To See Its Data Structure Here...';
    var Dates = new Object(), start = new Date, end = new Date;
    Dates.start = new Date();
    Dates.end = new Date();
    Dates.start.setMonth(Dates.start.getMonth() - 3);
    var months = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "June", "July",
        "Aug", "Sept", "Oct",
        "Nov", "Dec"
      ];
    const msPerDay = 1000 * 60 * 60 * 24;
    function formatDate(date) {
        return months[date.getMonth()] + " " + date.getDate() +  ", " +
            date.getFullYear();
      }

// ###################################################### GENERATE DATA ###################################################### 
// ###################################################### GENERATE DATA ######################################################  
// ###################################################### GENERATE DATA ######################################################  

    var generateUntouchedMusicData = function() {
        var request = $.ajax({
            type: 'GET',
            url: 'http://localhost:5000/untouched',
            dataType: 'json',
            success: function(result) { console.log("yey");}
        });
        request.done(function(dataRcvd) {
            extra = dataRcvd;
            for (var i = 0; i<extra.length; i++) {                
                var newDate = formatDate(new Date(extra[i].FolderCreationDate));
                extra[i].FolderCreationDate = newDate;
            }
            generateData(Dates);
            return extra;
        });
    };
    generateUntouchedMusicData();
    var generateData = function(timeRange) {
        var popki = JSON.stringify(timeRange);
        var request = $.ajax({
            type: 'POST',
            url: 'http://localhost:5000',
            dataType: 'json',
            data: {Dates : popki},
            success: function(result) { console.log("yey");}
        });
        request.done(function(dataRcvd) {
            console.log(dataRcvd);
            data = {'name':'x', toggled: true, 'children': []};
            for (var i = 0; i<dataRcvd.length; i++) {
                var trackDuration = new Date(dataRcvd[i].Duration);
                if (!data.children.filter(e => e.name === dataRcvd[i].ArtistName).length > 0) {
                    // ARTIST
                    data.children.push({'name': dataRcvd[i].ArtistName, 'count':1, 'children': [], 'type':'band'});                    
                    var artist = data.children.find(x => x.name === dataRcvd[i].ArtistName);
                    // ALBUMS
                    artist.children.push({'name': dataRcvd[i].AlbumName, 'count':1, 'tracks' : [], 'artist': dataRcvd[i].ArtistName, 
                    'genre':dataRcvd[i].Genre, 'type':'album', 'year':dataRcvd[i].Year });
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
                        'genre':dataRcvd[i].Genre, 'type':'album', 'year':dataRcvd[i].Year});
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
            Rndr();
            return data;


        });
    };
    const styles = {
        component: {
            verticalAlign: 'top',
            padding: '20px',
            '@media (max-width: 640px)': {
                width: '100%',
                display: 'block'
            }
        },
        appcontainer: {
            width:'100%',
        },
        searchBox: {
            position: 'relative',
            top: 'calc(100vh - 100px)'
        },
        Infolist: {
            title: {

            },
            extraInfo: {
                fontSize: "11px",
            }
        },
        viewer: {
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
                position: 'relative',
                width: '200px',
                height: '15px',
            },
            countNum : {
                paddingLeft: '7px',
                display:'inline-block',
                minWidth: '30px',
                backgroundColor: '#444',
                color: 'white'            
            },
            duration : {
                display:'inline-block',
                marginRight: '10px',
                width: '20px',               
            },
            countDuration : {
                float:'right',
                paddingLeft: '10px',
            },
            artistName : {
                fontSize: '24px',
                marginBottom: '20px',

            },
            albumName : {
                fontSize: '24px',
                marginBottom: '10px',
            },
            albumArtistName : {
                fontSize: '16px',
                marginBottom: '5px',
            },
            albumGenre : {
                fontSize: '12px',
                marginBottom: '20px',
            },
            albumArt : {
                display: 'inline-block',
                maxHeight: '200px',
                display: 'inline-block',
                verticalAlign: 'top',
                marginRight: '25px',
                marginBottom: '50px'
            },
            albumTime : {
                display: 'inline-block',
                marginRight: '20px',
            },
            albumPlaycount : {
                display: 'inline-block',
                marginRight: '20px'
            },
            releaseYear : {
                display:'inline-block'
            },
            albumExtraInfo : {
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                justifyContent: 'space-between',
                
            },
            albumMainInfo : {
                maxWidth: '510px',
                display:'inline-block'
            },
            albumInfo: {
                display: 'inline-block',
            },
            chart : {
                float: 'right',
                display: 'inline-block',
            }
        }
    };
    decorators.Header = ({style, node}) => {
        const iconType = node.children ? 'folder' : 'file-text';
        const iconClass = `fa fa-${iconType}`;
        const iconStyle = {marginRight: '5px'};
    
        return (
            <div style={style.base}>
                <div style={style.title}>
                    <i className={iconClass} style={iconStyle}/>
    
                    {node.name}
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
            this.state = {obj:this.props.node, extraData : {}, check:false, mainData:data};
            this.handleClick = this.handleClick.bind(this);
            this.timePeriod = this.timePeriod.bind(this);
            this.getArtwork = this.getArtwork.bind(this);
            this.getAlbumData = this.getAlbumData.bind(this);
            this.msToMinSec = this.msToMinSec.bind(this);
            this.getScrobbleTimes = this.getScrobbleTimes.bind(this);
            this.toggleCheck = this.toggleCheck.bind(this);
            this.handleClickReturn = this.handleClickReturn.bind(this);
            this.getResults = this.getResults.bind(this);           
        }

        msToMinSec(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
          }

        getScrobbleTimes (data) {
            fetch("http://localhost:5000/getScrobbleTimes", {headers: {
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
                console.log("getScrobbleTimes SUCCESS");
                this.setState({obj:data});
            },
            (error) => {
                console.log(error);
                console.log("overalldatafetch - error in api");
                });            
        }

        timePeriod (data) {
            fetch("http://localhost:5000/overallAlbumData", {headers: {
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
                    album.albumArt = result[0].AlbumArt;
               //     this.setState({obj:data});
                },
                (error) => {
                    console.log(error);
                    console.log("getartwork - error in api");
                    });
        }

        getAlbumData(data) {
            console.log("that");
            console.log(data);
            var check1 = false, check2 = false, check3 = false;
            fetch("http://localhost:5000/getScrobbleTimes", {headers: {
                "Content-Type": "application/json",
                "ACcess-Control-Allow-Origin":"*",
                 "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                }, method: 'post', body: JSON.stringify(data)})
                .then(res => res.json())
                .then(
                (result) => {
                    if (result.length > 0) {
                        var artist = this.state.mainData.children.find(x => x.name === data.artist);
                        var album = artist.children.find(x => x.name === data.name);
                        album.scrobbles = result;
                        check1 = true;    
                        this.setState({obj:data});                
                    }
                },
                (error) => {
                    console.log(error);
                    console.log("overalldatafetch - error in api");
                    }); 
            fetch("http://localhost:5000/getArtwork", {headers: {
                "Content-Type": "application/json",
                "ACcess-Control-Allow-Origin":"*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                }, method: 'post', body: JSON.stringify(data)})
                .then(res => res.json())
                .then(
                (result) => {
                    if (result.length > 0) {
                        var artist = this.state.mainData.children.find(x => x.name === data.artist);
                        if (artist) {
                            var album = artist.children.find(x => x.name === data.name);
                            if (album) {                                
                             //   album.albumArt = result[0].AlbumArt;
                                this.setState({obj:data});
                                check2 = true;                                
                            }
                        }
                    }
                },
                (error) => {
                    console.log(error);
                    console.log("getartwork - error in api");
                    });
            fetch("http://localhost:5000/overallAlbumData", {headers: {
                "Content-Type": "application/json",
                "ACcess-Control-Allow-Origin":"*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                }, method: 'post', body: JSON.stringify(data)})
                .then(res => res.json())
                .then(
                (result) => {
                    if (result.length > 0) {
                        var artist = this.state.mainData.children.find(x => x.name === data.artist);
                        if (artist) {
                            var album = artist.children.find(x => x.name === data.name);
                            if (album) {
                                album.tracklist = result;
                                if (album.tracklist && album.tracklist.length > 1){
                                    for (var i = 0; i<album.tracklist.length; i++){
                                        var dur = new Date(album.tracklist[i].duration);
                                        album.tracklist[i].duration = dur.getTime();
                                    }
                                }
                                this.setState({obj:data});
                                check3 = true;
                            }
                        }

                    }
                },
                (error) => {
                    console.log(error);
                    console.log("overalldatafetch - error in api");
                    });
                    
            if (check1 && check2 && check3) {
                this.setState({obj:data});
            }
            else{
                console.log("nope");
            }
        }

        toggleCheck () {
            this.setState(prevState => ({check:!prevState.check}));
            console.log("current state: " + this.state.check);
        }

        handleClick (e, data) {
            if (!data.scrobbles) {                
                this.getAlbumData(data);
                this.setState({obj:data});
            }
            else {
                this.setState({obj:data});
            }

         /*   if (!data.tracklist) {
                this.timePeriod(data);
            }
            if (!data.albumArt) {
                this.getArtwork(data);
            }
            this.setState({obj:data});*/
                      
        //    this.doThis({obj:data});
        }    
        
        handleClickReturn = (albumArtist) => {
            this.doThis(albumArtist);
            }      

        getResults = (result) => {
            console.log("band artist sent out"); 
            this.setState({extraData: result});
        }


        doThis (obj) {
            
            this.props.toggle(obj);  
            this.setState({obj:obj});


        }

        componentDidUpdate(previousProps, previousState) {
            // ??????????????
            if (previousProps.node !== this.props.node) {
                this.handleClick(null, this.props.node);
                this.setState({
                    obj: this.props.node});
            }
            if (this.state.obj) {
                switch (this.state.obj.type) {
                    case "band":
                    break;
                    case "album":
                    if (this.state.check) {
                        var artist = this.state.mainData.children.find(x => x.name === this.state.obj.artist);
                        if (artist) {
                            var album = artist.children.find(x => x.name === this.state.obj.name);
                            if (album.tracklist && album.tracklist.length > 0 ) {var albumSongs = album.tracklist}
                            else {var albumSongs = this.state.obj.tracks;this.toggleCheck();}
                        }
                        else {var albumSongs = this.state.obj.tracks;this.toggleCheck();}
                    }
                    else {
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
            }            
        }
// ********************************************************* RENDER *********************************************************
// ********************************************************* RENDER *********************************************************
        render() {
            console.log("Rendering nodeviewer");
            var {obj} = this.state;
            const style = styles.viewer;
            if (this.state.obj) { 
                switch (this.state.obj.type) {
                    case "band":
                       var className = this.state.obj.name + 'albums';
                       var listItems = this.state.obj.children.map((album) =>
                        <li onClick={((e) => this.handleClick(e, album))}>
                                <div></div>
                                <div>
                                    <div style={style.title}>{album.name}</div>                                
                                    <div style={style.count}>{album.year}</div>
                                    <div style={style.countBox}>
                                        <div style={style.countNum} className={className}>{album.count}</div>
                                    </div>
                                </div>
                        </li>
                    );
                    return (
                        <div style={style.base}>
                            <div style={style.artistName}>{this.state.obj.name}</div>
                            <div>Albums</div>
                            <div>{listItems}</div>
                        </div>
                    );
                    // ********************************************************* ALBUM RENDER *********************************************************
                    // ********************************************************* ALBUM RENDER *********************************************************
                    case "album":
                    console.log("this");
                    console.log(this.state.obj);
                    if (this.state.check) {
                        var status = "overall";
                        var rangeStart = -Infinity;
                        var rangeEnd = Infinity;
                        var artist = this.state.mainData.children.find(x => x.name === this.state.obj.artist);
                        if (artist) {
                            var album = artist.children.find(x => x.name === this.state.obj.name);
                            if (album.tracklist && album.tracklist.length > 0 ) {var albumSongs = album.tracklist;}
                            else {
                                var rangeStart = main.dates.start;
                                var rangeEnd = main.dates.end;
                                var albumSongs = this.state.obj.tracks;
                            }                            
                        }
                        else {
                            var rangeStart = main.dates.start;
                            var rangeEnd = main.dates.end;
                            var albumSongs = this.state.obj.tracks;
                        }
                    }
                    else {
                        var rangeStart = main.dates.start;
                        var rangeEnd = main.dates.end;
                        var status = "last 3 months";
                        var albumSongs = this.state.obj.tracks;
                    }
                    var artist = this.state.mainData.children.find(x => x.name === this.state.obj.artist);
                    if (artist) {
                        var album = artist.children.find(x => x.name === this.state.obj.name);
                        if (album) {
                            if (album.albumArt) {
                                var artwork = "data:image/jpeg;base64," + album.albumArt;
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
                                fullCount = (fullCount / trackCounter) + " (" + fullCount + ")";
                            }
                            else {
                                var artwork = "https://www.focus-on-success.co.uk/assets/img/placeholder-square-1.png";
                                var runTime = "Unknown";
                                var fullCount = "Unknown";
                            }
                            if (album.scrobbles && album.scrobbles.length > 0) {
                                var min = Infinity, max = -Infinity;
                                for (var i = 0; i < album.scrobbles.length; i++ ) {
                                    let scrobbleDate = new Date(album.scrobbles[i].TimePlayed);
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
                                    console.log(">900");
                                    for (var i = 0; i<album.scrobbles.length; i++) {
                                        var scrobbleDate = new Date(album.scrobbles[i].TimePlayed);
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
                                    console.log("30-900");
                                    for (var i = 0; i < album.scrobbles.length; i++) {
                                        var scrobbleDate = new Date(album.scrobbles[i].TimePlayed);
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
                                    console.log("<32");
                                    for (var i = 0; i < album.scrobbles.length; i++) {
                                        var scrobbleDate = new Date(album.scrobbles[i].TimePlayed);
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
                        }
                        else {
                            var artwork = "https://www.focus-on-success.co.uk/assets/img/placeholder-square-1.png";
                            var runTime = "Unknown";
                            var fullCount = "Unknown";
                        }
                    }
                    else {
                        var artwork = "https://www.focus-on-success.co.uk/assets/img/placeholder-square-1.png";
                        var runTime = "Unknown";
                        var fullCount = "Unknown";
                    }
                    if (!this.state.obj.year) {
                        var releaseYear = "Unknown";
                    }
                    else {
                        var releaseYear = this.state.obj.year;
                    }
                    var className = this.state.obj.name + 'playcount';
                    var listItems = albumSongs.map((track) =>
                    <li className={'album-list-item'} onClick={((e) => this.handleClick(e, track))}>
                        <div className={'album-list-item-div'}>
                            <div style={style.title}>{track.name}</div>
                            <div style={style.countDuration}>
                                <div style={style.duration}>{this.msToMinSec(track.duration)}</div>
                                <div style={style.countBox}>
                                    <div style={style.countNum} className={className}>{track.count}</div>
                                </div>
                            </div>
                        </div>
                    </li>                    
                    );

                    var albumArtist = this.state.obj.artist;
                    var albumArtistObj = this.props.data.children.find(x => x.name == albumArtist);
                    return (
                        <div style={style.base}>
                            <div style={style.albumInfo}>
                            <img style={style.albumArt} src={artwork}></img>
                            <div style={style.albumMainInfo}>
                                <div style={style.albumArtistName} onClick={((e) => this.handleClickReturn(albumArtistObj))}>{albumArtist}</div>
                                <div style={style.albumName}>{this.state.obj.name}</div>
                                <div style={style.albumExtraInfo}>
                                    <div style={style.albumPlaycount}>
                                        <div>Total listens:</div>
                                        <div>{fullCount}</div>
                                    </div>
                                    <div style={style.albumTime}>
                                        <div>Running time:</div>
                                        <div>{runTime}</div>
                                    </div>
                                    <div style={style.releaseYear}>
                                        <div>Released:</div>
                                        <div>{releaseYear}</div>
                                    </div>   
                                </div>                                
                                <div style={style.albumGenre}>{this.state.obj.genre}</div>
                            </div>
                            <ol>{listItems}</ol>
                            </div>
                            <div style={style.chart}>
                                <BarChart
                                    layout={'vertical'}
                                    width={400}
                                    height={400}
                                    data={albumYearChartOptions}
                                    margin={{
                                    top: 5, right: 30, left: 20, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={70}/>
                                    <Tooltip />
                                    <Bar dataKey="count" barSize={20} fill="#4266a9c7" />
                                </BarChart>
                            </div>
                            <button onClick={((e) => this.toggleCheck())}>{status}</button>
                        </div>
                    );
                    case "track":
                    return (
                        <div style={style.base}>
                            <div  style={style.topTitle}>{this.state.obj.name}</div>
                        </div>
                    );
                }
            }
            else {
                return (<div>Nothing here champ!</div>);
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
            this.state = {data:data,extra:extra};
            this.onToggle = this.onToggle.bind(this);
        }

        extraData(info) {
            console.log("info+ " + info);
        }

        onToggle2(node) {
            var {cursor} = this.state;
            console.log("node2: ");
            console.log(node);
            node.active = false;
                cursor.active = false;
            if (node.active == true) {
                node.active = false;
                cursor.active = false;
                console.log("wuut)" + node.active);
            }
            var zh = this.state;
            this.setState({cursor:node});
        }
        onToggle(node, toggled) {
            var {cursor} = this.state;
    
            if (cursor) {
                console.log("cursor " + cursor);
                cursor.active = false;
            }
            console.log("node: ");
            console.log(node);
            
            node.active = true;
            if (node.children) {
                node.toggled = toggled;
            }
            this.setState({cursor: node});
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

        componentDidUpdate(previousProps, previousState) {
            console.log("Parent component updated");
            if (previousProps.data !== this.props.data) {
                this.setState({
                    data: data, extra:extra});
            } }

        render(){
            var {data: Statedata, cursor, extra:Extradata} = this.state;
            console.log(Statedata);
            return (
                <StyleRoot>
                    <Container style={styles.appcontainer}>
                        <Row>
                            <Col xs="3" sm="3" md="3" lg="3">
                                <Row>
                                    <div style={styles.component}>
                                        <Treebeard data={Statedata}
                                                onToggle={this.onToggle}/>
                                    </div>
                                </Row>
                                <Row>
                                    <div style={styles.searchBox}>
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                            <i className="fa fa-search"/>
                                            </span>
                                            <input className="form-control"
                                                onKeyUp={this.onFilterMouseUp.bind(this)}
                                                placeholder="Search the tree..."
                                                type="text"/>
                                        </div>
                                    </div>
                                </Row>
                            </Col>
                            <Col xs="10" sm="10" md="10" lg="10">
                                <div style={styles.component}>
                                    <NodeViewer node={cursor} toggle={this.onToggle2.bind(this)} data={data}/>
                                </div>
                            </Col>
                            <Col xs="3" sm="3" md="3" lg="3">
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
            this.state = {extra:extra};
        }
        componentDidUpdate(previousProps, previousState) {
            if (previousProps.extra !== this.props.extra) {
                this.setState({
                    extra: this.props.extra});
            }
        }
        render () {
            const style = styles.Infolist;
            var listItems = this.props.extra.map((item) =>
            <li>
                <div style={style.title}>{item.ArtistName} - {item.AlbumName}</div>
                <div style={style.extraInfo}>{item.FolderCreationDate} - {item.AlbumPlaycount} ({item.Playcount})</div>
            </li>);
            return (
                <ul id="rightSideList">{listItems}</ul>
            );
        }
    }

    function msToMinSec(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
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



    var Rndr = function() {
        console.log("Rendering");
    const content = document.getElementById('tree');
    ReactDOM.render(<TreeExample data={data} extra={extra}/>, content);
    };
   // exports.rndr = Rndr(); 
    $("#testing2").click(function() {
        data.sort(sort_by('name', true));
        Rndr();
    });
//    Rndr();
  //  generateData(Dates);
    $("#testing").click(function () {generateData(main.dates);});
});