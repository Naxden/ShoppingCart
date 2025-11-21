using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingCart.Services;

namespace ShoppingCart.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController(ICartService cart, IProductApiClient productApiClient) : ControllerBase
{
    private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

    [AllowAnonymous]
    [HttpGet("products")]
    public async Task<IActionResult> GetAllProducts()
    {
        var response = await productApiClient.GetProductsAsync(CancellationToken.None);
        return Ok(response);
    }
    
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetCart() => Ok(await cart.GetCartAsync(GetUserId()));

    [Authorize]
    [HttpPost("{productId:int}")]
    public async Task<IActionResult> Add(int productId, [FromQuery] int quantity = 1)
    {
        try
        {
            var id = GetUserId();
            await cart.AddItemAsync(id, productId, quantity);
            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [Authorize]
    [HttpDelete("{productId:int}")]
    public async Task<IActionResult> Remove(int productId, [FromQuery] int quantity = 1)
    {
        try
        {
            await cart.RemoveItemAsync(GetUserId(), productId, quantity);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [Authorize]
    [HttpDelete]
    public async Task<IActionResult> Clear()
    {
        await cart.ClearCartAsync(GetUserId());
        return NoContent();
    }
}