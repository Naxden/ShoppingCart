using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ShoppingCart.DTOs;

namespace ShoppingCart.Services;

public class JwtService : IJwtService
{
    private readonly string _secret;
    private readonly int _expiresMinutes;

    public JwtService(IConfiguration config)
    {
        _secret = config["Jwt:Secret"] ?? "very_secret_key_for_shopcart_api_123";
        _expiresMinutes = int.TryParse(config["Jwt:ExpiresMinutes"], out var m) ? m : 60;
    }

    public string GenerateToken(UserDto user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_expiresMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}