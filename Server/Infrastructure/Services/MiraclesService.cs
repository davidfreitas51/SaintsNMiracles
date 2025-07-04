using System.Text.RegularExpressions;
using Core.DTOs;
using Core.Interfaces;
using Microsoft.Extensions.Hosting;

public class MiraclesService(IHostEnvironment env) : IMiraclesService
{
    private readonly IHostEnvironment _env = env;

    public async Task<(string markdownPath, string? imagePath)> SaveFilesAsync(NewMiracleDto newMiracle, string slug)
    {
        var wwwroot = Path.Combine(_env.ContentRootPath, "wwwroot");
        var miracleFolder = Path.Combine(wwwroot, "miracles", slug);
        Directory.CreateDirectory(miracleFolder);

        // Save markdown
        var markdownPath = Path.Combine(miracleFolder, "markdown.md");
        await File.WriteAllTextAsync(markdownPath, newMiracle.MarkdownContent);
        var relativeMarkdownPath = $"/miracles/{slug}/markdown.md";

        // Save image (if provided)
        string? relativeImagePath = null;
        if (!string.IsNullOrWhiteSpace(newMiracle.Image) && newMiracle.Image.StartsWith("data:image/"))
        {
            var match = Regex.Match(newMiracle.Image, @"data:image/(?<type>.+?);base64,(?<data>.+)");
            if (match.Success)
            {
                var extension = match.Groups["type"].Value;
                var base64Data = match.Groups["data"].Value;
                var imageBytes = Convert.FromBase64String(base64Data);

                var imagePath = Path.Combine(miracleFolder, $"image.{extension}");
                await File.WriteAllBytesAsync(imagePath, imageBytes);

                relativeImagePath = $"/miracles/{slug}/image.{extension}";
            }
        }

        return (relativeMarkdownPath, relativeImagePath);
    }

    public async Task<(string markdownPath, string? imagePath)> UpdateFilesAsync(NewMiracleDto updatedMiracle, string slug)
    {
        var wwwroot = Path.Combine(_env.ContentRootPath, "wwwroot");
        var miracleFolder = Path.Combine(wwwroot, "miracles", slug);
        Directory.CreateDirectory(miracleFolder);

        var markdownPath = Path.Combine(miracleFolder, "markdown.md");
        await File.WriteAllTextAsync(markdownPath, updatedMiracle.MarkdownContent);
        var relativeMarkdownPath = $"/miracles/{slug}/markdown.md";

        string? relativeImagePath = null;
        if (!string.IsNullOrWhiteSpace(updatedMiracle.Image) && updatedMiracle.Image.StartsWith("data:image/"))
        {
            var match = Regex.Match(updatedMiracle.Image, @"data:image/(?<type>.+?);base64,(?<data>.+)");
            if (match.Success)
            {
                var extension = match.Groups["type"].Value;
                var base64Data = match.Groups["data"].Value;
                var imageBytes = Convert.FromBase64String(base64Data);

                var imagePath = Path.Combine(miracleFolder, $"image.{extension}");
                await File.WriteAllBytesAsync(imagePath, imageBytes);

                relativeImagePath = $"/miracles/{slug}/image.{extension}";
            }
        }

        return (relativeMarkdownPath, relativeImagePath);
    }

    public async Task DeleteFilesAsync(string slug)
    {
        var wwwroot = Path.Combine(_env.ContentRootPath, "wwwroot");
        var miracleFolder = Path.Combine(wwwroot, "miracles", slug);

        if (Directory.Exists(miracleFolder))
        {
            Directory.Delete(miracleFolder, recursive: true);
        }

        await Task.CompletedTask;
    }
}
