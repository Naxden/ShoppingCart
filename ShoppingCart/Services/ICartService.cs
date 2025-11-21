using ShoppingCart.DTOs;

namespace ShoppingCart.Services;

public interface ICartService
{
    Task<CartDto> GetCartAsync(int userId, CancellationToken ct = default);
    Task AddItemAsync(int userId, int productId, int quantity = 1, CancellationToken ct = default);
    Task RemoveItemAsync(int userId, int productId, int quantity = 1, CancellationToken ct = default);
    Task ClearCartAsync(int userId, CancellationToken ct = default);
}