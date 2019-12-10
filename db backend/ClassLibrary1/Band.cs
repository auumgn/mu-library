using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Engine
{
    public class Band
    {
        public string ArtistName { get; set; }
        public string Genre { get; set; }
        public List<int> Discography { get; set; }

        public Band (string artistName, string genre)
        {
            ArtistName = artistName;
            Genre = genre;
            Discography = new List<int>();
        }
    }
}
