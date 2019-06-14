using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;

namespace aerohacknet
{
    public class RadarInfo
    {
        //Flight Properties:
        public string intrId { get; set; }
        public string time { get; set; }
        public string Lat { get; set; }
        public string Lon { get; set; }
        public string alt { get; set; }
        public string V1 { get; set; }
        public string V2 { get; set; }
        public string V { get; set; }
    }

    public class Radar
    {
        public string Name { get; set; }
        public System.Drawing.Color Color { get; set; }
        public RadarInfo RadarInfo { get; set; }
    }
}
