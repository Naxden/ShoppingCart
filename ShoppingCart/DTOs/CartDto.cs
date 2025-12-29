namespace ShoppingCart.DTOs;

public class CartDto
{
    public List<CartItemDto> Items { get; set; } = [];
    
    public decimal TotalPrice => Items.Sum(item => item.TotalPrice);
}