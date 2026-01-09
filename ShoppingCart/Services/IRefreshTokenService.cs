using ShoppingCart.DTOs;

namespace ShoppingCart.Services;

public interface IRefreshTokenService
{
    int ExpirationInDays { get; }
    
    Task<string> SaveRefreshTokenAsync(UserDto user, CancellationToken ct = default);
    
    Task<RotateTokenDto> RotateRefreshTokenAsync(string refreshToken, CancellationToken ct = default);
    
    Task RemoveRefreshTokenAsync(string? refreshToken, CancellationToken ct = default);
}