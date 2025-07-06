using System.Text.RegularExpressions;
using Core.Interfaces;
using Core.Models;
using Microsoft.Extensions.Hosting;

public class SaintsService(
    IHostEnvironment env,
    ISaintsRepository saintsRepository,
    ITagsRepository tagsRepository,
    IReligiousOrdersRepository religiousOrdersRepository) : ISaintsService
{

    public async Task<int?> CreateSaintAsync(NewSaintDto newSaint)
    {
        var slug = GenerateSlug(newSaint.Name);
        if (await saintsRepository.SlugExistsAsync(slug))
            return null;

        var (markdownPath, imagePath) = await SaveFilesAsync(newSaint, slug);

        var tags = new List<Tag>();
        if (newSaint.TagIds != null && newSaint.TagIds.Any())
            tags = await tagsRepository.GetByIdsAsync(newSaint.TagIds);

        ReligiousOrder? religiousOrder = null;
        if (newSaint.ReligiousOrderId.HasValue)
            religiousOrder = await religiousOrdersRepository.GetByIdAsync(newSaint.ReligiousOrderId.Value);

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
        return created ? saint.Id : (int?)null;
    }

    public async Task<bool> UpdateSaintAsync(int id, NewSaintDto updatedSaint)
    {
        var existingSaint = await saintsRepository.GetByIdAsync(id);
        if (existingSaint == null)
            return false;

        var slug = GenerateSlug(updatedSaint.Name);

        var (markdownPath, imagePath) = await UpdateFilesAsync(updatedSaint, slug);

        existingSaint.Name = updatedSaint.Name;
        existingSaint.Country = updatedSaint.Country;
        existingSaint.Century = updatedSaint.Century;
        existingSaint.Description = updatedSaint.Description;
        existingSaint.Slug = slug;
        existingSaint.Title = updatedSaint.Title;
        existingSaint.FeastDay = updatedSaint.FeastDay;
        existingSaint.PatronOf = updatedSaint.PatronOf;

        if (!string.IsNullOrWhiteSpace(imagePath))
            existingSaint.Image = imagePath;

        if (!string.IsNullOrWhiteSpace(markdownPath))
            existingSaint.MarkdownPath = markdownPath;

        if (updatedSaint.ReligiousOrderId.HasValue)
            existingSaint.ReligiousOrder = await religiousOrdersRepository.GetByIdAsync(updatedSaint.ReligiousOrderId.Value);
        else
            existingSaint.ReligiousOrder = null;

        if (updatedSaint.TagIds != null && updatedSaint.TagIds.Any())
            existingSaint.Tags = await tagsRepository.GetByIdsAsync(updatedSaint.TagIds);
        else
            existingSaint.Tags = new List<Tag>();

        return await saintsRepository.UpdateAsync(existingSaint);
    }

    public async Task DeleteFilesAsync(string slug)
    {
        var wwwroot = Path.Combine(env.ContentRootPath, "wwwroot");
        var saintFolder = Path.Combine(wwwroot, "saints", slug);

        if (Directory.Exists(saintFolder))
            Directory.Delete(saintFolder, recursive: true);

        await Task.CompletedTask;
    }

    private string GenerateSlug(string name)
    {
        return Regex.Replace(name.ToLower(), @"[^a-z0-9]+", "-").Trim('-');
    }

    public async Task<(string markdownPath, string? imagePath)> SaveFilesAsync(NewSaintDto saintDto, string slug)
    {
        var wwwroot = Path.Combine(env.ContentRootPath, "wwwroot");
        var saintFolder = Path.Combine(wwwroot, "saints", slug);
        Directory.CreateDirectory(saintFolder);

        var markdownPath = Path.Combine(saintFolder, "markdown.md");
        await File.WriteAllTextAsync(markdownPath, saintDto.MarkdownContent);
        var relativeMarkdownPath = $"/saints/{slug}/markdown.md";

        string? relativeImagePath = null;
        if (!string.IsNullOrWhiteSpace(saintDto.Image) && saintDto.Image.StartsWith("data:image/"))
        {
            var match = Regex.Match(saintDto.Image, @"data:image/(?<type>.+?);base64,(?<data>.+)");
            if (match.Success)
            {
                var extension = match.Groups["type"].Value;
                var base64Data = match.Groups["data"].Value;
                var imageBytes = Convert.FromBase64String(base64Data);

                var imagePath = Path.Combine(saintFolder, $"image.{extension}");
                await File.WriteAllBytesAsync(imagePath, imageBytes);

                relativeImagePath = $"/saints/{slug}/image.{extension}";
            }
        }

        return (relativeMarkdownPath, relativeImagePath);
    }

    public async Task<(string markdownPath, string? imagePath)> UpdateFilesAsync(NewSaintDto saintDto, string slug)
    {
        return await SaveFilesAsync(saintDto, slug);
    }
}
