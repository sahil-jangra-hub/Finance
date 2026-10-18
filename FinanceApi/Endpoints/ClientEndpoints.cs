using System.Data;
using System.Security.Claims;
using Dapper;
using FinanceApi.Models.Requests;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Data.SqlClient;

namespace FinanceApi.Endpoints;

public static class ClientEndpoints
{
    public static IEndpointRouteBuilder MapClientEndpoints(
        this IEndpointRouteBuilder endpoints,
        string connectionString)
    {
        var routeHandlers = new ClientEndpointHandlers(connectionString);
        var clients = endpoints.MapGroup("/api")
            .RequireAuthorization();

        clients.MapGet("/clients", routeHandlers.GetClientsAsync);
        clients.MapPost("/clients", routeHandlers.SaveClientAsync);
        clients.MapDelete("/clients/{id}", routeHandlers.DeleteClientAsync);
        clients.MapPost("/clients/{id}/clear", routeHandlers.ClearClientAsync);
        clients.MapPost("/clients/{id}/photo", routeHandlers.SetClientPhotoAsync)
            .DisableAntiforgery();
        clients.MapPost("/clients/{id}/documents", routeHandlers.AddClientDocumentAsync)
            .DisableAntiforgery();
        clients.MapGet("/clients/{id}/documents", routeHandlers.GetClientDocumentsAsync);

        return endpoints;
    }
}

internal sealed class ClientEndpointHandlers(string connectionString)
{
    private const CommandType StoredProcedure = CommandType.StoredProcedure;

    public async Task<IEnumerable<dynamic>> GetClientsAsync(
        ClaimsPrincipal user,
        CancellationToken cancellationToken)
    {
        await using var connection = CreateConnection();
        return await connection.QueryAsync(CreateCommand(
            "usp_Client_List",
            new { UserId = EndpointHelpers.GetUserId(user) },
            cancellationToken));
    }

    public async Task<int> SaveClientAsync(
        ClaimsPrincipal user,
        SaveClientRequest request,
        CancellationToken cancellationToken)
    {
        await using var connection = CreateConnection();
        return await connection.ExecuteScalarAsync<int>(CreateCommand(
            "usp_Client_Save",
            new
            {
                request.Id,
                UserId = EndpointHelpers.GetUserId(user),
                request.Name,
                request.Gender,
                request.Mobile,
                request.Address
            },
            cancellationToken));
    }

    public async Task DeleteClientAsync(
        ClaimsPrincipal user,
        int id,
        CancellationToken cancellationToken)
    {
        await using var connection = CreateConnection();
        await connection.ExecuteAsync(CreateCommand(
            "usp_Client_Delete",
            new { Id = id, UserId = EndpointHelpers.GetUserId(user) },
            cancellationToken));
    }

    public async Task ClearClientAsync(
        ClaimsPrincipal user,
        int id,
        CancellationToken cancellationToken)
    {
        await using var connection = CreateConnection();
        await connection.ExecuteAsync(CreateCommand(
            "usp_Client_Clear",
            new { Id = id, UserId = EndpointHelpers.GetUserId(user) },
            cancellationToken));
    }

    public async Task SetClientPhotoAsync(
        ClaimsPrincipal user,
        int id,
        IFormFile file,
        IWebHostEnvironment environment,
        CancellationToken cancellationToken)
    {
        var photoPath = await EndpointHelpers.SaveUploadAsync(file, environment, cancellationToken);

        await using var connection = CreateConnection();
        await connection.ExecuteAsync(CreateCommand(
            "usp_Client_SetPhoto",
            new { Id = id, UserId = EndpointHelpers.GetUserId(user), PhotoPath = photoPath },
            cancellationToken));
    }

    public async Task AddClientDocumentAsync(
        ClaimsPrincipal user,
        int id,
        IFormFile file,
        [FromForm] string docType,
        IWebHostEnvironment environment,
        CancellationToken cancellationToken)
    {
        var filePath = await EndpointHelpers.SaveUploadAsync(file, environment, cancellationToken);

        await using var connection = CreateConnection();
        await connection.ExecuteAsync(CreateCommand(
            "usp_Document_Add",
            new
            {
                ClientId = id,
                UserId = EndpointHelpers.GetUserId(user),
                DocType = docType,
                FilePath = filePath
            },
            cancellationToken));
    }

    public async Task<IEnumerable<dynamic>> GetClientDocumentsAsync(
        ClaimsPrincipal user,
        int id,
        CancellationToken cancellationToken)
    {
        await using var connection = CreateConnection();
        return await connection.QueryAsync(CreateCommand(
            "usp_Document_List",
            new { ClientId = id, UserId = EndpointHelpers.GetUserId(user) },
            cancellationToken));
    }

    private SqlConnection CreateConnection() => new(connectionString);

    private static CommandDefinition CreateCommand(
        string procedureName,
        object parameters,
        CancellationToken cancellationToken) =>
        new(
            procedureName,
            parameters,
            commandType: StoredProcedure,
            cancellationToken: cancellationToken);
}
