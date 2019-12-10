using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace Music_library_visualizer
{
    public static class HelperDB
    {
        public static string CnnVal (string name)
        {
            return ConfigurationManager.ConnectionStrings[name].ConnectionString;
   
        }
    }
}
