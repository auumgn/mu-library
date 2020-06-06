using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Engine
{
    public class Genre
    {
        public string Name { get; set; }
        public List<Band> Bandlist { get; set; }

        public Genre(string name)
        {
            Name = name;
            Bandlist = new List<Band>();
        }
    }
}
