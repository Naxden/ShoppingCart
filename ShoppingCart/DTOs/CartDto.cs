namespace ShoppingCart.DTOs;

public class CartDto
{
    public required int UserId { get; set; }
    public List<CartItemDto> Items { get; set; } = [];
    
    public decimal TotalPrice => Items.Sum(item => item.TotalPrice);
}