namespace ShoppingCart.DTOs;

public class CartItemDto
{
    public int ProductId { get; set; }
    public string Title { get; set; } = "";
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice => UnitPrice * Quantity;
    public string? ImageUrl { get; set; }
}