using Microsoft.EntityFrameworkCore;

namespace ShoppingCart.Models;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public required DbSet<CartEntry> CartEntries { get; set; }
}