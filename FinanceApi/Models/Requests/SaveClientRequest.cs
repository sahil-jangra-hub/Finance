namespace FinanceApi.Models.Requests;

public sealed record SaveClientRequest(
    int? Id,
    string Name,
    string Gender,
    string Mobile,
    string? Address);
