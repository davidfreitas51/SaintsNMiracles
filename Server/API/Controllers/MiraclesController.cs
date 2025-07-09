using Core.DTOs;
using Core.Interfaces;
using Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MiraclesController(
    IMiraclesRepository miraclesRepository,
    IMiraclesService miraclesService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllMiracles([FromQuery] MiracleFilters filters)
    {
        var miracles = await miraclesRepository.GetAllAsync(filters);
        return Ok(miracles);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var miracle = await miraclesRepository.GetByIdAsync(id);
        return miracle is null ? NotFound() : Ok(miracle);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetMiracleBySlug(string slug)
    {
        var miracle = await miraclesRepository.GetBySlugAsync(slug);
        return miracle is null ? NotFound() : Ok(miracle);
    }

    [HttpPost]
    public async Task<IActionResult> CreateMiracle([FromBody] NewMiracleDto newMiracle)
    {
        var created = await miraclesService.CreateMiracleAsync(newMiracle);
        if (!created.HasValue)
            return Conflict("A miracle with the same name already exists.");
        return CreatedAtAction(nameof(GetById), new { id = created.Value }, null);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMiracle(int id, [FromBody] NewMiracleDto updatedMiracle)
    {
        var updated = await miraclesService.UpdateMiracleAsync(id, updatedMiracle);
        if (!updated)
            return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteMiracle(int id)
    {
        var miracle = await miraclesRepository.GetByIdAsync(id);
        if (miracle is null)
            return NotFound();

        await miraclesService.DeleteFilesAsync(miracle.Slug);
        await miraclesRepository.DeleteAsync(id);
        return Ok();
    }

    [HttpGet("countries")]
    public async Task<IActionResult> GetMiracleCountries()
    {
        var countries = await miraclesRepository.GetCountriesAsync();
        return Ok(countries);
    }
}
