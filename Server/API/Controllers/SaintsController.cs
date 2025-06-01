using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SaintsController(ISaintsRepository saintsRepository) : ControllerBase
{
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAllSaints()
    {
        return Ok(await saintsRepository.GetAll());
    }

    [HttpGet("GetById/{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await saintsRepository.GetSaintById(id));
    }
    
}
