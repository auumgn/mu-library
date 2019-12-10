using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using Dapper;
using Engine;
using Newtonsoft.Json;
using TagLib;
using TagLib.Id3v2;
using TagLib.Id3v1;
using IF.Lastfm.Core.Api;
using IF.Lastfm.Core.Api.Enums;
using IF.Lastfm.Core.Api.Helpers;
using IF.Lastfm.Core.Objects;
using Npgsql;

namespace Music_library_visualizer
{
    public class DataAccess
    {
        string connString = "Host=127.0.0.1;Port=5432;Username=postgres;Password=548f4c2a;Database=mulibrarydemo;SearchPath=MusicLibrary";
        public dynamic InsertTrack (Song track)
        {
            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();
                var cmd = new NpgsqlCommand();
                cmd.Connection = conn;
                cmd.CommandText = @"SELECT * FROM ""MusicLibrary"".""Tracks"" WHERE (""TrackName"" = @TrackName OR ""OldName"" = @TrackName) AND
                                    ""AlbumName"" = @AlbumName AND ""ArtistName"" = @ArtistName";
                cmd.Parameters.AddWithValue("TrackName", track.TrackName);
                cmd.Parameters.AddWithValue("ArtistName", track.ArtistName);
                cmd.Parameters.AddWithValue("AlbumName", track.AlbumName);
                cmd.Parameters.AddWithValue("Year", track.Year);
                cmd.Parameters.AddWithValue("Genre", track.Genre);
                cmd.Parameters.AddWithValue("Duration", track.Duration);
                cmd.Parameters.AddWithValue("TrackNo", track.TrackNo);
                cmd.Parameters.AddWithValue("Category", track.Category);
                var tracks = new List<Song>();
                using (var reader = cmd.ExecuteReader())
                    while (reader.Read())
                        tracks.Add(new Song(reader.GetString(0), reader.GetString(2), reader.GetString(1),
                        reader.GetString(9), reader.GetString(3), reader.GetInt64(8), reader.GetInt32(5), reader.GetString(6), reader.GetInt32(10)));
             /*   string selectQuery = @"SELECT * FROM [dbo].[Tracks] WHERE (TrackName = @TrackName OR OldName = @TrackName) AND
                                    AlbumName = @AlbumName AND ArtistName = @ArtistName";

                var result = connection.Query(selectQuery, new
                {
                track.TrackName,
                track.AlbumName,
                track.ArtistName
                });*/
                
                if (tracks.Count == 0)
                {
                    cmd.CommandText = @"INSERT INTO ""MusicLibrary"".""Tracks"" 
                                    (""ArtistName"",""TrackName"",""AlbumName"",""Year"",""Genre"",""Duration"",""TrackNo"",""Category"") 
                                    VALUES (@ArtistName, @TrackName, @AlbumName, @Year, @Genre, @Duration, @TrackNo, @Category)";
                    cmd.ExecuteNonQuery();
                    cmd.CommandText = @"SELECT * FROM ""MusicLibrary"".""Tracks"" WHERE (""TrackName"" = @TrackName OR ""OldName"" = @TrackName) AND
                                    ""AlbumName"" = @AlbumName AND ""ArtistName"" = @ArtistName";
                    using (var reader = cmd.ExecuteReader())
                        while (reader.Read())
                            tracks.Add(new Song(reader.GetString(0), reader.GetString(2), reader.GetString(1),
                            reader.GetString(9), reader.GetString(3), reader.GetInt64(8), reader.GetInt32(5), reader.GetString(6), reader.GetInt32(10)));
                    conn.Close();
                    return tracks.First();
                }
                else
                {
                    cmd.CommandText = @"UPDATE ""MusicLibrary"".""Tracks"" SET ""Year"" = @Year, ""Genre"" = @Genre, ""TrackNo"" = @TrackNo, ""Category"" = @Category WHERE ""AlbumName"" = @AlbumName AND ""ArtistName"" = @ArtistName
                                                            AND ""TrackName"" = @TrackName";
                    cmd.ExecuteNonQuery();
                    cmd.CommandText = @"SELECT * FROM ""MusicLibrary"".""Tracks"" WHERE (""TrackName"" = @TrackName OR ""OldName"" = @TrackName) AND
                                    ""AlbumName"" = @AlbumName AND ""ArtistName"" = @ArtistName";
                    tracks = new List<Song>();
                    using (var reader = cmd.ExecuteReader())
                        while (reader.Read())
                            tracks.Add(new Song(reader.GetString(0), reader.GetString(2), reader.GetString(1),
                            reader.GetString(9), reader.GetString(3), reader.GetInt64(8), reader.GetInt32(5), reader.GetString(6), reader.GetInt32(10)));
                    conn.Close();
                    return tracks.First();

                }


            }
        }
        public dynamic InsertAlbum (Album album, List<int> trackList)
        {
            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();
                var cmd = new NpgsqlCommand();
                cmd.Connection = conn;
                cmd.CommandText = @"SELECT * FROM ""MusicLibrary"".""Albums"" WHERE ""AlbumName"" = @AlbumName AND ""ArtistName"" = @ArtistName AND ""Year"" = @Year";
                cmd.Parameters.AddWithValue("ArtistName", album.ArtistName);
                cmd.Parameters.AddWithValue("AlbumName", album.AlbumName);
                cmd.Parameters.AddWithValue("Year", album.Year);
                cmd.Parameters.AddWithValue("Genre", album.Genre);
                cmd.Parameters.AddWithValue("AlbumArt", album.AlbumArt);
                cmd.Parameters.AddWithValue("FolderCreationDate", album.FolderCreationDate);                
                var albums = new List<Album>();
                using (var reader = cmd.ExecuteReader())
                    while (reader.Read())
                        albums.Add(new Album(reader.GetString(0), reader.GetString(1), reader.GetString(2), reader.GetString(3), reader.GetString(5), reader.GetInt64(6)));

                if (albums.Count == 0)
                {
                    cmd.CommandText = @"INSERT INTO ""MusicLibrary"".""Albums"" (""AlbumName"",""ArtistName"",""Year"",""Genre"",""AlbumArt"",""FolderCreationDate"", ""Tracklist"") 
                                        VALUES (@AlbumName, @ArtistName, @Year, @Genre, @AlbumArt, @FolderCreationDate, @Tracklist)";
                    string tracklist = JsonConvert.SerializeObject(trackList);
                    cmd.Parameters.AddWithValue("Tracklist", tracklist);

                    cmd.ExecuteNonQuery();
                    cmd.CommandText = @"SELECT * FROM ""MusicLibrary"".""Albums"" WHERE ""AlbumName"" = @AlbumName AND ""ArtistName"" = @ArtistName AND ""Year"" = @Year";
                    using (var reader = cmd.ExecuteReader())
                        while (reader.Read())
                            albums.Add(new Album(reader.GetString(0), reader.GetString(1), reader.GetString(2), reader.GetString(3), reader.GetString(5), reader.GetInt64(6)));
                    conn.Close();
                    return albums.First();
                }

                else
                {
                    cmd.CommandText = @"UPDATE ""MusicLibrary"".""Albums"" SET ""AlbumArt"" = @AlbumArt, ""FolderCreationDate"" = @FolderCreationDate, 
                                        ""Genre"" = @Genre, ""Tracklist"" = @tracklist WHERE ""AlbumName"" = @AlbumName AND ""ArtistName"" = @ArtistName AND ""Year"" = @Year";
                    string tracklist = JsonConvert.SerializeObject(trackList);
              //      Console.WriteLine(tracklist + " - " + album.AlbumName + " - " + album.ArtistName);
                    cmd.Parameters.AddWithValue("tracklist", tracklist);
                    cmd.ExecuteNonQuery();
                    albums = new List<Album>();
                    cmd.CommandText = @"SELECT * FROM ""MusicLibrary"".""Albums"" WHERE ""AlbumName"" = @AlbumName AND ""ArtistName"" = @ArtistName AND ""Year"" = @Year";
                    using (var reader = cmd.ExecuteReader())
                        while (reader.Read())
                            albums.Add(new Album(reader.GetString(0), reader.GetString(1), reader.GetString(2), reader.GetString(3), reader.GetString(5), reader.GetInt64(6)));
                    conn.Close();
                    return albums.First();
                }

            }

            /* using (IDbConnection connection = new System.Data.SqlClient.SqlConnection(HelperDB.CnnVal("MusicLibraryDB")))
             {
                 //connection.Execute($"INSERT INTO [dbo].[Tracks] ([Id],[TrackName],[AlbumName],[ArtistName],[Year],[Genre])" +
                 //    $" VALUES (@Id, @Name, @Album, @Band, @Year, @Genre)", z);
                 string selectQuery = @"SELECT * FROM [dbo].[Albums] WHERE AlbumName = @AlbumName AND ArtistName = @ArtistName AND Year = @Year";
              //   album.Tracklist.AddRange(trackList);
                 var result = connection.Query(selectQuery, new
                 {
                     album.AlbumName,
                     album.ArtistName,
                     album.Year,
                     album.Tracklist,
                 });

                 if (!result.Any())
                 {
                     string createQuery = "INSERT INTO [dbo].[Albums] ([AlbumName],[ArtistName],[Year],[Genre],[Tracklist],[AlbumArt],[FolderCreationDate]) VALUES (@AlbumName, @ArtistName, @Year, @Genre, @tracklist, @AlbumArt, @FolderCreationDate)";
                     string tracklist = JsonConvert.SerializeObject(trackList);

                     var create = connection.Execute(createQuery, new
                     {
                         album.AlbumName,
                         album.ArtistName,
                         album.Year,
                         album.Genre,
                         tracklist,
                         album.AlbumArt,
                         album.FolderCreationDate
                     });

                     var query = connection.Query(selectQuery, new
                     {
                         album.AlbumName,
                         album.ArtistName,
                         album.Year,
                     });
                     return query.First();
                 }

                 else
                 {
                     string updateQuery = @"UPDATE [dbo].[Albums] SET Tracklist = @tracklist, AlbumArt = @AlbumArt, FolderCreationDate = @FolderCreationDate, Genre = @Genre WHERE AlbumName = @AlbumName AND ArtistName = @ArtistName
                                                             AND Year = @Year";
                     List<int> trcklist = JsonConvert.DeserializeObject<List<int>>(result.First().Tracklist());
                     trcklist.AddRange(trackList);
                     string tracklist = JsonConvert.SerializeObject(trcklist.Distinct().ToList());

                     var query = connection.Execute(updateQuery, new
                     {
                         album.AlbumName,
                         album.ArtistName,
                         album.Year,
                         album.Genre,
                         tracklist,
                         album.AlbumArt,
                         album.FolderCreationDate
                     });
                     return result.First();
                 }

             }*/
        }

        public dynamic InsertArtist(Band artist, List<int> discography)
        {
            using (IDbConnection connection = new System.Data.SqlClient.SqlConnection(HelperDB.CnnVal("MusicLibraryDB")))
            {
                //connection.Execute($"INSERT INTO [dbo].[Tracks] ([Id],[TrackName],[AlbumName],[ArtistName],[Year],[Genre])" $" VALUES (@Id, @Name, @Album, @Band, @Year, @Genre)", z);
                string selectQuery = @"SELECT * FROM [dbo].[Artists] WHERE ArtistName = @ArtistName";
             //   artist.Discography.AddRange(discography);
                var result = connection.Query(selectQuery, new
                {
                    artist.ArtistName,
                    artist.Discography,
                });

                if (!result.Any())
                {
                    //connection.Execute("dbo.InsertArtist @ArtistName, @Genre, @Discography", artist);
                    string createQuery = "INSERT INTO [dbo].[Artists] ([ArtistName],[Genre],[Discography]) VALUES (@ArtistName, @Genre, @disco)";
                    string disco = JsonConvert.SerializeObject(discography);

                    var create = connection.Execute(createQuery, new
                    {
                        artist.ArtistName,
                        artist.Genre,
                        disco,
                    });

                    var query = connection.Query(selectQuery, new
                    {
                        artist.ArtistName,
                    });
                    return query.First();
                }

                else
                {
                    string updateQuery = @"UPDATE [dbo].[Artists] SET Discography = @disco WHERE ArtistName = @ArtistName";
                    List<int> dsco = JsonConvert.DeserializeObject<List<int>>(result.First().Discography());
                    dsco.AddRange(discography);
                    string disco = JsonConvert.SerializeObject(dsco.Distinct().ToList());
                    var query = connection.Execute(updateQuery, new
                    {
                        artist.ArtistName,
                        artist.Genre,
                        disco,
                    });
                    return result.First();
                }

            }
        }

        public void FilterScrobbleList()
        {
            string[] filters = new string[] { "(Remastered)", "(Rema", "(Acute Remastered)", "(Disc 1)", "(Disc 2)", "(demo)", "(LP)", "(2010, Not Not Fun)", "(UK Plum)",
            "(Japanese Edition)", "(UK Pink Island)", "(OST)", "(EP)", "(2009 Stereo Mix)", "(1990 Reissue)", "(Deluxe Reissue)", "(Reis.)",
            "(Grand Valley State New Music Ensemble)", "(Limited Edition)", "(German Clear)", "(MP3)", "(r-n125)", "(CD 1)", "(CD 2)", "(Disk 2)",
            "(One Little Indian Reissue)", "(Japenese Edition)", "(40th Anniversary Edition)", "(Fully Loaded Edition)", "(Classic)", "(Part One)", "(The Best Of Chicago Footwork)",
            "(A Chicago Footwork Compilation)", "(RMST)", "(expanded edition - disc 1)", "(2010, UK, Charly Records, SNAX 616 CD) - Mono", "(2004 remaster)", "(Import)",
            "(Disc 1 - Lunz)", "(1971->74 Pre-Modernist Wireless on Radio)", "(1989)", "(Japan)", "()", "(CD1)", "(Disc 2 - Reinterpretations)", "(plus four demos)",
            "(CD Release)", "(UK Porky)", "( 1992 )", "(cd 5)", "(bonus disc)", "(2012 re-master)", "(Acute Remaster)", "(Herbert Kegel / Dresdner Philharmonie)",
            "(Bonus Disc - Live France Inter Radio)", "(FLAC)" };
            string[] filters2 = new string[] {"[Disc 2]", "[Epic-Sony, 25 8P-5151, Japan]", "[Disc 1]", "[1990, Death Rec., CAROL CD 2201]",
            "[Japanese edition]", "[Noise, FW 44262]", "[Noise, N 0058]", "[Feels Bonus Disc]", "[2004 Remaster]", "[1997, Repertoire Rec., REP 4749]",
            "[Bonus Track]", "[1998, DGC, DGCD-25206]", "[Bonus Tracks]", "[MCA Rec., MCG 6070]", "[Noise, N 0040]", "[Expanded & Remastered]", "[UK, Strange Fruit, SFRCD135]",
            "[Remaster+5Bonus]", "[Liberty, LBS 83342 I]", "[Live]", "[EP]", "[ORIGINAL RECORDING REMASTERED]", "[Remastered]", "[Disc 3]", "[]", "[Special Edition] Disc 2",
            "[Special Edition] Disc 1", "[REMST]", "[Demo]", "[CBR 256-320]", "[APL019]" };
            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();
                var cmd = new NpgsqlCommand();
                cmd.Connection = conn;
                foreach (var i in filters)
                {
                    cmd.CommandText = string.Format(@"UPDATE ""MusicLibrary"".Scrobbles SET ""AlbumName"" = REPLACE(""AlbumName"", '{0}', '') WHERE(""AlbumName"" LIKE '%(%')", i);
                    cmd.ExecuteNonQuery();
                    cmd.CommandText = string.Format(@"UPDATE ""MusicLibrary"".""Tracks"" SET ""AlbumName"" = REPLACE(""AlbumName"", '{0}', '') WHERE(""AlbumName"" LIKE '%(%')", i);
                    cmd.ExecuteNonQuery();
                    cmd.CommandText = string.Format(@"UPDATE ""MusicLibrary"".""Albums"" SET ""AlbumName"" = REPLACE(""AlbumName"", '{0}', '') WHERE(""AlbumName"" LIKE '%(%')", i);
                    cmd.ExecuteNonQuery();
                }
                foreach (var i in filters2)
                {
                    cmd.CommandText = string.Format(@"UPDATE ""MusicLibrary"".Scrobbles SET ""AlbumName"" = REPLACE(""AlbumName"", '{0}', '') WHERE(""AlbumName"" LIKE '%(%')", i);
                    cmd.ExecuteNonQuery();
                    cmd.CommandText = string.Format(@"UPDATE ""MusicLibrary"".""Tracks"" SET ""AlbumName"" = REPLACE(""AlbumName"", '{0}', '') WHERE(""AlbumName"" LIKE '%]%')", i);
                    cmd.ExecuteNonQuery();
                    cmd.CommandText = string.Format(@"UPDATE ""MusicLibrary"".""Albums"" SET ""AlbumName"" = REPLACE(""AlbumName"", '{0}', '') WHERE(""AlbumName"" LIKE '%]%')", i);
                    cmd.ExecuteNonQuery();
                }
                cmd.CommandText = @"UPDATE ""MusicLibrary"".Scrobbles SET ""AlbumName"" = REPLACE(""AlbumName"", ""AlbumName"", 'F# A# Infinity') WHERE(""AlbumName"" LIKE 'F%') AND (""ArtistName"" LIKE 'Godspeed You%')";
                cmd.ExecuteNonQuery();
                cmd.CommandText = @"UPDATE ""MusicLibrary"".""Tracks"" SET ""AlbumName"" = REPLACE(""AlbumName"", ""AlbumName"", 'F# A# Infinity') WHERE(""AlbumName"" LIKE 'F%') AND (""ArtistName"" LIKE 'Godspeed You%')";
                cmd.ExecuteNonQuery();
                cmd.CommandText = @"UPDATE ""MusicLibrary"".""Albums"" SET ""AlbumName"" = REPLACE(""AlbumName"", ""AlbumName"", 'F# A# Infinity') WHERE(""AlbumName"" LIKE 'F%') AND (""ArtistName"" LIKE 'Godspeed You%')";
                cmd.ExecuteNonQuery();
                conn.Close();
            }
        }

        public async void ScanScrobbles()
        {
            LastFM lastfm = new LastFM();
            for (var z = 0; z < 2; z++)
            {
                var tracks = await lastfm.LookUp("PsychoDriver", z);
                foreach (var i in tracks)
                {
                    
                    using (var conn = new NpgsqlConnection(connString))
                    {
                        conn.Open();
                        if (i.TimePlayed != null)
                        {
                            var Time = i.TimePlayed.Value.LocalDateTime.ToUniversalTime().Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds;
                            var cmd = new NpgsqlCommand();
                            var scrobbles = new List<Scrobbles>();
                            // WHERE ""ArtistName"" = (@ArtistName) AND ""TrackName"" = (@Name) AND ""AlbumName"" = (@AlbumName) AND ""TimePlayed"" = (@Time)
                            cmd.Connection = conn;
                            cmd.CommandText = @"SELECT * FROM ""MusicLibrary"".scrobbles WHERE ""ArtistName"" = (@ArtistName) AND ""TrackName"" = (@Name) AND ""AlbumName"" = (@AlbumName) AND ""TimePlayed"" = (@Time)";
                            cmd.Parameters.AddWithValue("ArtistName", i.ArtistName);
                            cmd.Parameters.AddWithValue("Name", i.Name);
                            cmd.Parameters.AddWithValue("AlbumName", i.AlbumName);
                            cmd.Parameters.AddWithValue("Time", Time);
                            using (var reader = cmd.ExecuteReader())
                                while (reader.Read())
                                    scrobbles.Add(new Scrobbles {ArtistName = reader.GetString(0), TrackName = reader.GetString(1), AlbumName = reader.GetString(2), TimePlayed = reader.GetInt64(3)});
                            if (scrobbles.Count == 0)
                            {
                                cmd.CommandText = @"INSERT INTO ""MusicLibrary"".scrobbles (""ArtistName"",""TrackName"",""AlbumName"",""TimePlayed"") VALUES (@ArtistName, @Name, @AlbumName, @Time)";
                                cmd.ExecuteNonQuery();
                            }                          

                            /*string createQuery = "INSERT INTO [dbo].[Scrobbles] ([ArtistName],[TrackName],[AlbumName],[TimePlayed]) VALUES (@ArtistName, @Name, @AlbumName, @Time)";
                        var result = connection.Query(selectQuery, new
                        {
                            i.ArtistName,
                            i.Name,
                            i.AlbumName,
                            Time,
                        });

                        if (!result.Any())
                        {
                            var create = connection.Execute(createQuery, new
                            {
                                i.ArtistName,
                                i.Name,
                                i.AlbumName,
                                Time,
                            });
                        } */
                        }
                        conn.Close();
                    }
                    /*  using (IDbConnection connection = new System.Data.SqlClient.SqlConnection(HelperDB.CnnVal("MusicLibraryDB")))
                      {
                          Console.WriteLine(i.TimePlayed);
                          if (i.TimePlayed != null)
                          {
                              var Time = i.TimePlayed.Value.LocalDateTime;
                              string selectQuery = "SELECT * FROM [dbo].[Scrobbles] WHERE ArtistName = @ArtistName AND TrackName = @Name AND AlbumName = @AlbumName AND TimePlayed = @Time";
                              string createQuery = "INSERT INTO [dbo].[Scrobbles] ([ArtistName],[TrackName],[AlbumName],[TimePlayed]) VALUES (@ArtistName, @Name, @AlbumName, @Time)";
                              var result = connection.Query(selectQuery, new
                              {
                                  i.ArtistName,
                                  i.Name,
                                  i.AlbumName,
                                  Time,
                              });

                              if (!result.Any())
                              {
                                  var create = connection.Execute(createQuery, new
                                  {
                                      i.ArtistName,
                                      i.Name,
                                      i.AlbumName,
                                      Time,
                                  });
                              }
                          }


                      }*/
                    //   testBox.AppendText(string.Format("{0} - {1} - {2} - {3}\n", i.ArtistName, i.Name, i.AlbumName, i.TimePlayed.Value.LocalDateTime));
                }
            }         
        }

        public string CheckTrackTitleForAlbumName(string strSource, string strFind)
        {
            int Start, End;
            if (strSource.Contains(strFind))
            {
                Start = strSource.IndexOf(strFind, 0);
                End = Start + strFind.Length;
                string newName = String.Concat(strSource.Substring(0, Start),strSource.Substring(End, (strSource.Length-End)));
                // get rid of spaces in result perhaps?
                if (newName.Length > 0)
                {
                    return newName;
                }
                else
                {
                    return strSource;
                }

            }
            else
            {
                return strSource;
            }
        }

        public void FilterChoices(string ArtistName, string TrackName, string NewName, string AlbumName, int Playcount)
        {
            using (var conn = new NpgsqlConnection(connString))
            {
                conn.Open();
                var cmd = new NpgsqlCommand();
                cmd.Connection = conn;
                cmd.Parameters.AddWithValue("ArtistName", ArtistName);
                cmd.Parameters.AddWithValue("TrackName", TrackName);
                cmd.Parameters.AddWithValue("AlbumName", AlbumName);
                cmd.Parameters.AddWithValue("NewName", NewName);
                cmd.Parameters.AddWithValue("Playcount", Playcount);
                double a;
                Console.WriteLine(ArtistName + " - " + TrackName + " - " + NewName);
                Console.WriteLine("1 to keep 2 to rename");
                var re = Console.ReadLine();
                if (double.TryParse(re, out a))
                {
                    if (a == 1)
                    {
                        Console.Write(" - we will not bother you with this track again, sir");
                        cmd.Parameters.AddWithValue("type", "track");
                        cmd.CommandText = @"INSERT INTO ""MusicLibrary"".""SyncFailures"" (""Type"", ""ArtistName"", ""TrackName"", ""AlbumName"", ""NewTrackName"") VALUES (@type, @ArtistName, @TrackName, @AlbumName, @NewName)";
                        cmd.ExecuteNonQuery();
                    }
                    else if (a == 2)
                    {
                        Console.Write(" - updating [Tracks]");
                        cmd.CommandText = @"UPDATE ""MusicLibrary"".""Tracks"" SET ""Playcount"" = @Playcount, ""TrackName"" = @NewName, ""OldName"" = @TrackName WHERE ""ArtistName"" = @ArtistName AND ""TrackName"" = @TrackName AND ""AlbumName"" = @AlbumName";
                        cmd.ExecuteNonQuery();
                    }
                }
                else
                {
                    Console.Write(" - nvm then");
                }
                conn.Close();
            }
        }
    }
}
