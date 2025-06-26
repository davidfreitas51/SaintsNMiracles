using System.Text.RegularExpressions;
using Core.DTOs;
using Core.Interfaces;
using Microsoft.Extensions.Hosting;

public class SaintsService(IHostEnvironment env) : ISaintsService
{
    private readonly IHostEnvironment _env = env;

    public async Task<(string markdownPath, string? imagePath)> SaveSaintFilesAsync(NewSaintDTO newSaint, string slug)
    {
        var wwwroot = Path.Combine(_env.ContentRootPath, "wwwroot");

        var markdownFolder = Path.Combine(wwwroot, "markdown", "saints", slug);
        Directory.CreateDirectory(markdownFolder);
        var markdownPath = Path.Combine(markdownFolder, "markdown.md");
        await File.WriteAllTextAsync(markdownPath, newSaint.MarkdownContent);

        string? relativeImagePath = null;
        if (!string.IsNullOrWhiteSpace(newSaint.Image) && newSaint.Image.StartsWith("data:image/"))
        {
            var match = Regex.Match(newSaint.Image, @"data:image/(?<type>.+?);base64,(?<data>.+)");
            if (match.Success)
            {
                var extension = match.Groups["type"].Value;
                var base64Data = match.Groups["data"].Value;
                var imageBytes = Convert.FromBase64String(base64Data);

                var fileName = $"{slug}.{extension}";
                var imageFolder = Path.Combine(wwwroot, "images", "saints");
                Directory.CreateDirectory(imageFolder);

                var imagePath = Path.Combine(imageFolder, fileName);
                await File.WriteAllBytesAsync(imagePath, imageBytes);

                relativeImagePath = $"/images/saints/{fileName}";
            }
        }

        var relativeMarkdownPath = $"/markdown/saints/{slug}/markdown.md";
        return (relativeMarkdownPath, relativeImagePath);
    }

}
