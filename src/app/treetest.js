
    import {Container, Row, Col} from 'react-bootstrap';
    import {
        BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, CartesianAxis
      } from 'recharts';
      import { throttle, debounce } from 'throttle-debounce';
$(document).ready(function () { 
    'use strict';
    const React = require('react');
    const ReactDOM = require('react-dom');
    const PropTypes = require('prop-types');
    const {Treebeard} = require('react-treebeard');
    const {decorators} = require('react-treebeard');
    
    const main = require('./javascript.js');
    const {StyleRoot} = require('radium');    
    const filters = require('react-treebeard/example/filter.js'); 
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
        var daterange = JSON.stringify(timeRange);
        var request = $.ajax({
            type: 'POST',
            url: 'http://localhost:5000',
            dataType: 'json',
            data: {Dates : daterange},
            success: function(result) { console.log("yey");}
        });
        request.done(function(dataRcvd) {
            console.log(dataRcvd);
            data = {'name':'x', toggled: true, 'children': []};
            for (var i = 0; i<dataRcvd.length; i++) {
                var trackDuration = new Date(dataRcvd[i].Duration);
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
            console.log(data);
            data.children.sort(sort_by('count', true));
            data.children.forEach(x => {
                x.children.sort(sort_by('count', true));
            });
            Rndr();
            return data;


        });
    };
    const styles = {
        component: {
            verticalAlign: 'top',
            paddingLeft: '20px',
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
                marginLeft: 'auto',               
                position: 'relative',
                width: '200px',
                height: '15px',
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
                paddingLeft: '10px',
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
            },
            albumArt : {
                display: 'inline-block',
                maxHeight: '200px',
                display: 'inline-block',
                verticalAlign: 'top',
                marginRight: '25px',
                marginBottom: '50px'
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
                display: 'inline-block',
            },
            chart : {
                float: 'unset',
                order: 5,
                marginTop: '20px',
                display: 'inline-block',
            },
            tracksRangeStatus: {
                marginBottom: '10px',
                marginTop: '-5px',
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
                    paddingTop: '5px',
                    verticalAlign: 'top',
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
            this.state = {obj:this.props.node, extraData : {}, check:false, mainData:data};
            this.handleClick = this.handleClick.bind(this);
            this.timePeriod = this.timePeriod.bind(this);
            this.getArtwork = this.getArtwork.bind(this);
            this.getAlbumData = this.getAlbumData.bind(this);
            this.getBandData = this.getBandData.bind(this);
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
                    album.albumArt = "data:image/jpeg;base64," + result[0].AlbumArt;
               //     this.setState({obj:data});
                },
                (error) => {
                    console.log(error);
                    console.log("getartwork - error in api");
                    });
        }

        getAlbumData(data) {

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
                        if (artist) {
                            var album = artist.children.find(x => x.name === data.name);
                            if (album) {
                                album.scrobbles = result;
                                check1 = true;    
                                this.setState({obj:data}); 
                            }
                        }               
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

        getBandData(data) { /*
            console.log("that");
            console.log(data);
            var check1 = false, check2 = false, check3 = false;
            fetch("http://localhost:5000/getScrobbleTimes2", {headers: {
                "Content-Type": "application/json",
                "ACcess-Control-Allow-Origin":"*",
                 "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                }, method: 'post', body: JSON.stringify(data)})
                .then(res => res.json())
                .then(
                (result) => {
                    if (result.length > 0) {
                        var artist = this.state.mainData.children.find(x => x.name === data.name);
                        if (artist) {
                            // for bands
                            for (var i = 0; i<result.length; i++) {
                                var album = artist.children.find(x => x.name === result[i].AlbumName);
                                if (album) {
                                    if (!album.scrobbles) {
                                        album.scrobbles = [];
                                    }
                                    if (!album.scrobbles.filter(e => e.TimePlayed === result[i].TimePlayed).length > 0) {
                                        album.scrobbles.push(result[i].TimePlayed); 
                                    }                                  
                                }
                            }
                            this.setState({obj:data}); 
                        }               
                    }
                },
                (error) => {
                    console.log(error);
                    console.log("overalldatafetch - error in api");
                    }); 
            fetch("http://localhost:5000/getArtwork2", {headers: {
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
                            for (var i = 0; i<result.length; i++) {
                                var album = artist.children.find(x => x.name === result[i].AlbumName);
                                if (album) {
                                    album.albumArt = result[i].AlbumArt                                    
                                }
                            }
                            this.setState({obj:data});
                        }
                    }
                },
                (error) => {
                    console.log(error);
                    console.log("getartwork - error in api");
                    });
            fetch("http://localhost:5000/overallAlbumData2", {headers: {
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
                            for (var i = 0; i<result.length; i++) {
                                var album = artist.children.find(x => x.name === result[i].AlbumName);
                                if (album) {
                                    album.tracklist = [];
                                    album.tracklist.push(result[i]);                              
                                }
                            }
                            for (var z = 0; z<artist.children.length; z++ ) {
                                if (artist.children[z].tracklist && artist.children[z].tracklist.length > 1){
                                    for (var y = 0; y<artist.children[z].tracklist.length; y++){
                                        var dur = new Date(artist.children[z].tracklist[y].duration);
                                        artist.children[z].tracklist[y].duration = dur.getTime();
                                    }
                                }    

                            }
                            this.setState({obj:data});
                        }
                    }
                },
                (error) => {
                    console.log(error);
                    console.log("overalldatafetch - error in api");
                    });     */               
        }


        toggleCheck () {
            this.setState(prevState => ({check:!prevState.check}));
            console.log("current state: " + this.state.check);
        }

        handleClick (e, data) {
            if (data.type == 'band') {
                if (!data.scrobbles) {                
                    this.getBandData(data);
                }
                else {
                    this.setState({obj:data});
                }

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
                    obj: this.props.node, mainData:this.props.data});
            }
            if (this.state.obj) {
                switch (this.state.obj.type) {
                    case "band":
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
                        var status = "Range: Overall";
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
                                console.log("WE GOT SOME ISSUES");
                                album['varCount'] = album.count; 
                                console.log(album.varCount);
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
                        var rangeStart = main.dates.start;
                        var rangeEnd = main.dates.end;
                        var status = "Range: from " + months[rangeStart.getMonth()] + " " + rangeStart.getDate() + ", " + rangeStart.getFullYear() + " to " + months[rangeEnd.getMonth()] + " " + rangeEnd.getDate() + ", " + rangeEnd.getFullYear();
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
                    <li onClick={((e) => this.handleClick(e, album))}>
                        <img style={style.albumList.artwork} src={album.albumArt} />
                        <div style={style.albumList.info}>
                            <div style={style.albumList.title}>{album.name}</div>                                
                            <div style={style.albumList.year}>{album.year}</div>
                        </div>
                        <div style={style.albumList.countBox}>
                            <div style={style.albumList.countNum} className={albumsClassName}>{album.varCount}</div>
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
                        <div className={'album-list-item-div'}>
                            <div style={style.title}>{track.name}</div>
                            <div style={style.countDuration}>
                                <div style={style.duration}>{this.msToMinSec(track.duration)}</div>
                                <div style={style.countBox}>
                                    <div style={style.countNum} className={tracksClassName}>{track.varCount}</div>
                                </div>
                            </div>
                        </div>
                    </li> );

                    // ITERATE OVER ALBUMS
                    
                    var albumYearChartOptions = [];
                    console.log(albumYearChartOptions);
                    var min = Infinity, max = -Infinity, firstListenDate = Infinity;
                    for (var a = 0; a < artist.children.length; a++) {
                        var album = artist.children[a];
                        if (album.scrobbles && album.scrobbles.length > 0) {
                            for (var i = 0; i < album.scrobbles.length; i++ ) {
                                let scrobbleDate = new Date(album.scrobbles[i]);
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
                                console.log(">900");
                                for (var i = 0; i<album.scrobbles.length; i++) {
                                    var scrobbleDate = new Date(album.scrobbles[i]);
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
                                console.log("30-900");
                                for (var i = 0; i < album.scrobbles.length; i++) {
                                    var scrobbleDate = new Date(album.scrobbles[i]);
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
                                console.log("<32");
                                for (var i = 0; i < album.scrobbles.length; i++) {
                                    var scrobbleDate = new Date(album.scrobbles[i]);
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
                       console.log(albumYearChartOptions);
                       console.log(artist);
                    return (
                        <div style={style.base}>
                            <div style={style.artistName}>{this.state.obj.name}</div>
                            <div style={style.tracksRangeStatus} onClick={(e) => this.toggleCheck()}>{status}</div>
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
                            <div style={style.band.Headers}>Albums</div>   
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
                        var status = "Range: Overall";
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
                        var rangeStart = main.dates.start;
                        var rangeEnd = main.dates.end;
                        var albumSongs = album.tracks;
                        var status = "Range: from " + months[rangeStart.getMonth()] + " " + rangeStart.getDate() + ", " + rangeStart.getFullYear() + " to " + months[rangeEnd.getMonth()] + " " + rangeEnd.getDate() + ", " + rangeEnd.getFullYear();
                    }
                    if (album.albumArt) {   
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
                            let scrobbleDate = new Date(album.scrobbles[i]);
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
                                var scrobbleDate = new Date(album.scrobbles[i]);
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
                            }
                            albumYearChartOptions.sort((a,b) => (a.sortcode > b.sortcode) ? 1 : ((b.sortcode > a.sortcode) ? -1 : 0));
                        }
                        else if (diff < 32) {
                            console.log("<32");
                            for (var i = 0; i < album.scrobbles.length; i++) {
                                var scrobbleDate = new Date(album.scrobbles[i]);
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

                    var albumArtist = album.artist;
                    var albumArtistObj = this.props.data.children.find(x => x.name == albumArtist);
                    return (
                        <div style={style.base}>
                            <div style={style.albumInfo}>
                            <img style={style.albumArt} src={artwork}></img>
                            <div style={style.albumMainInfo}>
                                <div style={style.albumArtistName} onClick={((e) => this.handleClickReturn(albumArtistObj))}>{albumArtist}</div>
                                <div style={style.albumName}>{this.state.obj.name}</div>
                                <div style={style.tracksRangeStatus} onClick={(e) => this.toggleCheck()}>{status}</div>
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

                                <div id='chart' style={style.chart}>
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
                                <div style={style.band.Headers}>Tracks</div>                                
                                <ol>{listItems}</ol>
                                                     
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
            this.state = {data:data,extra:extra, width:window.innerWidth};
            this.getBandData = this.getBandData.bind(this);
            this.onToggle = this.onToggle.bind(this);
            this.updateDimensions = this.updateDimensions.bind(this);
            this.updatedDim = throttle(500, this.updateDimensions);
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
            fetch("http://localhost:5000/getScrobbleTimes2", {headers: {
                "Content-Type": "application/json",
                "ACcess-Control-Allow-Origin":"*",
                 "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                }, method: 'post', body: JSON.stringify(send)})
                .then(res => res.json())
                .then(
                (result) => {
                    if (result.length > 0) {
                        var artist = this.state.data.children.find(x => x.name === data.name);
                        if (artist) {
                            // for bands
                            for (var i = 0; i<result.length; i++) {
                                var album = artist.children.find(x => x.name === result[i].AlbumName);
                                if (album) {
                                    if (!album.scrobbles) {
                                        album.scrobbles = [];
                                    }
                                    if (!album.scrobbles.filter(e => e === result[i].TimePlayed).length > 0) {
                                        album.scrobbles.push(result[i].TimePlayed); 
                                    }                                  
                                }
                            }
                            this.setState({obj:data}); 
                        }               
                    }
                },
                (error) => {
                    console.log(error);
                    console.log("overalldatafetch - error in api");
                    }); 
            fetch("http://localhost:5000/getArtwork2", {headers: {
                "Content-Type": "application/json",
                "ACcess-Control-Allow-Origin":"*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                }, method: 'post', body: JSON.stringify(send)})
                .then(res => res.json())
                .then(
                (result) => {
                    if (result.length > 0) {
                        var artist = this.state.data.children.find(x => x.name === data.name);
                        if (artist) {
                            for (var i = 0; i<result.length; i++) {
                                var album = artist.children.find(x => x.name === result[i].AlbumName);
                                if (album) {
                                    album.albumArt = "data:image/jpeg;base64," + result[i].AlbumArt;                                    
                                }
                            }
                            this.setState({obj:data});
                        }
                    }
                },
                (error) => {
                    console.log(error);
                    console.log("getartwork - error in api");
                    });
            fetch("http://localhost:5000/overallAlbumData2", {headers: {
                "Content-Type": "application/json",
                "ACcess-Control-Allow-Origin":"*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                }, method: 'post', body: JSON.stringify(send)})
                .then(res => res.json())
                .then(
                (result) => {
                    if (result.length > 0) {
                        var artist = this.state.data.children.find(x => x.name === data.name);
                        if (artist) {
                            for (var i = 0; i<result.length; i++) {
                                var album = artist.children.find(x => x.name === result[i].album);
                                if (album) {
                                    if (!album.tracklist) {
                                        album.tracklist = [];
                                    }
                                    if (!album.tracklist.filter(e => e.name === result[i].name).length > 0) {
                                        album.tracklist.push(result[i]);  
                                    }                                                                
                                }
                            }
                            for (var z = 0; z<artist.children.length; z++ ) {
                                if (artist.children[z].tracklist && artist.children[z].tracklist.length > 1){
                                    artist.children[z]['fullCount'] = 0;
                                    for (var y = 0; y<artist.children[z].tracklist.length; y++){
                                        var dur = new Date(artist.children[z].tracklist[y].duration);
                                        artist.children[z].tracklist[y].duration = dur.getTime();                                     
                                        artist.children[z]['fullCount'] += artist.children[z].tracklist[y].count;
                                    }
                                }    

                            }
                            this.setState({obj:data});
                        }
                    }
                },
                (error) => {
                    console.log(error);
                    console.log("overalldatafetch - error in api");
                    });                

            }
                
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
            if (node.type == 'band') {
                this.getBandData(node);
            }

            if (cursor) {
                console.log("cursor " + cursor);
                cursor.active = false;
            }
            
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
            } 
            window.addEventListener("resize", this.updatedDim);}

        componentWillUnmount() {
            window.removeEventListener("resize", this.updatedDim);
            }
        

        render(){
            var {data: Statedata, cursor, extra:Extradata} = this.state;
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
                                            <input className="form-control"
                                                onKeyUp={this.onFilterMouseUp.bind(this)}
                                                placeholder="Search the tree..."
                                                type="text"/>
                                        </div>
                                    </div>
                                </Row>
                            </Col>
                            <Col xs="6" sm="6" md="6" lg="6">
                                <div id="midscreen" style={styles.component}>
                                    <NodeViewer node={cursor} toggle={this.onToggle2.bind(this)} data={data} width={this.state.width}/>
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