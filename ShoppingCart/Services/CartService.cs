using Microsoft.EntityFrameworkCore;
using ShoppingCart.DTOs;
using ShoppingCart.Models;

namespace ShoppingCart.Services;

public class CartService(AppDbContext context, IProductApiClient productApiClient) : ICartService
{
    public async Task<CartDto> GetCartAsync(int userId, CancellationToken ct = default)
    {
        var entries = await context.CartEntries.Where(c => c.UserId == userId).ToListAsync(ct);

        var cart = new CartDto() { UserId = userId };

        foreach (var entry in entries)   
        {
            var product = await productApiClient.GetProductByIdAsync(entry.ProductId, ct);
            if (product == null) continue;

            cart.Items.Add(new CartItemDto
            {
                ProductId = product.Id,
                Title = product.Title,
                UnitPrice = product.Price,
                Quantity = entry.Quantity,
                ImageUrl = product.Images.FirstOrDefault()
            });
        }
        
        return cart;
    }

    public async Task AddItemAsync(int userId, int productId, int quantity = 1, CancellationToken ct = default)
    {
        var product = await productApiClient.GetProductByIdAsync(productId, ct);
        if (product == null) throw new KeyNotFoundException("Product not found");

        var entry = await context.CartEntries
            .FirstOrDefaultAsync(e => e.UserId == userId && e.ProductId == productId, ct);

        if (entry == null)
        {
            context.CartEntries.Add(new CartEntry { UserId = userId, ProductId = productId, Quantity = quantity });
        }
        else
        {
            entry.Quantity += quantity;
        }

        await context.SaveChangesAsync(ct);
    }

    public async Task RemoveItemAsync(int userId, int productId, int quantity = 1, CancellationToken ct = default)
    {
        var entry = await context.CartEntries.FirstOrDefaultAsync(e => e.UserId == userId && e.ProductId == productId, ct);
        if (entry == null) throw new KeyNotFoundException("Product not found in cart");

        entry.Quantity -= quantity;
        
        if (entry.Quantity <= 0)
            context.CartEntries.Remove(entry);    

        await context.SaveChangesAsync(ct);
    }

    public async Task ClearCartAsync(int userId, CancellationToken ct = default)
    {
        var entries = await context.CartEntries.Where(c => c.UserId == userId).ToListAsync(ct);
        
        context.CartEntries.RemoveRange(entries);
        
        await context.SaveChangesAsync(ct);
    }
}