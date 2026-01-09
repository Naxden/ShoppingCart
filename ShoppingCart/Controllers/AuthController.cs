using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingCart.Services;

namespace ShoppingCart.Controllers;

[ApiController]
[Route("api/")]
public class AuthController(IUserApiClient userClient, IJwtService jwt, IRefreshTokenService refreshTokenService) : ControllerBase
{
    public sealed record LoginRequest
    {
        public int UserId { get; init; }
    }

    [AllowAnonymous]
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var usersDtos = await userClient.GetUsersAsync(CancellationToken.None);

        return Ok(usersDtos);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest req)
    {
        var user = await userClient.GetUserByIdAsync(req.UserId);

        if (user == null)
            return Unauthorized("User not found");
        
        var refreshToken = await refreshTokenService.SaveRefreshTokenAsync(user, CancellationToken.None);
        
        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions()
        {
            HttpOnly = true,
            Expires = DateTimeOffset.UtcNow.AddDays(refreshTokenService.ExpirationInDays)
        });
        
        return Ok(jwt.GenerateToken(user));
    }

    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
            return Unauthorized();

        try
        {
            var rotateToken = await refreshTokenService.RotateRefreshTokenAsync(refreshToken, CancellationToken.None);
            Response.Cookies.Append("refreshToken", rotateToken.RefreshToken, new CookieOptions()
            {
                HttpOnly = true,
                Expires = DateTimeOffset.UtcNow.AddDays(refreshTokenService.ExpirationInDays)
            });

            return Ok(rotateToken.AccessToken);
        }
        catch (KeyNotFoundException ex)
        {
            return Unauthorized(ex.Message);
        }
    }

    [AllowAnonymous]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        if (Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
        {
            await refreshTokenService.RemoveRefreshTokenAsync(refreshToken, CancellationToken.None);
            Response.Cookies.Delete("refreshToken");
        }
        
        return NoContent();
    }
}