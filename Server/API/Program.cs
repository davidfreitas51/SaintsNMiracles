using System.Text.Json;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
        policy.WithOrigins("http://localhost:4200");
        policy.AllowCredentials();
    });
});

builder.Services.AddScoped<ISaintsRepository, SaintsRepository>();
builder.Services.AddScoped<ISaintsService, SaintsService>();
builder.Services.AddScoped<IMiraclesRepository, MiraclesRepository>();
builder.Services.AddScoped<IMiraclesService, MiraclesService>();

builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("defaultConnection"));
});

var app = builder.Build();

app.UseStaticFiles();

app.MapControllers();

try
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<DataContext>();
    context.Database.Migrate();
    await context.Database.MigrateAsync();
    await SeedData.SeedAsync(context);
}
catch (Exception ex)
{
    Console.WriteLine(ex);
    throw;
}
app.UseCors();

app.Run();
