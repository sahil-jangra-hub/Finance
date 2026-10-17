using System.Data; using System.IdentityModel.Tokens.Jwt; using System.Security.Claims; using System.Text;
using Dapper; using Microsoft.AspNetCore.Authentication.JwtBearer; using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient; using Microsoft.IdentityModel.Tokens;

Directory.CreateDirectory("wwwroot/uploads");
var b = WebApplication.CreateBuilder(args);
var cs = b.Configuration.GetConnectionString("Db")!;
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(b.Configuration["Jwt:Key"]!));
b.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
 .AddJwtBearer(o => o.TokenValidationParameters = new() { IssuerSigningKey = key, ValidateIssuer = false, ValidateAudience = false });
b.Services.AddAuthorization();
b.Services.AddCors(o => o.AddDefaultPolicy(p => p.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod()));
var app = b.Build();
app.UseCors(); app.UseStaticFiles(); app.UseAuthentication(); app.UseAuthorization();

const CommandType SP = CommandType.StoredProcedure;
int Uid(ClaimsPrincipal u) => int.Parse(u.FindFirstValue(ClaimTypes.NameIdentifier)!);
async Task<string> Save(IFormFile f) {
  var n = $"{Guid.NewGuid()}{Path.GetExtension(f.FileName)}";
  using var s = File.Create(Path.Combine("wwwroot/uploads", n)); await f.CopyToAsync(s); return "/uploads/" + n;
}

app.MapPost("/api/auth/register", async (Reg r) => {
  try {
    using var c = new SqlConnection(cs);
    var id = await c.ExecuteScalarAsync<int>("usp_User_Register", new { r.Name, r.Email, r.Phone, PasswordHash = BCrypt.Net.BCrypt.HashPassword(r.Password) }, commandType: SP);
    return Results.Ok(new { id });
  } catch (SqlException e) { return Results.BadRequest(new { message = e.Message }); }
});

app.MapPost("/api/auth/login", async (Log r) => {
  using var c = new SqlConnection(cs);
  var u = await c.QueryFirstOrDefaultAsync<dynamic>("usp_User_GetByLogin", new { Login = r.Id }, commandType: SP);
  if (u == null || !BCrypt.Net.BCrypt.Verify(r.Password, (string)u.PasswordHash)) return Results.Unauthorized();
  var t = new JwtSecurityToken(claims: new[] { new Claim(ClaimTypes.NameIdentifier, ((int)u.Id).ToString()) },
    expires: DateTime.UtcNow.AddHours(12), signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
  return Results.Ok(new { token = new JwtSecurityTokenHandler().WriteToken(t), name = (string)u.Name });
});

var g = app.MapGroup("/api").RequireAuthorization();

g.MapGet("/clients", async (ClaimsPrincipal u) => { using var c = new SqlConnection(cs);
  return await c.QueryAsync("usp_Client_List", new { UserId = Uid(u) }, commandType: SP); });
g.MapPost("/clients", async (ClaimsPrincipal u, ClientIn x) => { using var c = new SqlConnection(cs);
  return await c.ExecuteScalarAsync<int>("usp_Client_Save", new { x.Id, UserId = Uid(u), x.Name, x.Gender, x.Mobile, x.Address }, commandType: SP); });
g.MapDelete("/clients/{id}", async (ClaimsPrincipal u, int id) => { using var c = new SqlConnection(cs);
  await c.ExecuteAsync("usp_Client_Delete", new { Id = id, UserId = Uid(u) }, commandType: SP); });
g.MapPost("/clients/{id}/clear", async (ClaimsPrincipal u, int id) => { using var c = new SqlConnection(cs);
  await c.ExecuteAsync("usp_Client_Clear", new { Id = id, UserId = Uid(u) }, commandType: SP); });
g.MapPost("/clients/{id}/photo", async (ClaimsPrincipal u, int id, IFormFile file) => { using var c = new SqlConnection(cs);
  await c.ExecuteAsync("usp_Client_SetPhoto", new { Id = id, UserId = Uid(u), PhotoPath = await Save(file) }, commandType: SP); }).DisableAntiforgery();
g.MapPost("/clients/{id}/documents", async (ClaimsPrincipal u, int id, IFormFile file, [FromForm] string docType) => { using var c = new SqlConnection(cs);
  await c.ExecuteAsync("usp_Document_Add", new { ClientId = id, UserId = Uid(u), DocType = docType, FilePath = await Save(file) }, commandType: SP); }).DisableAntiforgery();
g.MapGet("/clients/{id}/documents", async (ClaimsPrincipal u, int id) => { using var c = new SqlConnection(cs);
  return await c.QueryAsync("usp_Document_List", new { ClientId = id, UserId = Uid(u) }, commandType: SP); });

g.MapGet("/loans", async (ClaimsPrincipal u) => { using var c = new SqlConnection(cs);
  return await c.QueryAsync("usp_Loan_List", new { UserId = Uid(u) }, commandType: SP); });
g.MapPost("/loans", async (ClaimsPrincipal u, LoanIn x) => { using var c = new SqlConnection(cs);
  return await c.ExecuteScalarAsync<int>("usp_Loan_Create", new { UserId = Uid(u), x.ClientId, x.Principal, x.InterestPercent, x.DueDate, x.PenaltyPerDay }, commandType: SP); });
g.MapPost("/loans/{id}/clear", async (ClaimsPrincipal u, int id) => { using var c = new SqlConnection(cs);
  await c.ExecuteAsync("usp_Loan_Clear", new { Id = id, UserId = Uid(u) }, commandType: SP); });

app.Run();
record Reg(string Name, string Email, string Phone, string Password);
record Log(string Id, string Password);
record ClientIn(int? Id, string Name, string Gender, string Mobile, string? Address);
record LoanIn(int ClientId, decimal Principal, decimal InterestPercent, DateTime DueDate, decimal PenaltyPerDay);
