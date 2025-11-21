using ShoppingCart.DTOs;

namespace ShoppingCart.Services;

public interface IJwtService
{
    string GenerateToken(UserDto user);
}