using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace aerohacknet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightController : ControllerBase
    {
        FlightInfoProvider _infoProvider;
        public FlightController(FlightInfoProvider infoProvider)
        {
            _infoProvider = infoProvider;
        }

        // GET api/values
        [HttpGet]
        // public ActionResult<IEnumerable <String>> Get()
        // {
        //     return new String[]{""};
        // }
        public ActionResult<FlightInfo> Get()
        {
            return _infoProvider.GetPosition();
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
