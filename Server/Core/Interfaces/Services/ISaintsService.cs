public interface ISaintsService
{
    Task<int?> CreateSaintAsync(NewSaintDto newSaint);
    Task<bool> UpdateSaintAsync(int id, NewSaintDto updatedSaint);
    Task DeleteFilesAsync(string slug);
    Task<(string markdownPath, string? imagePath)> SaveFilesAsync(NewSaintDto saintDto, string slug);
    Task<(string markdownPath, string? imagePath)> UpdateFilesAsync(NewSaintDto saintDto, string slug);
}
