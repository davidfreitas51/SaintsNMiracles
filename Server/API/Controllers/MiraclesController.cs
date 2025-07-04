using System.Text.RegularExpressions;
using Core.DTOs;
using Core.Interfaces;
using Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MiraclesController(IMiraclesRepository miraclesRepository, IMiraclesService miraclesService) : ControllerBase
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
        return Ok(await miraclesRepository.GetByIdAsync(id));
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetMiracleBySlug(string slug)
    {
        return Ok(await miraclesRepository.GetBySlugAsync(slug));
    }

    [HttpPost]
    public async Task<IActionResult> CreateMiracle([FromBody] NewMiracleDto newMiracle)
    {
        var slug = Regex.Replace(newMiracle.Title.ToLower(), @"[^a-z0-9]+", "-").Trim('-');

        var exists = await miraclesRepository.SlugExistsAsync(slug);
        if (exists)
        {
            return Conflict("A miracle with the same title already exists.");
        }

        var (markdownPath, imagePath) = await miraclesService.SaveFilesAsync(newMiracle, slug);

        var miracle = new Miracle
        {
            Title = newMiracle.Title,
            Country = newMiracle.Country,
            Century = newMiracle.Century,
            Image = imagePath ?? "",
            Description = newMiracle.Description,
            Slug = slug,
            MarkdownPath = markdownPath
        };

        var created = await miraclesRepository.CreateAsync(miracle);

        return created ? Created() : BadRequest();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMiracle(int id, [FromBody] NewMiracleDto updatedMiracle)
    {
        var existingMiracle = await miraclesRepository.GetByIdAsync(id);
        if (existingMiracle == null)
            return NotFound();

        var slug = Regex.Replace(updatedMiracle.Title.ToLower(), @"[^a-z0-9]+", "-").Trim('-');

        var (markdownPath, imagePath) = await miraclesService.UpdateFilesAsync(updatedMiracle, slug);

        existingMiracle.Title = updatedMiracle.Title;
        existingMiracle.Country = updatedMiracle.Country;
        existingMiracle.Century = updatedMiracle.Century;
        existingMiracle.Description = updatedMiracle.Description;
        existingMiracle.Slug = slug;

        if (!string.IsNullOrWhiteSpace(imagePath))
            existingMiracle.Image = imagePath;

        if (!string.IsNullOrWhiteSpace(markdownPath))
            existingMiracle.MarkdownPath = markdownPath;

        var updated = await miraclesRepository.UpdateAsync(existingMiracle);
        return updated ? NoContent() : BadRequest();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteMiracle(int id)
    {
        var miracleToDelete = await miraclesRepository.GetByIdAsync(id);
        if (miracleToDelete is null)
            return NotFound();

        await miraclesService.DeleteFilesAsync(miracleToDelete.Slug);
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
