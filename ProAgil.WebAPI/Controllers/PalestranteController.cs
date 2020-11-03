using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;

namespace ProAgil.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PalestranteController : ControllerBase
    {
        private readonly IProAgilRepository _repo;
        public PalestranteController(IProAgilRepository repo)
        {
            _repo = repo;
        }

        // GET api/values
        [HttpGet("{PalestranteId}")]
        public async Task<IActionResult> Get(int PalestranteId)
        {
            try
            {
                var results = await _repo.GetPalestrantesAsync(PalestranteId, true);
                return Ok(results);    
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou" );
            }
            
        }
        // GET api/values
        [HttpGet("getByName/{name}")]
        public async Task<IActionResult> Get(string name)
        {
            try
            {
                var results = await _repo.GetAllPalestrantesAsyncByName(name, true);
                return Ok(results);    
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou" );
            }
            
        }

        [HttpPost]
        public async Task<IActionResult> Post(Evento model)
        {
            try
            {
                _repo.Add(model);
                if(await _repo.SaveChangesAsync()){
                    return Created($"/api/palestrante/{model.Id}", model);
                }   
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou" );
            }

             return BadRequest();
            
        }
    }
}