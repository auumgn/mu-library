import {styles} from './styles.js';
import {data, extra, history, spinnerDiv, link, sort_by} from './treetest.js';
import { throttle } from 'throttle-debounce';
import {Container, Row, Col} from 'react-bootstrap';
import NodeViewer from './nodeviewer';
import InformationList from './infolist.js';
const main = require('./javascript.js');
const {Treebeard} = require('react-treebeard');
const React = require('react');
const {StyleRoot} = require('radium'); 

class TreeView extends React.Component {
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

export default TreeView;