import {styles} from './styles.js';
import Spinner from 'react-spinner-material';
import {data, Dates, months, sort_by, msPerDay} from './treetest.js';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, CartesianAxis, LineChart, Line,
  } from 'recharts';
const React = require('react');
const {StyleRoot} = require('radium'); 
const PropTypes = require('prop-types');
const albumColorCodes = ['#A40606', '#2978A0', '#315659', '#1D3461', '#2D232E', '#561643', '#55DDE0'];
const Checkbox = props => (
  <input readOnly key={props.id} onClick={props.handleCheckElement} type="checkbox" checked={props.isChecked} value={props.value} />
)

var mstoMinSec = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

class NodeViewer extends React.Component {
  constructor(props) {
      super(props);
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
      this.toggleCheck = this.toggleCheck.bind(this);
      this.handleClickReturn = this.handleClickReturn.bind(this);   
  //    this.mstoMinSec = this.mstoMinSec.bind(this);     
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
 
  toggleCheck() {
      this.setState(prevState => ({check:!prevState.check}));
  }

  handleClick = (e, data) => {
      this.setState({obj:data});
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

  componentDidMount () {
    setTimeout(() => {this.props.ready()}, 50);
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
                  }    
              }
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
              timeSpentListening = mstoMinSec(timeSpentListening);

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
                          <div style={style.duration}>{mstoMinSec(track.duration)}</div>
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
                  runTime = mstoMinSec(runTime);
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
                          <div style={style.duration}>{mstoMinSec(track.duration)}</div>
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

export default NodeViewer;