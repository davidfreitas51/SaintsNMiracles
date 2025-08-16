using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class SeedData
{
    public static async Task SeedAsync(DataContext context)
    {
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)
                   ?? throw new InvalidOperationException("Base path is null");

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        };

        var allTags = await context.Tags.ToListAsync();

        var normalizedGroups = allTags
            .GroupBy(t => new
            {
                Name = t.Name.Trim().ToLowerInvariant(),
                TagType = t.TagType.ToString().Trim().ToLowerInvariant()
            })
            .Where(g => g.Count() > 1)
            .SelectMany(g => g.Skip(1))
            .ToList();

        if (normalizedGroups.Any())
        {
            context.Tags.RemoveRange(normalizedGroups);
            await context.SaveChangesAsync();
        }

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

        var tagsData = await File.ReadAllTextAsync(Path.Combine(path, "Data/SeedData/tags.json"));
        var tags = JsonSerializer.Deserialize<List<Tag>>(tagsData, jsonOptions);

        if (tags is not null)
        {
            var existingTags = await context.Tags.ToListAsync();

            var uniqueTags = tags
                .Where(tag =>
                    !existingTags.Any(et =>
                        et.Name.Trim().Equals(tag.Name.Trim(), StringComparison.OrdinalIgnoreCase) &&
                        et.TagType.ToString().Trim().Equals(tag.TagType.ToString().Trim(), StringComparison.OrdinalIgnoreCase)
                    )
                )
                .ToList();

            if (uniqueTags.Any())
            {
                context.Tags.AddRange(uniqueTags);
                await context.SaveChangesAsync();
            }
        }

        var currentTags = await context.Tags.ToListAsync();

        if (!context.Saints.Any())
        {
            var saintsData = await File.ReadAllTextAsync(Path.Combine(path, "Data/SeedData/saints.json"));
            var saints = JsonSerializer.Deserialize<List<Saint>>(saintsData, jsonOptions);

            if (saints is not null)
            {
                var allOrders = await context.ReligiousOrders.ToListAsync();

                foreach (var saint in saints)
                {
                    if (saint.ReligiousOrder != null)
                    {
                        saint.ReligiousOrder = allOrders.FirstOrDefault(o =>
                            o.Name.Trim().Equals(saint.ReligiousOrder.Name.Trim(), StringComparison.OrdinalIgnoreCase));
                    }

                    if (saint.Tags?.Any() == true)
                    {
                        var linkedTags = new List<Tag>();
                        foreach (var tag in saint.Tags)
                        {
                            var foundTag = currentTags.FirstOrDefault(t =>
                                t.Name.Trim().Equals(tag.Name.Trim(), StringComparison.OrdinalIgnoreCase) &&
                                t.TagType.ToString().Trim().Equals(tag.TagType.ToString().Trim(), StringComparison.OrdinalIgnoreCase));

                            if (foundTag != null)
                                linkedTags.Add(foundTag);
                        }
                        saint.Tags = linkedTags;
                    }
                }

                context.Saints.AddRange(saints);
                await context.SaveChangesAsync();
            }
        }

        if (!context.Miracles.Any())
        {
            var miraclesData = await File.ReadAllTextAsync(Path.Combine(path, "Data/SeedData/miracles.json"));
            var miracles = JsonSerializer.Deserialize<List<Miracle>>(miraclesData, jsonOptions);
            if (miracles is not null)
            {
                var allTagsForMiracles = await context.Tags.ToListAsync();

                foreach (var miracle in miracles)
                {
                    if (miracle.Tags?.Any() == true)
                    {
                        var linkedTags = new List<Tag>();
                        foreach (var tag in miracle.Tags)
                        {
                            var foundTag = allTagsForMiracles.FirstOrDefault(t =>
                                t.Name.Trim().Equals(tag.Name.Trim(), StringComparison.OrdinalIgnoreCase) &&
                                t.TagType.ToString().Trim().Equals(tag.TagType.ToString().Trim(), StringComparison.OrdinalIgnoreCase));
                            if (foundTag != null)
                                linkedTags.Add(foundTag);
                        }
                        miracle.Tags = linkedTags;
                    }
                }

                context.Miracles.AddRange(miracles);
                await context.SaveChangesAsync();
            }

            if (!context.Prayers.Any())
            {
                var prayersData = await File.ReadAllTextAsync(Path.Combine(path, "Data/SeedData/prayers.json"));
                var prayers = JsonSerializer.Deserialize<List<Prayer>>(prayersData, jsonOptions);

                if (prayers is not null)
                {
                    foreach (var prayer in prayers)
                    {
                        if (prayer.Tags?.Any() == true)
                        {
                            var linkedTags = new List<Tag>();
                            foreach (var tag in prayer.Tags)
                            {
                                var foundTag = currentTags.FirstOrDefault(t =>
                                    t.Name.Trim().Equals(tag.Name.Trim(), StringComparison.OrdinalIgnoreCase) &&
                                    t.TagType.ToString().Trim().Equals(tag.TagType.ToString().Trim(), StringComparison.OrdinalIgnoreCase));
                                if (foundTag != null)
                                    linkedTags.Add(foundTag);
                            }
                            prayer.Tags = linkedTags;
                        }
                    }

                    context.Prayers.AddRange(prayers);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
