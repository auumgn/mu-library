using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace Engine
{/*
 *   public class Mecha
    {
        public List<Genre> Genres = new List<Genre>();
        public List<Band> Bands = new List<Band>();
        public List<Album> Albums = new List<Album>();
        public List<Song> Songs = new List<Song>();
        public void ScanFolder()
        {
            DirectoryInfo musicFolder = new DirectoryInfo(@"d:\1pd\music\");
            try
            {
                foreach (var di in musicFolder.EnumerateDirectories("*"))
                {
                    Genres.Add(new Genre(di.ToString()));
                    foreach (var subdi in di.EnumerateDirectories("*"))
                    {
                        var x = new Band(subdi.ToString(), Genres[Genres.Count - 1]);
                        Bands.Add(x);
                        Genres[Genres.Count-1].Bandlist.Add(x);
                        foreach (var subdir in subdi.EnumerateDirectories("*"))
                        {
                            var y = new Album(subdir.ToString(), Bands[Bands.Count - 1], 0, Genres[Genres.Count - 1]);
                            Bands[Bands.Count-1].Discography.Add(y);
                            Albums.Add(y);
                            foreach (var subdire in subdir.EnumerateFiles("*"))
                            {
                                var z = new Song(subdire.ToString(), Bands[Bands.Count - 1], Albums[Albums.Count - 1], 0, Genres[Genres.Count - 1]);
                                Songs.Add(z);
                                Albums[Albums.Count - 1].Tracklist.Add(z);
                            }
                        }
                    }
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
    }

*/
}