using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Engine
{
    public class Song
    {
        public string TrackName { get; set; }
        public string AlbumName { get; set; }
        public string ArtistName { get; set; }
        public string Year { get; set; }
        public string Genre { get; set; }
        public long Duration { get; set; }
        public int TrackNo { get; set; }
        public string Category { get; set; }
        //   public Band Band { get; set; }
        // public Album Album { get; set; }
        // public int Year { get; set; }
        // public Genre Genre { get; set; }

        public Song(string trackName, string albumName, string artistName, string year, string genre, long duration, int trackNo, string category)
        {
            TrackName = trackName;
            AlbumName = albumName;
            ArtistName = artistName;
            Year = year;
            Genre = genre;
            Duration = duration;
            TrackNo = trackNo;
            Category = category;
        }
    }
}
