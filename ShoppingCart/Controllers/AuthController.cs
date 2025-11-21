using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingCart.Services;

namespace ShoppingCart.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IUserApiClient userClient, IJwtService jwt) : ControllerBase
{
    public sealed record LoginRequest
    {
        public int UserId { get; init; }
    }

    [AllowAnonymous]
    [HttpGet]
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

        return Ok(jwt.GenerateToken(user));
    }
}