using System.Text.RegularExpressions;
using Core.DTOs;
using Core.Interfaces;
using Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SaintsController(ISaintsRepository saintsRepository) : ControllerBase
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

    [HttpPost]
    public async Task<IActionResult> CreateSaint(NewSaintDTO newSaint)
    {
        newSaint.Slug = Regex.Replace(newSaint.Name.ToLower(), @"[^a-z0-9]+", "-").Trim('-');
        var folder = Path.Combine("wwwroot", "markdown", "saints", newSaint.Slug);
        Directory.CreateDirectory(folder);

        var markdownPath = Path.Combine(folder, "markdown.md");
        await System.IO.File.WriteAllTextAsync(markdownPath, newSaint.MarkdownContent);

        var saint = new Saint
        {
            Name = newSaint.Name,
            Country = newSaint.Country,
            Century = newSaint.Century,
            Image = newSaint.Image,
            Description = newSaint.Description,
            Slug = newSaint.Slug,
            MarkdownPath = markdownPath
        };

        if (await saintsRepository.CreateSaint(saint))
        {
            return Created();
        }

        return BadRequest();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteSaint(int id)
    {
        await saintsRepository.DeleteSaint(id);
        return Ok();
    }
}
