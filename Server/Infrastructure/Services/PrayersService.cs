
using System.Text.RegularExpressions;
using Core.DTOs;
using Core.Interfaces;
using Core.Interfaces.Services;
using Core.Models;
using Microsoft.Extensions.Hosting;

public class PrayersService(
    IHostEnvironment env,
    IPrayersRepository prayersRepository,
    ITagsRepository tagsRepository) : IPrayersService
{
    public async Task<int?> CreatePrayerAsync(NewPrayerDto newPrayer)
    {
        var slug = GenerateSlug(newPrayer.Title);
        if (await prayersRepository.SlugExistsAsync(slug))
            return null;

        var (markdownPath, imagePath) = await SaveFilesAsync(newPrayer, slug);

        var tags = new List<Tag>();
        if (newPrayer.TagIds != null && newPrayer.TagIds.Any())
            tags = await tagsRepository.GetByIdsAsync(newPrayer.TagIds);

        var prayer = new Prayer
        {
            Title = newPrayer.Title,
            Description = newPrayer.Description,
            Image = imagePath ?? "",
            MarkdownPath = markdownPath,
            Slug = slug,
            Tags = tags
        };

        var created = await prayersRepository.CreateAsync(prayer);
        return created ? prayer.Id : (int?)null;
    }

    public async Task<bool> UpdatePrayerAsync(int id, NewPrayerDto updatedPrayer)
    {
        var existingPrayer = await prayersRepository.GetByIdAsync(id);
        if (existingPrayer == null)
            return false;

        var slug = GenerateSlug(updatedPrayer.Title);
        var (markdownPath, imagePath) = await UpdateFilesAsync(updatedPrayer, slug);

        existingPrayer.Title = updatedPrayer.Title;
        existingPrayer.Description = updatedPrayer.Description;
        existingPrayer.Slug = slug;

        if (!string.IsNullOrWhiteSpace(imagePath))
            existingPrayer.Image = imagePath;

        if (!string.IsNullOrWhiteSpace(markdownPath))
            existingPrayer.MarkdownPath = markdownPath;

        if (updatedPrayer.TagIds != null && updatedPrayer.TagIds.Any())
            existingPrayer.Tags = await tagsRepository.GetByIdsAsync(updatedPrayer.TagIds);
        else
            existingPrayer.Tags = new List<Tag>();

        return await prayersRepository.UpdateAsync(existingPrayer);
    }

    public async Task DeletePrayerAsync(string slug)
    {
        var wwwroot = Path.Combine(env.ContentRootPath, "wwwroot");
        var prayerFolder = Path.Combine(wwwroot, "prayers", slug);

        if (Directory.Exists(prayerFolder))
            Directory.Delete(prayerFolder, recursive: true);

        await Task.CompletedTask;
    }

    private string GenerateSlug(string title)
    {
        return Regex.Replace(title.ToLower(), @"[^a-z0-9]+", "-").Trim('-');
    }

    public async Task<(string markdownPath, string? imagePath)> SaveFilesAsync(NewPrayerDto prayerDto, string slug)
    {
        var wwwroot = Path.Combine(env.ContentRootPath, "wwwroot");
        var prayerFolder = Path.Combine(wwwroot, "prayers", slug);
        Directory.CreateDirectory(prayerFolder);

        var markdownPath = Path.Combine(prayerFolder, "markdown.md");
        await File.WriteAllTextAsync(markdownPath, prayerDto.MarkdownContent);
        var relativeMarkdownPath = $"/prayers/{slug}/markdown.md";

        string? relativeImagePath = null;
        if (!string.IsNullOrWhiteSpace(prayerDto.Image) && prayerDto.Image.StartsWith("data:image/"))
        {
            var match = Regex.Match(prayerDto.Image, @"data:image/(?<type>.+?);base64,(?<data>.+)");
            if (match.Success)
            {
                var extension = match.Groups["type"].Value;
                var base64Data = match.Groups["data"].Value;
                var imageBytes = Convert.FromBase64String(base64Data);

                var imagePath = Path.Combine(prayerFolder, $"image.{extension}");
                await File.WriteAllBytesAsync(imagePath, imageBytes);

                relativeImagePath = $"/prayers/{slug}/image.{extension}";
            }
        }

        return (relativeMarkdownPath, relativeImagePath);
    }

    public async Task<(string markdownPath, string? imagePath)> UpdateFilesAsync(NewPrayerDto prayerDto, string slug)
    {
        return await SaveFilesAsync(prayerDto, slug);
    }
}

