using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;

namespace aerohacknet
{
    public class FlightInfo
    {
        public string time { get; set; }
        public string Lat { get; set; }
        public string Lon { get; set; }
        public string alt { get; set; }
        public string Track { get; set; }
        public string GroundSpeed { get; set; }
        public string VertSpeed { get; set; }
    }
}
