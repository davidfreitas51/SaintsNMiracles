using System.Text.RegularExpressions;
using Core.DTOs;
using Core.Interfaces;
using Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SaintsController(ISaintsRepository saintsRepository, ISaintsService saintsService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllSaints([FromQuery]SaintFilters filters)
    {
        return Ok(await saintsRepository.GetAllAsync(filters));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await saintsRepository.GetByIdAsync(id));
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetSaintBySlug(string slug)
    {
        return Ok(await saintsRepository.GetBySlugAsync(slug));
    }

    [HttpPost]
    public async Task<IActionResult> CreateSaint([FromBody] NewSaintDTO newSaint)
    {
        var slug = Regex.Replace(newSaint.Name.ToLower(), @"[^a-z0-9]+", "-").Trim('-');

        var (markdownPath, imagePath) = await saintsService.SaveSaintFilesAsync(newSaint, slug);

        var saint = new Saint
        {
            Name = newSaint.Name,
            Country = newSaint.Country,
            Century = newSaint.Century,
            Image = imagePath ?? "",
            Description = newSaint.Description,
            Slug = slug,
            MarkdownPath = markdownPath
        };

        var created = await saintsRepository.CreateSaintAsync(saint);

        return created ? Created() : BadRequest();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteSaint(int id)
    {
        await saintsRepository.DeleteSaintAsync(id);
        return Ok();
    }

    [HttpGet("countries")]
    public async Task<IActionResult> GetSaintCountries()
    {
        var countries = await saintsRepository.GetCountriesAsync();
        return Ok(countries);
    }
}
