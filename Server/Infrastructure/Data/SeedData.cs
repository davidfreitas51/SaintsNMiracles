using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using Core.Models;

namespace Infrastructure.Data;

public class SeedData
{
    public static async Task SeedAsync(DataContext context)
    {
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? throw new InvalidOperationException("Base path is null");

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        };

        if (!context.ReligiousOrders.Any())
        {
            var ordersData = await File.ReadAllTextAsync(Path.Combine(path, "Data/SeedData/religious-orders.json"));
            var orders = JsonSerializer.Deserialize<List<ReligiousOrder>>(ordersData, jsonOptions);

            if (orders is not null)
            {
                context.ReligiousOrders.AddRange(orders);
                await context.SaveChangesAsync();
            }
        }

        if (!context.Tags.Any())
        {
            var tagsData = await File.ReadAllTextAsync(Path.Combine(path, "Data/SeedData/tags.json"));
            var tags = JsonSerializer.Deserialize<List<Tag>>(tagsData, jsonOptions);

            if (tags is not null)
            {
                context.Tags.AddRange(tags);
                await context.SaveChangesAsync();
            }
        }

        if (!context.Saints.Any())
        {
            var saintsData = await File.ReadAllTextAsync(Path.Combine(path, "Data/SeedData/saints.json"));
            var saints = JsonSerializer.Deserialize<List<Saint>>(saintsData, jsonOptions);

            if (saints is null) return;

            var allOrders = context.ReligiousOrders.ToList();
            var allTags = context.Tags.ToList();

            foreach (var saint in saints)
            {
                if (saint.ReligiousOrder != null)
                {
                    saint.ReligiousOrder = allOrders.FirstOrDefault(o => o.Name == saint.ReligiousOrder.Name);
                }

                if (saint.Tags?.Any() == true)
                {
                    var linkedTags = new List<Tag>();
                    foreach (var tag in saint.Tags)
                    {
                        var foundTag = allTags.FirstOrDefault(t => t.Name == tag.Name && t.TagType == tag.TagType);
                        if (foundTag != null)
                            linkedTags.Add(foundTag);
                    }
                    saint.Tags = linkedTags;
                }
            }

            context.Saints.AddRange(saints);
            await context.SaveChangesAsync();
        }

        if (!context.Miracles.Any())
        {
            var miraclesData = await File.ReadAllTextAsync(Path.Combine(path, "Data/SeedData/miracles.json"));
            var miracles = JsonSerializer.Deserialize<List<Miracle>>(miraclesData, jsonOptions);

            if (miracles is not null)
            {
                context.Miracles.AddRange(miracles);
                await context.SaveChangesAsync();
            }
        }
    }
}
