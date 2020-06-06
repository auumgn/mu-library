using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Engine
{
    public class Album
    {
        public string AlbumName { get; set; }
        public string ArtistName { get; set; }
        public string Year { get; set; }
        public string Genre { get; set; }
        public List<int> Tracklist { get; set; }
        public string AlbumArt { get; set; }
        public long FolderCreationDate { get; set; }
        public Album (string albumName, string artistName, string year, string genre, string albumArt, long folderCreationDate)
        {
            AlbumName = albumName;
            ArtistName = artistName;
            Year = year;
            Genre = genre;
            AlbumArt = albumArt;
            FolderCreationDate = folderCreationDate;
            Tracklist = new List<int>();
        }

    }
}
