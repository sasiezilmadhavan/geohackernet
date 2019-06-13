using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
namespace aerohacknet
{
    public interface ISingletonFlight
    {
        FlightInfo curData{get;set;}
    }
}