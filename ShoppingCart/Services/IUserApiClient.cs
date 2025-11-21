using ShoppingCart.DTOs;

namespace ShoppingCart.Services;

public interface IUserApiClient
{
    public Task<IEnumerable<UserDto>> GetUsersAsync(CancellationToken ct = default);
    public Task<UserDto?> GetUserByIdAsync(int userId, CancellationToken ct = default);
}