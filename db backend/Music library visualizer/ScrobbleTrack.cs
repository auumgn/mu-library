using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music_library_visualizer
{
    public class ScrobbleTrack
    {
        public string ArtistName { get; set; }
        public string TrackName { get; set; }
        public string AlbumName { get; set; }
        public string NewName { get; set; }
        public int Playcount { get; set; }

        public ScrobbleTrack(string artistName, string trackName, string albumName, string newName = null, int playcount = 0)
        {
            ArtistName = artistName;
            TrackName = trackName;
            AlbumName = albumName;
            NewName = newName;
            Playcount = playcount;
        }
    }
}
