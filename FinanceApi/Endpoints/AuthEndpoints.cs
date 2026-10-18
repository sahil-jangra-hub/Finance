using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FinanceApi.Models.Requests;
using Microsoft.AspNetCore.Routing;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using Dapper;

namespace FinanceApi.Endpoints;

public static class AuthEndpoints
{
    private const CommandType StoredProcedure = CommandType.StoredProcedure;

    public static IEndpointRouteBuilder MapAuthEndpoints(
        this IEndpointRouteBuilder endpoints,
        string connectionString,
        SymmetricSecurityKey signingKey)
    {
        endpoints.MapPost("/api/auth/register", async (
            RegisterRequest request,
            CancellationToken cancellationToken) =>
        {
            try
            {
                await using var connection = new SqlConnection(connectionString);
                var userId = await connection.ExecuteScalarAsync<int>(new CommandDefinition(
                    "usp_User_Register",
                    new
                    {
                        request.Name,
                        request.Email,
                        request.Phone,
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
                    },
                    commandType: StoredProcedure,
                    cancellationToken: cancellationToken));

                return Results.Ok(new { id = userId });
            }
            catch (SqlException exception)
            {
                return Results.BadRequest(new { message = exception.Message });
            }
        });

        endpoints.MapPost("/api/auth/login", async (
            LoginRequest request,
            CancellationToken cancellationToken) =>
        {
            await using var connection = new SqlConnection(connectionString);
            var user = await connection.QueryFirstOrDefaultAsync<LoginUser>(new CommandDefinition(
                "usp_User_GetByLogin",
                new { Login = request.Id },
                commandType: StoredProcedure,
                cancellationToken: cancellationToken));

            if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Results.Unauthorized();
            }

            var token = new JwtSecurityToken(
                claims:
                [
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
                ],
                expires: DateTime.UtcNow.AddHours(12),
                signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256));

            return Results.Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                name = user.Name
            });
        });

        return endpoints;
    }

    private sealed record LoginUser(int Id, string Name, string PasswordHash);
}
