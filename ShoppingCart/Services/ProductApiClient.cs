using ShoppingCart.DTOs;

namespace ShoppingCart.Services;

public class ProductApiClient(HttpClient http) : IProductApiClient
{   
    public async Task<IEnumerable<ProductDto>> GetProductsAsync(CancellationToken ct = default)
    {
        var response = await http.GetFromJsonAsync<IEnumerable<ProductDto>>($"", ct);
        return response ?? [];
    }

    public async Task<ProductDto?> GetProductByIdAsync(int productId, CancellationToken ct = default)
    {
        try
        {
            return await http.GetFromJsonAsync<ProductDto>($"{productId}", ct);
        }
        catch (HttpRequestException) { return null; }
    }
}