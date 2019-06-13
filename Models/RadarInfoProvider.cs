using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;

namespace aerohacknet
{
    public class RadarInfoProvider
{
    private int position;
    public int Position{get{return position;} set{}}
    
    private List<RadarInfo> IntruderList = new List<RadarInfo>();
    private List<RadarInfo> IntruderList1 = new List<RadarInfo>();

        public RadarInfoProvider()
    {
        Console.WriteLine("Initializing singleton object");
        position = -1;
        string[] allLines = File.ReadAllLines("f16_r11_RadarTrackData_traf.csv");
        string id = allLines[1].Split(',')[1];
        for(int index=1;index<allLines.Length;index++)
        {
            String[] allValues = allLines[index].Split(',');
           IntruderList.Add(new RadarInfo() {
               intrId = id,
               time = allValues[4],
               Lat = allValues[7],
               Lon = allValues[10],
               alt = allValues[13],
               V1 = allValues[16],
               V2 = allValues[19],
               V = allValues[22]
           });
        }
        allLines = File.ReadAllLines("f15_r18_RadarTrackData_traf.csv");
        id = allLines[1].Split(',')[1];
        for(int index=1;index<allLines.Length;index++)
        {
            String[] allValues = allLines[index].Split(',');
           IntruderList1.Add(new RadarInfo() {
               intrId = id,
               time = allValues[4],
               Lat = allValues[7],
               Lon = allValues[10],
               alt = allValues[13],
               V1 = allValues[16],
               V2 = allValues[19],
               V = allValues[22]
           });
        }
    }
    public List<RadarInfo> GetPosition()
    {
        position++;
        if(position >= IntruderList.Count)
            position = IntruderList.Count-1;
        return new List<RadarInfo>(){IntruderList[position],IntruderList1[position]};
    }
 }
}
