namespace FinanceApi.Models.Requests;

public sealed record RegisterRequest(string Name, string Email, string Phone, string Password);
