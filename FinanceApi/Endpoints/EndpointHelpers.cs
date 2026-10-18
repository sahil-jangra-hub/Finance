using System.Security.Claims;

namespace FinanceApi.Endpoints;

internal static class EndpointHelpers
{
    public static int GetUserId(ClaimsPrincipal user) =>
        int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

    public static async Task<string> SaveUploadAsync(
        IFormFile file,
        IWebHostEnvironment environment,
        CancellationToken cancellationToken)
    {
        var webRootPath = environment.WebRootPath
            ?? Path.Combine(environment.ContentRootPath, "wwwroot");
        var uploadsDirectory = Path.Combine(webRootPath, "uploads");
        Directory.CreateDirectory(uploadsDirectory);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsDirectory, fileName);

        await using var stream = File.Create(filePath);
        await file.CopyToAsync(stream, cancellationToken);

        return $"/uploads/{fileName}";
    }
}
