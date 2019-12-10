using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Music_library_visualizer
{
    public class Scrobbles
    {
        public int ID { get; set; }
        public string ArtistName { get; set; }
        public string TrackName { get; set; }
        public string AlbumName { get; set; }
        public long TimePlayed { get; set; }
    }
}
