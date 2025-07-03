using Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<Saint> Saints { get; set; }
    public DbSet<Miracle> Miracles { get; set; }
}
