using ShoppingCart.DTOs;

namespace ShoppingCart.Services;

public interface IProductApiClient
{
    Task<IEnumerable<ProductDto>> GetProductsAsync(CancellationToken ct = default);
    Task<ProductDto?> GetProductByIdAsync(int productId, CancellationToken ct = default);
}