using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;
using Engine;
using TagLib;
using TagLib.Id3v2;
using TagLib.Id3v1;
using IF.Lastfm.Core.Api;
using IF.Lastfm.Core.Api.Enums;
using IF.Lastfm.Core.Api.Helpers;
using IF.Lastfm.Core.Objects;
using Newtonsoft.Json;
using Dapper;
using System.Drawing.Drawing2D;
using Npgsql;

namespace Music_library_visualizer
{
    public partial class Form1 : Form
    {
        DirectoryInfo musicFolder = new DirectoryInfo(@"d:\1pd\music");
        public List<Genre> Genres = new List<Genre>();
        public List<Band> Bands = new List<Band>();
        public List<Album> Albums = new List<Album>();
        public List<Song> Songs = new List<Song>();
        int Gcntr = 0;
        int Bcntr = 0;
        int Acntr = 0;
        string connString = "Host=127.0.0.1;Port=5432;Username=postgres;Password=548f4c2a;Database=postgres;SearchPath=MusicLibrary";
        //Mecha nism = new Mecha();
        Lastfm2 lastfm2 = new Lastfm2();
        LastFM lastfm = new LastFM();
        List<string> soundtypes = new List<string> { "aa", "aax", "aac", "aiff", "ape", "dsf", "flac", "m4a", "m4b", "m4p", "mp3", "mpc", "mpp", "ogg", "oga", "wav", "wma", "wv", "webm" };
        List<int> trackList = new List<int>();
        List<int> discography = new List<int>();



        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            string _aName = string.Empty;
            string _bName = string.Empty;
            Album lastAlbum = new Album(null, null, null, null, null, long.MaxValue);
            Band lastArtist = new Band(null, null);
            trackList.Clear();
            discography.Clear();
            int cnt = 0;
            try
            {
                // First iteration, checks for genres
                foreach (var di in musicFolder.EnumerateDirectories("*"))
                {
                    var i = new Genre(di.ToString());
                    Genres.Add(i);
                    treeView1.Nodes.Add(i.Name);
                    // Second iteration, checks for band folders
                    foreach (var files in di.EnumerateFiles("*", SearchOption.AllDirectories))
                    {
                        var path = files.FullName;
                        string ext = "";
                        if (files.FullName.Length > 255)
                        {
                            ext = @"\\?\" + files.Extension.Substring(1, files.Extension.Length - 1);
                        }
                        else
                        {
                            ext = files.Extension.Substring(1, files.Extension.Length - 1);
                        }

                        if (soundtypes.Contains(ext))
                        {
                            cnt += 1;
                            var file = TagLib.File.Create(path);
                            string albArt = "";
                            if (file.Tag.Pictures.Length >= 1) {
                                albArt = Convert.ToBase64String(file.Tag.Pictures[0].Data.Data);
                            }
                            string bName = files.Directory.Parent.Name;
                            string aName = files.Directory.Name;
                            string name = files.Name;
                            int trackNo = 0;
                            var rYear = "Unknown Year";
                            string genre = "Unknown Genre";
                            long folderCreationDate = (long)files.Directory.CreationTime.ToUniversalTime().Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds;
                            long duration = (long)file.Properties.Duration.TotalMilliseconds;
                           // TimeSpan duration = file.Properties.Duration;
                            if (file.Tag.AlbumArtists != null && file.Tag.AlbumArtists.Length > 0)
                            {
                                bName = file.Tag.AlbumArtists.First();
                            }
                            else if (file.Tag.FirstPerformer != null && file.Tag.FirstPerformer.Length > 0)
                            {
                                bName = file.Tag.FirstPerformer;
                            }
                            if (file.Tag.Album != null && file.Tag.Album.Length > 0)
                            {
                                aName = file.Tag.Album;
                            }
                            if (file.Tag.Title != null && file.Tag.Title.Length > 0)
                            {
                                name = file.Tag.Title;
                            }
                            if (file.Tag.Year != 0)
                            {
                                rYear = file.Tag.Year.ToString();
                            }
                            if (file.Tag.FirstGenre != null && file.Tag.FirstGenre.Length > 0)
                            {
                                genre = file.Tag.FirstGenre;
                            }
                            if (file.Tag.Track != 0)
                            {
                                trackNo = (int)file.Tag.Track;
                            }
                            if (cnt == 1)
                            {
                                _aName = aName;
                                _bName = bName;
                            }
                            DataAccess dbAddTrack = new DataAccess();

                            Song track = new Song(name, aName, bName, rYear, genre, duration, trackNo, i.Name);
                            Album album = new Album(aName, bName, rYear, genre, albArt, folderCreationDate);
                            Band artist = new Band(bName, genre);

                            var dbTrack = dbAddTrack.InsertTrack(track);

                            if (_aName != aName)
                            {
                                Console.WriteLine("************New album***********      " + _aName + "************" + aName);
                                dynamic dbAlbum = "";
                                if (cnt == 1)
                                {
                                    dbAlbum = dbAddTrack.InsertAlbum(album, trackList);

                                }
                                else {
                                    dbAlbum = dbAddTrack.InsertAlbum(lastAlbum, trackList);
                                    trackList.Clear();
                                }
                           /*     if (!artist.Discography.Contains(dbAlbum.ID()))
                                {
                                    discography.Add(dbAlbum.ID());
                                }
  
                                if (_bName != bName)
                                {
                                    Console.WriteLine("************New band***********      " + _bName + "*************" + bName);
                                    if (cnt == 1)
                                    {
                                        dbAddTrack.InsertArtist(artist, discography);
                                    }
                                    else
                                    {
                                        dbAddTrack.InsertArtist(lastArtist, discography);
                                        discography.Clear();
                                    }

                                }*/
                            }
                        /*    if (!album.Tracklist.Contains(dbTrack.ID()))
                            {
                                trackList.Add(dbTrack.ID());
                            }*/
                            Console.WriteLine("1: " + bName + " " + aName + " " + name);
                            lastAlbum = album;
                        //    lastArtist = artist;
                            _aName = aName;
                          //  _bName = bName;
              //              dbAddTrack.InsertAlbum(album, trackList);
              //              dbAddTrack.InsertArtist(artist, discography);
                            //    Console.WriteLine(string.Format("final: {0} - {1} - {2} - {3}", bName, aName, name, rYear));
                            //  var tg = title.Tag
                            /*  var x = new Song(subdi.ToString(), Genres[Genres.Count - 1]);
                                Bands.Add(x);
                                Genres[Genres.Count - 1].Bandlist.Add(x);
                                treeView1.Nodes[Gcntr].Nodes.Add(x.Name);*/
                        }
                        else
                        {

                        }

                    }
                    Console.WriteLine();
                    Gcntr += 1;
                    Bcntr = 0;
                }
            }
            catch (DirectoryNotFoundException DirNotFound)
            {
                Console.WriteLine("{0}", DirNotFound.Message);
            }
            catch (UnauthorizedAccessException UnAuthDir)
            {
                Console.WriteLine("UnAuthDir: {0}", UnAuthDir.Message);
            }
            catch (PathTooLongException LongPath)
            {
                Console.WriteLine("{0}", LongPath.Message);
            }
        }

        private void button2_Click(object sender, EventArgs e) 
        {

                DataAccess db = new DataAccess();
                db.ScanScrobbles();
            
        }

        private void button3_Click(object sender, EventArgs e)
        {
          /*  using (IDbConnection connection = new System.Data.SqlClient.SqlConnection(HelperDB.CnnVal("MusicLibraryDB")))
            {

                string selectQuery1 = @"TRUNCATE TABLE [dbo].[Albums]";
                string selectQuery2 = @"TRUNCATE TABLE [dbo].[Artists]";
                string selectQuery3 = @"TRUNCATE TABLE [dbo].[Tracks]";

                connection.Execute(selectQuery1);
                connection.Execute(selectQuery2);
                connection.Execute(selectQuery3);
            }*/
            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();
                var cmd = new NpgsqlCommand();
                var scrobbles = new List<Scrobbles>();
                cmd.Connection = conn;
                cmd.CommandText = @"TRUNCATE TABLE ""MusicLibrary"".""Albums""";
                cmd.ExecuteNonQuery();
                cmd.CommandText = @"TRUNCATE TABLE ""MusicLibrary"".""Artists""";
                cmd.ExecuteNonQuery();
                cmd.CommandText = @"TRUNCATE TABLE ""MusicLibrary"".""Tracks""";
                cmd.ExecuteNonQuery();
                conn.Close();
            }
        }

        private void button4_Click(object sender, EventArgs e)
        {
            /* using (IDbConnection connection = new System.Data.SqlClient.SqlConnection(HelperDB.CnnVal("MusicLibraryDB")))
             {

                 string selectQuery1 = @"TRUNCATE TABLE [dbo].[Scrobbles]";


                 connection.Execute(selectQuery1);
             }*/
            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();
                var cmd = new NpgsqlCommand();
                var scrobbles = new List<Scrobbles>();
                cmd.Connection = conn;
                cmd.CommandText = @"TRUNCATE TABLE ""MusicLibrary"".scrobbles";
                cmd.ExecuteNonQuery();
                conn.Close();
            }
        }

        private void button5_Click(object sender, EventArgs e)
        {
            DataAccess db = new DataAccess();
            db.FilterScrobbleList();
        }

        private void button6_Click(object sender, EventArgs e)
        {
            using (IDbConnection connection = new System.Data.SqlClient.SqlConnection(HelperDB.CnnVal("MusicLibraryDB")))
            {

                string updateString = "UPDATE [dbo].[Scrobbles] SET AlbumName = REPLACE(AlbumName, AlbumName, 'F# A# Infinity') WHERE(AlbumName LIKE 'F%') AND (ArtistName LIKE 'Godspeed You%')";
                connection.Execute(updateString);
            }
            

        }

        private void button7_Click(object sender, EventArgs e)
        {
            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();
                var cmd = new NpgsqlCommand();
                cmd.Connection = conn;
                cmd.CommandText = @"SELECT TOP (1) ""Timestamp"" FROM ""MusicLibrary"".""ImportTimestamps"" ORDER BY ""Timestamp"" DESC";
                
                var timestamps = new List<Timestamp>();
                using (var reader = cmd.ExecuteReader())
                    while (reader.Read())
                        timestamps.Add(new Timestamp (reader.GetInt64(1)));
                cmd.Parameters.AddWithValue("res", timestamps.First().TimeStamp);
                cmd.CommandText = @"SELECT ""ArtistName"", ""TrackName"", ""AlbumName"", ""TimePlayed"" FROM ""MusicPlayer"".""Scrobbles"" WHERE ""TimePlayed"" > @res";
                var scrobbleTracks = new List<ScrobbleTrack>();
                using (var reader = cmd.ExecuteReader())
                    while (reader.Read())
                        scrobbleTracks.Add(new ScrobbleTrack (reader.GetString(0), reader.GetString(1), reader.GetString(2)));
                foreach (var w in scrobbleTracks)
                {
                    Console.WriteLine("Scrobbles after timestamp: " + w.TrackName);

                    cmd.Parameters.AddWithValue("ArtistName", w.ArtistName);
                    cmd.Parameters.AddWithValue("TrackName", w.TrackName);
                    cmd.Parameters.AddWithValue("AlbumName", w.AlbumName);
                    Console.WriteLine(string.Format("{0} - {1} - {2}", w.ArtistName, w.TrackName, w.AlbumName));
                    //       Console.WriteLine(resu.First().TrackName());
                    cmd.CommandText = @"SELECT COUNT (*) AS ""Count"" FROM ""MusicLibrary"".""TrackPlaysExtended"" WHERE ""ArtistName"" = @ArtistName AND ""TrackName"" = @TrackName
                                    AND ""AlbumName"" = @AlbumName";
                    //   cmd.CommandText = @"";
                    //  string queryString3 = "SELECT COUNT (*) AS Count FROM TrackPlays WHERE ArtistName = @ArtistName AND TrackName = @TrackName";
                    var matches = new List<int>();
                    using (var reader = cmd.ExecuteReader())
                        while (reader.Read())
                            matches.Add(reader.GetInt32(0));
               /*     var result3 = connection.Query(queryString3, new
                    {
                        ArtistName,
                        TrackName,
                        AlbumName,
                    }
                    );*/
                    if (matches.Count > 0)
                    {
                        var countValue = matches.First();
                        if (countValue > 0)
                        {
                            cmd.CommandText = @"UPDATE ""TrackPlaysExtended"" SET ""Playcount"" += 1 WHERE  ""ArtistName"" = @ArtistName AND ""TrackName"" = @TrackName
                                                AND ""AlbumName"" = @AlbumName";                            
                            cmd.ExecuteNonQuery();

                            Console.WriteLine("Updating TPE: " + w.TrackName + " " + countValue);

                        }
                        else
                        {
                            Console.WriteLine("Adding track to TPE: " + w.TrackName + countValue);
                            cmd.CommandText = @"INSERT INTO ""MusicLibrary"".""TrackPlaysExtended"" 
                                            (""ArtistName"", ""TrackName"", ""AlbumName"", ""Playcount"") VALUES (@ArtistName, @TrackName, @AlbumName, ""1"")";
                            cmd.ExecuteNonQuery();
                        }

                    }
                  /*  if (result3.Any())
                    {
                        var countValue = result3.First().Count();
                        if (countValue > 0)
                        {
                            string updateString = "UPDATE TrackPlays SET Playcount += 1 WHERE ArtistName = @ArtistName AND TrackName = @TrackName";
                            connection.Execute(updateString, new
                            {
                                ArtistName,
                                TrackName,
                            });

                            Console.WriteLine("UPDATING SHIET: " + TrackName + " " + countValue);

                        }
                        else
                        {
                            Console.WriteLine("Adding shieet: " + TrackName + countValue);
                            string createString = "INSERT INTO [dbo].[TrackPlays] (ArtistName, TrackName, Playcount) VALUES (@ArtistName, @TrackName, '1')";
                            connection.Execute(createString, new
                            {
                                ArtistName,
                                TrackName,
                            });
                        }

                    }*/
                }
                cmd.Parameters.AddWithValue("date", (long)DateTimeOffset.Now.LocalDateTime.ToUniversalTime().Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds);
                cmd.CommandText = @"INSERT INTO ""MusicLibrary"".""ImportTimestamps"" (""Timestamp"") VALUES (@date)";
                cmd.ExecuteNonQuery();

                /* string updateString = "INSERT INTO TrackPlays (ArtistName, TrackName, AlbumName, Playcount) SELECT ArtistName, TrackName, AlbumName, COUNT(*) AS Expr1 FROM Scrobbles GROUP BY ArtistName, TrackName, AlbumName";
                 connection.Execute(updateString);
                 string update2 = "INSERT INTO TrackPlays2 (ArtistName, TrackName, Playcount) SELECT ArtistName, TrackName, COUNT(*) AS Expr1 FROM Scrobbles GROUP BY ArtistName, TrackName";
           */
            }
        }

        private void button8_Click(object sender, EventArgs e)
        {
            using (IDbConnection connection = new System.Data.SqlClient.SqlConnection(HelperDB.CnnVal("MusicLibraryDB")))
            {
                Console.WriteLine("Repopulating trackplays and trackplaysextended");
                connection.Execute("TRUNCATE TABLE TrackPlays");
                connection.Execute("TRUNCATE TABLE TrackPlaysExtended");
                string updateString = "INSERT INTO TrackPlaysExtended (ArtistName, TrackName, AlbumName, Playcount) SELECT ArtistName, TrackName, AlbumName, COUNT(*) AS Expr1 FROM Scrobbles GROUP BY ArtistName, TrackName, AlbumName";
                connection.Execute(updateString);
                string update = "INSERT INTO TrackPlays (ArtistName, TrackName, Playcount) SELECT ArtistName, TrackName, COUNT(*) AS Expr1 FROM Scrobbles GROUP BY ArtistName, TrackName";
                connection.Execute(update);
                DateTimeOffset date = DateTimeOffset.Now.LocalDateTime;
                string TimestampString = "INSERT INTO [dbo].[ImportTimestamps] ([Timestamp]) VALUES (@date)";
                connection.Execute(TimestampString, new
                {
                    date,
                });
            }

        }

        private void button9_Click(object sender, EventArgs e)
        {
            // SYNCHRONISE
            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();
                var cmd = new NpgsqlCommand();
                cmd.Connection = conn;
                cmd.CommandText = @"SELECT * FROM ""MusicLibrary"".""Tracks""";
                var allTracks = new List<ScrobbleTrack>();
                using (var reader = cmd.ExecuteReader())
                    while (reader.Read())
                        allTracks.Add(new ScrobbleTrack(reader.GetString(1), reader.GetString(0), reader.GetString(2)));
                // Get pc and lastfm tables
                // Go through pc table
                foreach (var i in allTracks)
                {
                    var ArtistName = i.ArtistName;
                    var TrackName = i.TrackName;
                    var AlbumName = i.AlbumName;
                    cmd.Parameters.AddWithValue("ArtistName", ArtistName);
                    cmd.Parameters.AddWithValue("TrackName", TrackName);
                    cmd.Parameters.AddWithValue("AlbumName", AlbumName);
                    //  var Playcount = i.Playcount;
                    cmd.CommandText = @"SELECT * FROM ""MusicLibrary"".""TrackPlaysExtended"" Where ""ArtistName"" = @ArtistName 
                                    AND ""TrackName"" = @TrackName AND ""AlbumName"" = @AlbumName";
                    var tpeTracks = new List<ScrobbleTrack>();
                    using (var reader = cmd.ExecuteReader())
                        while (reader.Read())
                            tpeTracks.Add(new ScrobbleTrack(reader.GetString(1), reader.GetString(2), reader.GetString(3), null, reader.GetInt32(4)));
                    // Check for a song match and update pc [Tracks] playcount using Lastfm [TrackPlaysExt] if found...
                    if (tpeTracks.Count > 0)
                    {
                        var Playcount = tpeTracks.First().Playcount;
                        cmd.Parameters.AddWithValue("Playcount", Playcount);
                        cmd.CommandText = @"UPDATE ""MusicLibrary"".""Tracks"" Set ""Playcount"" = @Playcount WHERE ""ArtistName"" = @ArtistName AND ""TrackName"" = @TrackName AND ""AlbumName"" = @AlbumName";
                        cmd.ExecuteNonQuery();
                    }
                    // ...if not - find closest match
                    else
                    {
                        LevenshteinAlgorithm Levenshtein = new LevenshteinAlgorithm();
                        cmd.CommandText = @"SELECT * FROM ""MusicLibrary"".""TrackPlaysExtended"" WHERE ""ArtistName"" = @ArtistName AND ""AlbumName"" = @AlbumName";
                        var tpeSimilarTracks = new List<ScrobbleTrack>();
                        using (var reader = cmd.ExecuteReader())
                            while (reader.Read())
                                tpeSimilarTracks.Add(new ScrobbleTrack(reader.GetString(1), reader.GetString(2), reader.GetString(3), null, reader.GetInt32(4)));
                        // Show all tracks from album if album title matches lastfm table
                        if (tpeSimilarTracks.Any())
                        {
                            Dictionary<string, int> difference = new Dictionary<string, int>();
                            DataAccess funktions = new DataAccess();
                            // Assign distance from affected track to each song title
                            foreach (var j in tpeSimilarTracks)
                            {
                                string xComp = funktions.CheckTrackTitleForAlbumName(TrackName.ToLower(), AlbumName.ToLower());
                                string yComp = funktions.CheckTrackTitleForAlbumName(j.TrackName.ToLower(), j.AlbumName.ToLower());
                                difference.Add(j.TrackName, Levenshtein.Compute(xComp, yComp));
                            }

                            // Find smallest distance (closest match from the album)
                            var nearestMatch = difference.Aggregate((l, r) => l.Value < r.Value ? l : r);
                            var NewName = difference.Aggregate((l, r) => l.Value < r.Value ? l : r).Key;
                            cmd.Parameters.AddWithValue("NewName", NewName);

                            cmd.CommandText = @"SELECT * FROM ""MusicLibrary"".""TrackPlaysExtended"" Where ""ArtistName"" = @ArtistName AND ""TrackName"" = @NewName AND ""AlbumName"" = @AlbumName";
                            var newResult = new List<ScrobbleTrack>();
                            using (var reader = cmd.ExecuteReader())
                                while (reader.Read())
                                    newResult.Add(new ScrobbleTrack(reader.GetString(1), reader.GetString(2), reader.GetString(3), null, reader.GetInt32(4)));
                            var Playcount = newResult.First().Playcount;
                            cmd.Parameters.AddWithValue("Playcount", Playcount);

                            cmd.CommandText = @"SELECT * FROM ""MusicLibrary"".""SyncFailures""  Where ""ArtistName"" = @ArtistName AND ""TrackName"" = @TrackName AND ""AlbumName"" = @AlbumName AND ""NewTrackName"" = @NewName";
                            var failureList = new List<ScrobbleTrack>();
                            using (var reader = cmd.ExecuteReader())
                                while (reader.Read())
                                    failureList.Add(new ScrobbleTrack(reader.GetString(1), reader.GetString(3), reader.GetString(2), reader.GetString(4)));
                            
                            // If there's a 0 or 1 step difference
                            if (nearestMatch.Value < 2)
                            {
                                // and the song title is 5 or more characters then update playcount and title
                                if (NewName.Length > 4)
                                {
                                    Console.WriteLine();
                                    Console.WriteLine("Great success!");
                                    Console.WriteLine("Affected track: " + TrackName + " ***** Closest match: " + nearestMatch.Key);
                                    cmd.CommandText = @"UPDATE ""MusicLibrary"".""Tracks"" Set ""Playcount"" = @Playcount, ""TrackName"" = @NewName
                                                    WHERE ""ArtistName"" = @ArtistName AND ""TrackName"" = @TrackName AND ""AlbumName"" = @AlbumName";
                                    cmd.ExecuteNonQuery();
                                }
                                // and the song title is 4 or under:
                                else
                                {
                                    // 
                                    Console.WriteLine("Failure. Match Value = 1");
                                    if (!failureList.Any())
                                    {
                                        funktions.FilterChoices(ArtistName, TrackName, NewName, AlbumName, Playcount);
                                    }
                                    else
                                    {
                                        Console.WriteLine("Track found in failure list - skipping.");
                                    }
                                }
                            }
                            else
                            {
                                if (nearestMatch.Value < 8)
                                {
                                    Console.WriteLine();
                                    Console.WriteLine("Match Value > 1");

                                    if (!failureList.Any())
                                    {
                                        funktions.FilterChoices(ArtistName, TrackName, NewName, AlbumName, Playcount);
                                    }
                                    else
                                    {
                                        Console.WriteLine("Track found in failure list - skipping.");
                                    }

                                }

                            }

                        }
                        else
                        {
                            cmd.CommandText = @"SELECT * FROM ""MusicLibrary"".""SyncFailures"" Where ""ArtistName"" = @ArtistName AND ""AlbumName"" = @AlbumName";
                            var failureAlbums = new List<ScrobbleTrack>();
                            using (var reader = cmd.ExecuteReader())
                                while (reader.Read())
                                    failureAlbums.Add(new ScrobbleTrack (reader.GetString(1), reader.GetString(3), reader.GetString(2), reader.GetString(4));
                            if (!failureAlbums.Any())
                            {
                                Console.Write(" - we will not bother you with this track again, sir");
                                var type = "album";
                                cmd.Parameters.AddWithValue("type", type);
                                cmd.CommandText = @"INSERT INTO ""MusicLibrary"".""SyncFailures"" (""Type"", ""ArtistName"", ""AlbumName"") VALUES (@type, @ArtistName, @AlbumName)";
                                cmd.ExecuteNonQuery();
                            }
                            else
                            {
                                Console.Write(" - nvm then");
                            }
                        }
                    }
                }

            }
            /*  // SYNCHRONISE
              using (IDbConnection connection = new System.Data.SqlClient.SqlConnection(HelperDB.CnnVal("MusicLibraryDB")))
              {
                  // Get pc and lastfm tables
                  var pcDatabase = connection.Query("SELECT * FROM Tracks");
                  // Go through pc table
                   foreach (var i in pcDatabase)
                   {
                       var ArtistName = i.ArtistName;
                       var TrackName = i.TrackName;
                       var AlbumName = i.AlbumName;
                     //  var Playcount = i.Playcount;
                      var result = connection.Query("SELECT * FROM TrackPlaysExtended Where ArtistName = @ArtistName AND TrackName = @TrackName AND AlbumName = @AlbumName", new
                      {
                          ArtistName,
                          TrackName,
                          AlbumName,
                      });
                      // Check for a song match and update pc [Tracks] playcount using Lastfm [TrackPlaysExt] if found...
                      if (result.Any())
                      {
                          var Playcount = result.First().Playcount;
                          connection.Execute("UPDATE Tracks Set Playcount = @Playcount WHERE ArtistName = @ArtistName AND TrackName = @TrackName AND AlbumName = @AlbumName", new
                          {
                              ArtistName,
                              TrackName,
                              AlbumName,
                              Playcount,
                          });
                      }
                      // ...if not - find closest match
                      else
                      {
                          LevenshteinAlgorithm Levenshtein = new LevenshteinAlgorithm();
                          var checkMatch = connection.Query("SELECT * FROM TrackPlaysExtended WHERE ArtistName = @ArtistName AND AlbumName = @AlbumName", new
                          {
                              ArtistName,
                              AlbumName,
                          });
                          // Show all tracks from album if album title matches lastfm table
                          if (checkMatch.Any())
                          {
                              Dictionary<string, int> difference = new Dictionary<string, int>();
                              DataAccess funktions = new DataAccess();
                              // Assign distance from affected track to each song title
                              foreach (var j in checkMatch)
                              {
                                  string xComp = funktions.CheckTrackTitleForAlbumName(TrackName.ToLower(), AlbumName.ToLower());
                                  string yComp = funktions.CheckTrackTitleForAlbumName(j.TrackName.ToLower(), j.AlbumName.ToLower());
                                  difference.Add(j.TrackName, Levenshtein.Compute(xComp, yComp));
                              }

                              // Find smallest distance (closest match from the album)
                              var nearestMatch = difference.Aggregate((l, r) => l.Value < r.Value ? l : r);
                              var NewName = difference.Aggregate((l, r) => l.Value < r.Value ? l : r).Key;
                              var newResult = connection.Query("SELECT * FROM TrackPlaysExtended Where ArtistName = @ArtistName AND TrackName = @NewName AND AlbumName = @AlbumName", new
                              {
                                  ArtistName,
                                  NewName,
                                  AlbumName,
                              });
                              var failureList = connection.Query("SELECT * FROM SyncFailures Where ArtistName = @ArtistName AND TrackName = @TrackName AND AlbumName = @AlbumName AND NewTrackName = @NewName", new
                              {
                                  ArtistName,
                                  TrackName,
                                  AlbumName,
                                  NewName,
                              });
                              var Playcount = newResult.First().Playcount;

                              // If there's a 0 or 1 step difference
                              if (nearestMatch.Value < 2)
                              {
                                  // and the song title is 5 or more characters then update playcount and title
                                  if (NewName.Length > 4)
                                  {
                                      Console.WriteLine();
                                      Console.WriteLine("Great success!");
                                      Console.WriteLine("Affected track: " + TrackName + " ***** Closest match: " + nearestMatch.Key);
                                      connection.Execute("UPDATE Tracks Set Playcount = @Playcount, TrackName = @NewName WHERE ArtistName = @ArtistName AND TrackName = @TrackName AND AlbumName = @AlbumName", new
                                      {
                                          ArtistName,
                                          NewName,
                                          TrackName,
                                          AlbumName,
                                          Playcount,
                                      });
                                  }
                                  // and the song title is 4 or under:
                                  else
                                  {
                                      // 
                                      Console.WriteLine("Failure. Match Value = 1");
                                      if (!failureList.Any())
                                      {
                                          funktions.FilterChoices(ArtistName, TrackName, NewName, AlbumName, Playcount);
                                      }
                                      else
                                      {
                                          Console.WriteLine("Track found in failure list - skipping.");
                                      }
                                  }
                              }
                              else
                              {
                                  if (nearestMatch.Value < 8) {
                                      Console.WriteLine();
                                      Console.WriteLine("Match Value > 1");

                                      if (!failureList.Any())
                                      {
                                          funktions.FilterChoices(ArtistName, TrackName, NewName, AlbumName, Playcount);
                                      }
                                      else
                                      {
                                          Console.WriteLine("Track found in failure list - skipping.");
                                      }

                                  }

                              }

                          }
                          else
                          {
                              var failureAlbums = connection.Query("SELECT * FROM SyncFailures Where ArtistName = @ArtistName AND AlbumName = @AlbumName", new
                              {
                                  ArtistName,
                                  AlbumName,
                              });
                              if (!failureAlbums.Any())
                              {
                                  Console.Write(" - we will not bother you with this track again, sir");
                                  var type = "album";
                                  connection.Execute("INSERT INTO [dbo].[SyncFailures] (Type, ArtistName, AlbumName) VALUES (@type, @ArtistName, @AlbumName)", new
                                  {
                                      type,
                                      ArtistName,
                                      AlbumName,
                                  });

                              }
                              else
                              {
                                  Console.Write(" - nvm then");
                              }
                          }
                      }
                   } 

                }*/
        }

        private void button10_Click(object sender, EventArgs e)
        {
            using (IDbConnection connection = new System.Data.SqlClient.SqlConnection(HelperDB.CnnVal("MusicLibraryDB")))
            {

                string selectQuery1 = @"TRUNCATE TABLE [dbo].[SyncFailures]";


                connection.Execute(selectQuery1);
            }
        }

        private void button11_Click(object sender, EventArgs e)
        {
            using (IDbConnection connection = new System.Data.SqlClient.SqlConnection(HelperDB.CnnVal("MusicLibraryDB")))
            {
                var lastDatabase = connection.Query("SELECT * FROM Tracks");
                foreach (var i in lastDatabase)
                {
                    var ArtistName = i.ArtistName;
                    var TrackName = i.TrackName;
                    var AlbumName = i.AlbumName;
                    var Duration = i.Duration;
                    var TrackNo = i.TrackNo;
                    var Playcount = i.Playcount;
                    var Year = i.Year;
                    var Genre = i.Genre;
                    //  var Playcount = i.Playcount;
                    var result = connection.Query("SELECT * FROM Tracks Where ArtistName = @ArtistName AND TrackName = @TrackName AND AlbumName = @AlbumName", new
                    {
                        ArtistName,
                        TrackName,
                        AlbumName,
                    });
                    if (result.Any())
                    {
                        connection.Execute("UPDATE TrackPlaysExtended Set Year = @Year, Duration = @Duration, TrackNo = @TrackNo, Genre = @Genre" +
                            " WHERE ArtistName = @ArtistName AND TrackName = @TrackName AND AlbumName = @AlbumName", new
                        {
                            ArtistName,
                            TrackName,
                            AlbumName,
                            Playcount,
                        });
                    }
                    else
                    {
                        Console.WriteLine("Failure: " + ArtistName + " - " + AlbumName + " - " + TrackName);
                    }
                }
            }
        }
        public static Bitmap ResizeImage(Image image, int width, int height)
        {
            var destRect = new Rectangle(0, 0, width, height);
            var destImage = new Bitmap(width, height);

            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }

            return destImage;
        }
        private void button12_Click(object sender, EventArgs e)
        {
            /*  string musicFolder = @"d:\1pd\music\post\gasp\Anathema - 2010 - We're Here Because We're Here\cover.jpg";
              try
              {
                  Image img = Image.FromFile(musicFolder);
                  MemoryStream ms = new MemoryStream();
                  img.Save(ms, ImageFormat.Png);
                  byte[] pic = ms.ToArray();
                  MemoryStream stream = new MemoryStream(pic);
                  string base25 = Convert.ToBase64String(pic, 0, pic.Length);
                  Console.WriteLine(base25);
              }
              catch (Exception ex)
              {
                  Console.WriteLine("error: " + ex);
              } */
            string fajl = @"d:\1PD\Music\Post\Cabaret Voltaire\Cabaret Voltaire - 1981 - Red Mecca\05 - Red Mask.mp3";
            var file = TagLib.File.Create(fajl);
            byte[] albArt = new byte[0];
            
            if (file.Tag.Pictures.Length >= 1)
            {
                var img = file.Tag.Pictures[0].Data.Data;
                MemoryStream stream = new MemoryStream(img);
                Bitmap b = ResizeImage(Image.FromStream(stream), 300, 300);
                Image i = (Image)b;
            }

        }
    }
} 
