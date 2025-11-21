using ShoppingCart.DTOs;

namespace ShoppingCart.Services;

public class UserApiClient(HttpClient http) : IUserApiClient
{
    public async Task<IEnumerable<UserDto>> GetUsersAsync(CancellationToken ct = default)
    {
        var response = await http.GetFromJsonAsync<ICollection<UserDto>>("", ct);
        return response ?? [];
    }
    
    public async Task<UserDto?> GetUserByIdAsync(int userId, CancellationToken ct = default)
    {
        try
        {
            return await http.GetFromJsonAsync<UserDto>($"{userId}", ct);
        }
        catch (HttpRequestException) { return null; }
    }
}