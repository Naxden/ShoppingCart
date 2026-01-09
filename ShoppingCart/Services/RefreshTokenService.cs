using System.Security.Cryptography;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using ShoppingCart.DTOs;
using ShoppingCart.Extensions;

namespace ShoppingCart.Services;

public sealed class RefreshTokenServiceOptions
{
    public int ExpirationInDays { get; set; }
 }

public class RefreshTokenService(
    IDistributedCache cache,
    IJwtService jwtService,
    IOptions<RefreshTokenServiceOptions> options) : IRefreshTokenService
{
    public int ExpirationInDays => options.Value.ExpirationInDays;
    
    public async Task<string> SaveRefreshTokenAsync(UserDto user, CancellationToken ct = default)
    {
        var refreshToken = GenerateRefreshToken();
        
        await cache.SetItemAsync($"refreshToken:{refreshToken}", user, TimeSpan.FromDays(ExpirationInDays), ct: ct);
        
        return refreshToken;
    }

    public async Task<UserDto?> GetUserAsync(string refreshToken, CancellationToken ct = default)
    {
        var userData = await cache.GetItemAsync<UserDto>($"refreshToken:{refreshToken}", ct);
        
        return userData;
    }

    public async Task<RotateTokenDto> RotateRefreshTokenAsync(string refreshToken, CancellationToken ct = default)
    {
        var userData = await GetUserAsync(refreshToken, ct);
        if (userData == null)
        {
            throw new KeyNotFoundException("Refresh token not found");
        }
        await RemoveRefreshTokenAsync(refreshToken, ct);
        
        var newRefreshToken = await SaveRefreshTokenAsync(userData, ct);
        
        return new RotateTokenDto
        {
            RefreshToken = newRefreshToken,
            AccessToken = jwtService.GenerateToken(userData),
        };
    }

    public async Task RemoveRefreshTokenAsync(string? refreshToken, CancellationToken ct = default)
    {
        if (refreshToken != null)
            await cache.RemoveAsync($"refreshToken:{refreshToken}", ct);
    }
    
    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
}