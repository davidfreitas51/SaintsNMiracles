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
    public async Task<IActionResult> GetAllSaints()
    {
        return Ok(await saintsRepository.GetAll());
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await saintsRepository.GetById(id));
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetSaintBySlug(string slug)
    {
        return Ok(await saintsRepository.GetBySlug(slug));
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

        var created = await saintsRepository.CreateSaint(saint);

        return created ? Created() : BadRequest();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteSaint(int id)
    {
        await saintsRepository.DeleteSaint(id);
        return Ok();
    }
}
