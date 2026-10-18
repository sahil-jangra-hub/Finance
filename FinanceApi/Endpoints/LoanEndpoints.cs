using System.Data;
using System.Security.Claims;
using Dapper;
using FinanceApi.Models.Requests;
using Microsoft.AspNetCore.Routing;
using Microsoft.Data.SqlClient;

namespace FinanceApi.Endpoints;

public static class LoanEndpoints
{
    private const CommandType StoredProcedure = CommandType.StoredProcedure;

    public static IEndpointRouteBuilder MapLoanEndpoints(
        this IEndpointRouteBuilder endpoints,
        string connectionString)
    {
        var loans = endpoints.MapGroup("/api")
            .RequireAuthorization();

        loans.MapGet("/loans", async (
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            await using var connection = new SqlConnection(connectionString);
            return await connection.QueryAsync(new CommandDefinition(
                "usp_Loan_List",
                new { UserId = EndpointHelpers.GetUserId(user) },
                commandType: StoredProcedure,
                cancellationToken: cancellationToken));
        });

        loans.MapPost("/loans", async (
            ClaimsPrincipal user,
            CreateLoanRequest request,
            CancellationToken cancellationToken) =>
        {
            await using var connection = new SqlConnection(connectionString);
            return await connection.ExecuteScalarAsync<int>(new CommandDefinition(
                "usp_Loan_Create",
                new
                {
                    UserId = EndpointHelpers.GetUserId(user),
                    request.ClientId,
                    request.Principal,
                    request.InterestPercent,
                    request.DueDate,
                    request.PenaltyPerDay
                },
                commandType: StoredProcedure,
                cancellationToken: cancellationToken));
        });

        loans.MapPost("/loans/{id}/clear", async (
            ClaimsPrincipal user,
            int id,
            CancellationToken cancellationToken) =>
        {
            await using var connection = new SqlConnection(connectionString);
            await connection.ExecuteAsync(new CommandDefinition(
                "usp_Loan_Clear",
                new { Id = id, UserId = EndpointHelpers.GetUserId(user) },
                commandType: StoredProcedure,
                cancellationToken: cancellationToken));
        });

        return endpoints;
    }
}
