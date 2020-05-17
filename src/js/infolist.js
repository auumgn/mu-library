import {styles} from './styles.js';
import {extra} from './treetest.js';
const React = require('react');
const {StyleRoot} = require('radium'); 
import {Form, Row} from 'react-bootstrap'; 

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

export default InformationList