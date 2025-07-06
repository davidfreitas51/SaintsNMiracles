using System.Text.RegularExpressions;
using Core.DTOs;
using Core.Interfaces;
using Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SaintsController(ISaintsRepository saintsRepository, ISaintsService saintsService, IReligiousOrdersRepository religiousOrdersRepository, ITagsRepository tagsRepository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllSaints([FromQuery] SaintFilters filters)
    {
        var saints = await saintsRepository.GetAllAsync(filters);
        return Ok(saints);
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
    public async Task<IActionResult> CreateSaint([FromBody] NewSaintDto newSaint)
    {
        var slug = Regex.Replace(newSaint.Name.ToLower(), @"[^a-z0-9]+", "-").Trim('-');

        var exists = await saintsRepository.SlugExistsAsync(slug);
        if (exists)
        {
            return Conflict("A saint with the same name already exists.");
        }

        var (markdownPath, imagePath) = await saintsService.SaveFilesAsync(newSaint, slug);

        List<Tag> tags = new List<Tag>();
        if (newSaint.TagIds != null && newSaint.TagIds.Any())
        {
            tags = await tagsRepository.GetByIdsAsync(newSaint.TagIds);
        }

        ReligiousOrder religiousOrder = null;
        if (newSaint.ReligiousOrderId.HasValue)
        {
            religiousOrder = await religiousOrdersRepository.GetByIdAsync(newSaint.ReligiousOrderId.Value);
        }

        var saint = new Saint
        {
            Name = newSaint.Name,
            Country = newSaint.Country,
            Century = newSaint.Century,
            Image = imagePath ?? "",
            Description = newSaint.Description,
            Slug = slug,
            MarkdownPath = markdownPath,
            Title = newSaint.Title,
            FeastDay = newSaint.FeastDay,
            PatronOf = newSaint.PatronOf,
            ReligiousOrder = religiousOrder,
            Tags = tags
        };

        var created = await saintsRepository.CreateAsync(saint);

        return created ? Created() : BadRequest();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSaint(int id, [FromBody] NewSaintDto updatedSaint)
    {
        var existingSaint = await saintsRepository.GetByIdAsync(id);
        if (existingSaint == null)
            return NotFound();

        var slug = Regex.Replace(updatedSaint.Name.ToLower(), @"[^a-z0-9]+", "-").Trim('-');

        var (markdownPath, imagePath) = await saintsService.UpdateFilesAsync(updatedSaint, slug);

        existingSaint.Name = updatedSaint.Name;
        existingSaint.Country = updatedSaint.Country;
        existingSaint.Century = updatedSaint.Century;
        existingSaint.Description = updatedSaint.Description;
        existingSaint.Slug = slug;

        if (!string.IsNullOrWhiteSpace(imagePath))
            existingSaint.Image = imagePath;

        if (!string.IsNullOrWhiteSpace(markdownPath))
            existingSaint.MarkdownPath = markdownPath;

        var updated = await saintsRepository.UpdateAsync(existingSaint);
        return updated ? NoContent() : BadRequest();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteSaint(int id)
    {
        var saintToDelete = await saintsRepository.GetByIdAsync(id);
        if (saintToDelete is null)
            return NotFound();
        await saintsService.DeleteFilesAsync(saintToDelete.Slug);
        await saintsRepository.DeleteAsync(id);
        return Ok();
    }

    [HttpGet("countries")]
    public async Task<IActionResult> GetSaintCountries()
    {
        var countries = await saintsRepository.GetCountriesAsync();
        return Ok(countries);
    }
}
