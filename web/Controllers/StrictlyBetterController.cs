using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Mvc;

namespace ChromaticLantern.Controllers
{
    [Route("api/[controller]")]
    public class StrictlyBetterController : Controller
    {
        private readonly IHttpClientFactory _clientFactory;

        public StrictlyBetterController(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        [HttpGet("[action]")]
        public async Task<string> Obsoletes(string name)
        {
            var client = _clientFactory.CreateClient();
            var query = HttpUtility.UrlEncode(name);
            var url = "https://www.strictlybetter.eu/api/obsoletes/" + query ?? string.Empty;
            var res = await client.GetStringAsync(url);
            return res;
        }
    }
}
