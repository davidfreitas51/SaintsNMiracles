using System.Reflection;
using System.Text.Json;
using Core.Models;

namespace Infrastructure.Data;

public class SeedData
{
    public static async Task SeedAsync(DataContext context)
    {
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        if (!context.Saints.Any())
        {
            var saintsData = await File.ReadAllTextAsync(path + @"/Data/SeedData/saints.json");
            var saints = JsonSerializer.Deserialize<List<Saint>>(saintsData);

            if (saints is null) return;

            context.Saints.AddRange(saints);
            await context.SaveChangesAsync();
        }

        if (!context.Miracles.Any())
        {
            var miraclesData = await File.ReadAllTextAsync(path + @"/Data/SeedData/miracles.json");
            var miracles = JsonSerializer.Deserialize<List<Miracle>>(miraclesData);

            if (miracles is null) return;

            context.Miracles.AddRange(miracles);
            await context.SaveChangesAsync();
        }

    }
}
