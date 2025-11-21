namespace ShoppingCart.DTOs;

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Slug { get; set; } = "";
    public string? Image { get; set; }
    public DateTimeOffset CreationAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}