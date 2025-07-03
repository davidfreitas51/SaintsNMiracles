using Core.DTOs;
using Core.Interfaces;

namespace Infrastructure.Data.Services;

public class MiraclesService : IMiraclesService
{
    public Task DeleteFilesAsync(string slug)
    {
        throw new NotImplementedException();
    }

    public Task<(string markdownPath, string? imagePath)> SaveFilesAsync(NewMiracleDto newMiracle, string slug)
    {
        throw new NotImplementedException();
    }

    public Task<(string markdownPath, string? imagePath)> UpdateFilesAsync(NewMiracleDto updatedMiracle, string slug)
    {
        throw new NotImplementedException();
    }
}
