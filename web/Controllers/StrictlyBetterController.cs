using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using ChromaticLantern.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;

namespace ChromaticLantern.Controllers
{
    [Route("api/[controller]")]
    public class StrictlyBetterController : Controller
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly IMemoryCache _cache;
        private readonly MemoryCacheEntryOptions _cachOptions;

        public StrictlyBetterController(IHttpClientFactory clientFactory, IMemoryCache memoryCache)
        {
            _clientFactory = clientFactory;
            _cache = memoryCache;
            _cachOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromSeconds(60));
        }

        [HttpGet("[action]")]
        public async Task<string> Upgrades(string name)
        {
            var client = _clientFactory.CreateClient();
            var url = "https://www.strictlybetter.eu/api/obsoletes/" + name ?? string.Empty;
            var output = await client.GetStringAsync(url);
            var root = JsonConvert.DeserializeObject<DataCollection>(output);
            if (root.total == 0)
            {
                return string.Empty;
            }

            var body = new
            {
                identifiers = root.data.Select(_ => new { multiverse_id = _.superior.multiverseid })
            };
            var collection = await client.PostAsJsonAsync("https://api.scryfall.com/cards/collection", body);
            var result = await collection.Content.ReadAsStringAsync();
            return result;
        }

        [HttpGet("[action]")]
        public async Task<string> Obsoletes(string name)
        {
            string key = $"strictlyBetter.obsoletes.{name}";
            string output = string.Empty;

            if(_cache.TryGetValue(key, out output) == false)
            {
                var client = _clientFactory.CreateClient();
                var query = HttpUtility.UrlEncode(name);
                var url = "https://www.strictlybetter.eu/api/obsoletes/" + query ?? string.Empty;
                output = await client.GetStringAsync(url);

                _cache.Set(name, output, _cachOptions);
            }
  
            return output;
        }
    }

}
