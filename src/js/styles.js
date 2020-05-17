

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

export {styles};