using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;

namespace ShoppingCart.Extensions;

public static class DistributedCacheExtension
{
    public static async Task SetItemAsync<T>(this IDistributedCache cache, 
        string key,
        T data,
        TimeSpan? absoluteExpiration = null,
        TimeSpan? slidingExpiration = null,
        CancellationToken ct = default)
    {
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = absoluteExpiration ?? TimeSpan.FromMinutes(5),
            SlidingExpiration = slidingExpiration
        };

        var jsonData = JsonSerializer.Serialize(data);
        await cache.SetStringAsync(key, jsonData, options, ct);
    }

    public static async Task<T?> GetItemAsync<T>(this IDistributedCache cache,
        string key,
        CancellationToken ct = default)
    {
        var jsonData = await cache.GetStringAsync(key, ct);

        return string.IsNullOrEmpty(jsonData) ? default : JsonSerializer.Deserialize<T>(jsonData);
    }
}