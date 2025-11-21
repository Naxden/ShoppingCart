namespace ShoppingCart.Models;

public class CartEntry
{
    public int Id { get; set; }
    public required int UserId { get; set; }
    public required int ProductId { get; set; }
    public required int Quantity { get; set; }
}