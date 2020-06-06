using Lastfm.Services;
using IF.Lastfm.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IF.Lastfm.Core.Api;
using IF.Lastfm.Core.Api.Enums;
using IF.Lastfm.Core.Api.Helpers;
using IF.Lastfm.Core.Objects;

namespace Engine
{

    public class LastFM
    {
        List<string> Listo = new List<string>();
        public LastfmClient client = new LastfmClient("08ef182941bf29c7238f5faf974dfe49", "7c0edc30e473fb1f3d23a41af2581e2d");

        public async Task<PageResponse<LastTrack>> LookUp (string name, int page)
        {
            var query = await client.User.GetRecentScrobbles(name, null, page, 200);
       //     var albums = query.Select(x => x.);
            return query;
        }


    }
    public class Lastfm2
    {
        // Get your own API_KEY and API_SECRET from http://www.last.fm/api/account
        public static string API_KEY = "08ef182941bf29c7238f5faf974dfe49";
        public static string API_SECRET = "7c0edc30e473fb1f3d23a41af2581e2d";

        // Create your session
        public Session session = new Session(API_KEY, API_SECRET);
        public User Main()
        {


            // Set this static property to a System.Net.IWebProxy object
            //  Lastfm.ProxySupport.Proxy = new System.Net.WebProxy("221.2.216.38", 8080);

            // Test it out...
            var trackSearch = new TrackSearch("лесник", session);

            var user = new User("PsychoDriver", session);
        //    var tracks = trackSearch.GetPage(1);
            var library = new Library("PsychoDriver", session);
            var libraryTracks = new LibraryTracks(library, session);
            return user;
        }
        
        public AlbumSearch AlbSearch(string name)
        {
            var albums = new AlbumSearch(name, session);
            return albums;
        }

        public TopTrack[] LookUp(string name)
        {
            var albums = new User(name, session);
            return albums.GetTopTracks();
        }
    }

}
