using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;

namespace aerohacknet
{
    public class FlightInfoProvider
{
    private int position;
    public int Position{get{return position;} set{}}
    
    private List<FlightInfo> _FlightList = new List<FlightInfo>();

        public FlightInfoProvider()
    {
        Console.WriteLine("Initializing singleton object");
        position = -1;
        string[] allLines = File.ReadAllLines("f16_r11_RadarTrackData_own.csv");
        for(int index=1;index<allLines.Length;index++)
        {
            String[] allValues = allLines[index].Split(',');
           _FlightList.Add(new FlightInfo() {
               time = allValues[2],
               Lat = allValues[5],
               Lon = allValues[8],
               alt = allValues[11],
               Track = allValues[14],
               GroundSpeed = allValues[17],
               VertSpeed = allValues[20]
           });
        }
    }
    public FlightInfo GetPosition()
    {
        position++;
        if(position>=_FlightList.Count)
            position = _FlightList.Count-1;
        return _FlightList[position];
    }
 }
}
