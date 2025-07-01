using System.Text.RegularExpressions;
using Core.DTOs;
using Core.Interfaces;
using Microsoft.Extensions.Hosting;

public class SaintsService(IHostEnvironment env) : ISaintsService
{
    private readonly IHostEnvironment _env = env;

    public async Task<(string markdownPath, string? imagePath)> SaveFilesAsync(NewSaintDto newSaint, string slug)
    {
        var wwwroot = Path.Combine(_env.ContentRootPath, "wwwroot");
        var saintFolder = Path.Combine(wwwroot, "saints", slug);
        Directory.CreateDirectory(saintFolder);

        // Save markdown
        var markdownPath = Path.Combine(saintFolder, "markdown.md");
        await File.WriteAllTextAsync(markdownPath, newSaint.MarkdownContent);
        var relativeMarkdownPath = $"/saints/{slug}/markdown.md";

        // Save image (if provided)
        string? relativeImagePath = null;
        if (!string.IsNullOrWhiteSpace(newSaint.Image) && newSaint.Image.StartsWith("data:image/"))
        {
            var match = Regex.Match(newSaint.Image, @"data:image/(?<type>.+?);base64,(?<data>.+)");
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

    public async Task<(string markdownPath, string? imagePath)> UpdateFilesAsync(NewSaintDto updatedSaint, string slug)
    {
        var wwwroot = Path.Combine(_env.ContentRootPath, "wwwroot");
        var saintFolder = Path.Combine(wwwroot, "saints", slug);
        Directory.CreateDirectory(saintFolder);

        var markdownPath = Path.Combine(saintFolder, "markdown.md");
        await File.WriteAllTextAsync(markdownPath, updatedSaint.MarkdownContent);
        var relativeMarkdownPath = $"/saints/{slug}/markdown.md";

        string? relativeImagePath = null;
        if (!string.IsNullOrWhiteSpace(updatedSaint.Image) && updatedSaint.Image.StartsWith("data:image/"))
        {
            var match = Regex.Match(updatedSaint.Image, @"data:image/(?<type>.+?);base64,(?<data>.+)");
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


    public async Task DeleteFilesAsync(string slug)
    {
        var wwwroot = Path.Combine(_env.ContentRootPath, "wwwroot");
        var saintFolder = Path.Combine(wwwroot, "saints", slug);

        if (Directory.Exists(saintFolder))
        {
            Directory.Delete(saintFolder, recursive: true);
        }

        await Task.CompletedTask;
    }
}
