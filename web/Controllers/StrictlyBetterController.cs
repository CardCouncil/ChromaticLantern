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

        /*
        public class Inferior
        {
            public string name { get; set; }
            public int multiverseid { get; set; }
            public int? functional_reprints_id { get; set; }
        }

        public class Superior
        {
            public string name { get; set; }
            public int multiverseid { get; set; }
            public object functional_reprints_id { get; set; }
        }

        public class Labels
        {
            public bool downvoted { get; set; }
            public bool less_colors { get; set; }
            public bool more_colors { get; set; }
            public bool types_differ { get; set; }
            public bool strictly_better { get; set; }
            public bool subtypes_differ { get; set; }
            public bool more_colored_mana { get; set; }
            public bool supertypes_differ { get; set; }
        }

        public class DataPackage
        {
            public int id { get; set; }
            public int upvotes { get; set; }
            public int downvotes { get; set; }
            public string created_at { get; set; }
            public string updated_at { get; set; }
            public Inferior inferior { get; set; }
            public Superior superior { get; set; }
            public Labels labels { get; set; }
        }

        public class DataCollection
        {
            public int current_page { get; set; }
            public List<DataPackage> data { get; set; }
            public string first_page_url { get; set; }
            public int from { get; set; }
            public int last_page { get; set; }
            public string last_page_url { get; set; }
            public string next_page_url { get; set; }
            public string path { get; set; }
            public int per_page { get; set; }
            public object prev_page_url { get; set; }
            public int to { get; set; }
            public int total { get; set; }
        }
        */
    }
}
