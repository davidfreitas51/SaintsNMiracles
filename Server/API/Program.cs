using System.Text.Json;
using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:4200")
              .AllowCredentials();
    });
});

builder.Services.AddScoped<ISaintsRepository, SaintsRepository>();
builder.Services.AddScoped<ISaintsService, SaintsService>();
builder.Services.AddScoped<IMiraclesRepository, MiraclesRepository>();
builder.Services.AddScoped<IMiraclesService, MiraclesService>();
builder.Services.AddScoped<IReligiousOrdersRepository, ReligiousOrdersRepository>();
builder.Services.AddScoped<ITagsRepository, TagsRepository>();

builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("defaultConnection"));
});

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AppUser>().AddEntityFrameworkStores<DataContext>();

var app = builder.Build();

await using (var scope = app.Services.CreateAsyncScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DataContext>();
    await context.Database.MigrateAsync();
    await SeedData.SeedAsync(context);
}

app.UseCors();
app.UseStaticFiles();
app.MapControllers();
app.MapGroup("api").MapIdentityApi<AppUser>();

app.Run();
