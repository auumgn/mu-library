const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require("mssql");
const path = require('path');
const fs = require("fs");
const https = require("https");
const {Client} = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl:true
    
  });
    
    
client.connect()
//const { Pool } = require('pg');


/*const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })*/
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))
  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 5000;
  }
app.listen(port);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use ( bodyParser.json( { type: "*/*" } ));
/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
    next();
  });*/

  app.use(express.static(__dirname + '/dist'));
  app.use(cors());
 // app.use('/', proxy('https://localhost:5001'));
/* httpProxy.createServer({
    target: {
      host: 'localhost',
      port: 5000
    },
    ssl: {
        key: fs.readFileSync("demo.local.key"),
        cert: fs.readFileSync("demo.local.crt")
    }
  }).listen(8009);*/
 /*const options = {
    hostname: "demo.local",
    key: fs.readFileSync("demo.local.key"),
    cert: fs.readFileSync("demo.local.crt")
   };
   https
    .createServer(options, app)
    .listen(5000);*/

app.get('/', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.sendFile(path.join(__dirname + '/dist/main.html'));
});
function pad2(number, length) {
   
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;

}

app.post('/untouched', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let limit = req.body.limit;
    let sortBy = req.body.sortBy;
    const que = `SELECT a."AlbumName" ,a."ArtistName" ,a."Year" ,a."FolderCreationDate",(SUM(t."Playcount")) as "Playcount", a."Tracklist" FROM "MusicLibrary"."Albums" a LEFT JOIN "MusicLibrary"."Tracks" t on a."AlbumName" = t."AlbumName" WHERE ${limit} GROUP BY a."AlbumName",a."ArtistName",a."Year",a."Tracklist",a."FolderCreationDate" ORDER BY ${sortBy} LIMIT 200`;
//Playcount IS NOT NULL
    try {
        const resi = await client.query(que);
        res.json(resi.rows)
        } catch(err) {
        console.log(err.stack)
        }
   /* var queryStr = `SELECT TOP (200) a.[AlbumName],a.[ArtistName],a.[Year],(LEN(a.[Tracklist]) - LEN(REPLACE(a.[Tracklist], ',', '')) + 1) as Numtracks,a.[FolderCreationDate],((SUM(1.0*t.[Playcount]))/(LEN(a.[Tracklist]) - LEN(REPLACE(a.[Tracklist], ',', '')) + 1)) as AlbumPlaycount,(SUM(t.[Playcount])) as Playcount FROM [MusicLibrary].[dbo].[Albums] a LEFT JOIN [MusicLibrary].[dbo].Tracks t on a.AlbumName = t.AlbumName WHERE ${limit} AND (LEN(a.[Tracklist]) - LEN(REPLACE(a.[Tracklist], ',', '')) + 1) > 1 GROUP BY a.[AlbumName],a.[ArtistName],a.[Year],a.[Tracklist],a.[FolderCreationDate] ORDER BY ${sortBy}`;
    
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .query(queryStr)      
        res.json(result.recordset)
    } catch (err) {
        console.log(err.message);
        console.log("cat history - NOPE");
        res.status(500)
        res.send(err.message)
    }*/
});
function pad2(number, length) {
   
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;

}
// ******************************************************************************************************************************
// ******************************************************************************************************************************
// ******************************************************************************************************************************
app.post('/overallAlbumData', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var art = req.body.artist;
    var alb = req.body.name;
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .input('ArtistName', art)
            .input('AlbumName', alb)
            .query('select t.ArtistName as artist, t.TrackName as name, t.AlbumName as album, t.Year, t.Genre, t.Duration as duration, t.TrackNo, tpe.Playcount as count from MusicLibrary.Dbo.Tracks t left join MusicLibrary.Dbo.TrackPlaysExtended tpe on t.TrackName = tpe.TrackName AND t.AlbumName = tpe.AlbumName AND t.ArtistName = tpe.ArtistName  WHERE t.AlbumName = @AlbumName AND t.ArtistName = @ArtistName')     
        res.json(result.recordset)
    } catch (err) {
        console.log("overallAlbumData - nope");
        res.status(500)
        res.send(err.message)
      }
});
function pad2(number, length) {
   
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;
}

app.post('/getArtwork', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var art = req.body.artist;
    var alb = req.body.name;
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .input('ArtistName', art)
            .input('AlbumName', alb)
            .query('select AlbumArt from MusicLibrary.Dbo.Albums WHERE AlbumName = @AlbumName AND ArtistName = @ArtistName')     
        res.json(result.recordset)
    } catch (err) {
        console.log("getArtwork - nope");
        res.status(500)
        res.send(err.message)
      }
});
function pad2(number, length) {
   
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;

}

app.post('/getScrobbleTimes', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var art = req.body.artist;
    var alb = req.body.name;
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .input('ArtistName', art)
            .input('AlbumName', alb)
            .query('SELECT TimePlayed FROM [MusicLibrary].[dbo].[Scrobbles] WHERE ArtistName = @ArtistName AND AlbumName = @AlbumName')  
        res.json(result.recordset)
    } catch (err) {
        console.log("getScrobbleTimes - nope");
        res.status(500)
        res.send(err.message)
      }
});
// ******************************************************************************************************************************
// ******************************************************************************************************************************
// ******************************************************************************************************************************
app.post('/overallAlbumData2', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var art = req.body.name;
    repl = {};
    let que = {text: '', 
    values: [art]};

    try {
        que.text = 'select t."ArtistName" as artist, t."TrackName" as name, t."AlbumName" as album, t."Year", t."Genre", t."Duration" as duration, t."TrackNo", tpe."Playcount" as count from "MusicLibrary"."Tracks" t left join "MusicLibrary"."TrackPlaysExtended" tpe on t."TrackName" = tpe."TrackName" AND t."AlbumName" = tpe."AlbumName" AND t."ArtistName" = tpe."ArtistName"  WHERE t."ArtistName" = $1'
        let resi = await client.query(que);
        repl.data = resi.rows;

        que.text = 'select "AlbumArt", "AlbumName" from "MusicLibrary"."Albums" WHERE "ArtistName" = $1'
        let resi2 = await client.query(que);
        repl.art = resi2.rows;

        que.text = 'SELECT "TimePlayed", "AlbumName" FROM "MusicLibrary"."scrobbles" WHERE "ArtistName" = $1'
        let resi3 = await client.query(que);
        repl.scro = resi3.rows;

        res.json(repl)
        } catch(err) {
        console.log(err.stack)
        }
    /*try {
        repl = {};
        const pool = await poolPromise

        const result = await pool.request()
            .input('ArtistName', art)
            .query('select t.ArtistName as artist, t.TrackName as name, t.AlbumName as album, t.Year, t.Genre, t.Duration as duration, t.TrackNo, tpe.Playcount as count from MusicLibrary.Dbo.Tracks t left join MusicLibrary.Dbo.TrackPlaysExtended tpe on t.TrackName = tpe.TrackName AND t.AlbumName = tpe.AlbumName AND t.ArtistName = tpe.ArtistName  WHERE t.ArtistName = @ArtistName')  
        repl.data = result.recordset; 

        const result2 = await pool.request()
            .input('ArtistName', art)
            .query('select AlbumArt, AlbumName from MusicLibrary.Dbo.Albums WHERE ArtistName = @ArtistName')   
        repl.art = result2.recordset; 

        const result3 = await pool.request()
             .input('ArtistName', art)
             .query('SELECT TimePlayed, AlbumName FROM [MusicLibrary].[dbo].[Scrobbles] WHERE ArtistName = @ArtistName')  
        repl.scro = result3.recordset;

        res.json(repl)
    } catch (err) {
        console.log("overallAlbumData2 - nope");
        res.status(500)
        res.send(err.message)
      }*/
});
function pad2(number, length) {
   
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;
}

app.post('/getArtwork2', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var art = req.body.name;
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .input('ArtistName', art)
            .query('select AlbumArt, AlbumName from MusicLibrary.Dbo.Albums WHERE ArtistName = @ArtistName')     
      //  res.json(result.recordset)
    } catch (err) {
        console.log("getArtwork2 - nope");
        res.status(500)
        res.send(err.message)
      }
});
function pad2(number, length) {
   
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;

}

app.post('/getScrobbleTimes2', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var art = req.body.name;
    try {
        
        const pool = await poolPromise
        const result = await pool.request()
            .input('ArtistName', art)
            .query('SELECT TimePlayed, AlbumName FROM [MusicLibrary].[dbo].[Scrobbles] WHERE ArtistName = @ArtistName')  
     //   res.json(result.recordset)
    } catch (err) {
        console.log("getScrobbleTimes2 - nope");
        res.status(500)
        res.send(err.message)
      }
});
// ******************************************************************************************************************************
// ******************************************************************************************************************************
// ******************************************************************************************************************************
function pad2(number, length) {
   
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;

}

app.post('/', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    var dates = JSON.parse(req.body.Dates);
    var start = new Date(dates.start);
    var end = new Date(dates.end);
  /*  var dtstring = end.getFullYear()
    + '-' + pad2(end.getMonth()+1)
    + '-' + pad2(end.getDate())
    + ' ' + pad2(end.getHours())
    + ':' + pad2(end.getMinutes())
    + ':' + pad2(end.getSeconds());*/
      /*  client.query(que, (err, kres) => {
        if (err) {console.log(err.stack)}
        else {console.log(res.rows[0])}
      });
    client.query(que)
        .then(res => console.log(res.rows[0]))
        .catch(e => console.error(e.stack))
*/
    const que = {text: 'select s."ID", s."ArtistName", s."TrackName", s."AlbumName", "TimePlayed", t."Year", t."Genre", t."Duration", t."TrackNo", tpe."Playcount", t."Category" from "MusicLibrary"."scrobbles" s left join "MusicLibrary"."Tracks" t on s."TrackName" = t."TrackName" AND s."AlbumName" = t."AlbumName" AND s."ArtistName" = t."ArtistName" left join "MusicLibrary"."Albums" a on s."AlbumName" = a."AlbumName" AND s."ArtistName" = a."ArtistName" left join "MusicLibrary"."TrackPlaysExtended" tpe on s."TrackName" = tpe."TrackName" AND s."AlbumName" = tpe."AlbumName" AND s."ArtistName" = tpe."ArtistName" WHERE "TimePlayed" > $1 AND "TimePlayed" < $2', 
        values: [start.getTime(), end.getTime()]};

    try {
        const resi = await client.query(que);
        res.json(resi.rows)
        } catch(err) {
        console.log(err.stack)
        }
        
    /*try {
        const pool = await poolPromise
        const result = await pool.request()
            .input('start', start)
            .input('end', end)
         //   .query('select * from Scrobbles WHERE TimePlayed < @end AND TimePlayed > @start')     
            .query('select s.ID, s.ArtistName, s.TrackName, s.AlbumName, TimePlayed, t.Year, t.Genre, t.Duration, t.TrackNo, tpe.Playcount, t.Category from Scrobbles s left join Tracks t on s.TrackName = t.TrackName AND s.AlbumName = t.AlbumName AND s.ArtistName = t.ArtistName left join Albums a on s.AlbumName = a.AlbumName AND s.ArtistName = a.ArtistName left join TrackPlaysExtended tpe on s.TrackName = tpe.TrackName AND s.AlbumName = tpe.AlbumName AND s.ArtistName = tpe.ArtistName WHERE TimePlayed < @end AND TimePlayed > @start') 
        res.json(result.recordset)
    } catch (err) {
        console.log(err.message);
        console.log("Generate Data - nope");
        res.status(500)
        res.send(err.message)
    }*/
});

app.get('/categoryHistory', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    const que = 'SELECT t."ArtistName", t."AlbumName", t."TrackName", "TimePlayed", "Category", "Playcount", "Duration" FROM "MusicLibrary"."scrobbles" s LEFT JOIN "MusicLibrary"."Tracks" t ON s."ArtistName" = t."ArtistName" AND s."TrackName" = t."TrackName" WHERE t."AlbumName" IS NOT NULL';    

    try {
        const resi = await client.query(que);
        res.json(resi.rows)

        } catch(err) {
            try {
                const resi = await client.query(que);
                res.json(resi.rows)
        
                } catch(err) {
                console.log(err.stack)
                res.status(500);
                res.send(err.stack);
            }
    }
  /*  try {
        const pool = await poolPromise
        const result = await pool.request()
         //   .query('select * from Scrobbles WHERE TimePlayed < @end AND TimePlayed > @start')     
            .query('SELECT t.ArtistName, t.AlbumName, t.TrackName, TimePlayed, Category, Playcount, Duration FROM [MusicLibrary].[dbo].[Scrobbles] s LEFT JOIN dbo.Tracks t ON s.ArtistName = t.ArtistName AND s.TrackName = t.TrackName WHERE t.AlbumName IS NOT NULL') 
        res.json(result.recordset)
    } catch (err) {
        console.log(err.message);
        console.log("Category History - nope");
        res.status(500)
        res.send(err.message)
      }*/
});

/*app.post('/bandtimes', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log("Asdasd" + JSON.stringify(req.body));
    var test = req.body;
    switch (test.type) {
        case "band":1
        console.log("band");
        var obj = test.name;
        try {
            const pool = await poolPromise
            const result = await pool.request()
                .input('obj', obj)
                .query('select * from Tracks WHERE ArtistName = @obj')      
            res.json(result.recordset)
        } catch (err) {
            console.log(err);
            console.log("bandtimes NOPE");
            res.status(500)
            res.send(err.message)
          }
        break;
        case "album":
        console.log("album" + test);
        var obj = test.name;
        console.log(obj);
        try {
            const pool = await poolPromise
            const result = await pool.request()
            .input('obj', obj)
            .query('select * from Tracks WHERE AlbumName = @obj')    
            res.json(result.recordset)
        } catch (err) {
            console.log("NOPE");
            res.status(500)
            res.send(err.message)
          }
        break;
        case "track":
        var obj = test.name; 
        try {
            const pool = await poolPromise
            const result = await pool.request()
            .input('obj', obj)
            .query('select * from Tracks WHERE TrackName = @obj')      
            res.json(result.recordset)
        } catch (err) {
            console.log("NOPE");
            res.status(500)
            res.send(err.message)
          }
        break;
    } 

});*/
