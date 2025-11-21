namespace ShoppingCart.DTOs;

public class ProductDto
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Slug { get; set; } = "";
    public decimal Price { get; set; }
    public string Description { get; set; } = "";
    public CategoryDto? Category { get; set; }
    public List<string> Images { get; set; } = [];
    public DateTimeOffset CreationAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}