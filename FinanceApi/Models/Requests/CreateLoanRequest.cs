namespace FinanceApi.Models.Requests;

public sealed record CreateLoanRequest(
    int ClientId,
    decimal Principal,
    decimal InterestPercent,
    DateTime DueDate,
    decimal PenaltyPerDay);
