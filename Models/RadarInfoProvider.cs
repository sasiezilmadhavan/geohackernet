using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;

namespace aerohacknet
{
    public class RadarInfoProvider
    {
        private const int NO_OF_RADARS = 3;
        private double s_lat = 41;
        private double s_long = -127.1;
        private double s_alt = 13000;
        int distance = 1;
        private int position;
        public int Position { get { return position; } set { } }

        private List<RadarInfo> IntruderList = new List<RadarInfo>();
        private List<RadarInfo> IntruderList1 = new List<RadarInfo>();

        public RadarInfoProvider()
        {
            Console.WriteLine("Initializing singleton object");
            // position = -1;
            // string[] allLines = File.ReadAllLines("f16_r11_RadarTrackData_traf.csv");
            // string id = allLines[1].Split(',')[1];
            // for (int index = 1; index < allLines.Length; index++)
            // {
            //     String[] allValues = allLines[index].Split(',');
            //     IntruderList.Add(new RadarInfo()
            //     {
            //         intrId = id,
            //         time = allValues[4],
            //         Lat = allValues[7],
            //         Lon = allValues[10],
            //         alt = allValues[13],
            //         V1 = allValues[16],
            //         V2 = allValues[19],
            //         V = allValues[22]
            //     });
            // }
            // allLines = File.ReadAllLines("f15_r18_RadarTrackData_traf.csv");
            // id = allLines[1].Split(',')[1];
            // for (int index = 1; index < allLines.Length; index++)
            // {
            //     String[] allValues = allLines[index].Split(',');
            //     IntruderList1.Add(new RadarInfo()
            //     {
            //         intrId = id,
            //         time = allValues[4],
            //         Lat = allValues[7],
            //         Lon = allValues[10],
            //         alt = allValues[13],
            //         V1 = allValues[16],
            //         V2 = allValues[19],
            //         V = allValues[22]
            //     });
            // }
        }
        public RadarInfo GetPosition()
        {
            RadarInfo retVal = Next();

            Console.WriteLine($"{retVal.Lat}:{retVal.Lon}");
            distance++;
            return retVal;
        }

        private RadarInfo Next()
        {
            float brng = 1.57F;
            float R = 6378.1F;

            var lat1 = DegreeToRadian(s_lat); //Current lat point converted to radians
            var lon1 = DegreeToRadian(s_long);

            var lat2 = Math.Asin(Math.Sin(lat1) * Math.Cos(distance / R) +
                        Math.Cos(lat1) * Math.Sin(distance / R) * Math.Cos(brng));

            var lon2 = lon1 + Math.Atan2(Math.Sin(brng) * Math.Sin(distance / R) * Math.Cos(lat1),
                         Math.Cos(distance / R) - Math.Sin(lat1) * Math.Sin(lat2));

            lat2 = RadianToDegree(lat2);
            lon2 = RadianToDegree(lon2);

            return new RadarInfo() { Lat = lat2.ToString(), Lon = lon2.ToString() };
        }

        private double DegreeToRadian(double angle)
        {
            return Math.PI * angle / 180.0;
        }

        private double RadianToDegree(double angle)
        {
            return angle * (180.0 / Math.PI);
        }
    }
}
