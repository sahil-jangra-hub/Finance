USE FinanceDb;
GO
CREATE OR ALTER PROCEDURE usp_User_Register @Name NVARCHAR(100), @Email NVARCHAR(150), @Phone NVARCHAR(20), @PasswordHash NVARCHAR(200) AS
BEGIN
  IF EXISTS(SELECT 1 FROM Users WHERE Email=@Email OR Phone=@Phone) THROW 50001,'Email or phone already registered',1;
  INSERT Users(Name,Email,Phone,PasswordHash) VALUES(@Name,@Email,@Phone,@PasswordHash);
  SELECT CAST(SCOPE_IDENTITY() AS INT);
END
GO
CREATE OR ALTER PROCEDURE usp_User_GetByLogin @Login NVARCHAR(150) AS
  SELECT TOP 1 Id,Name,PasswordHash FROM Users WHERE Email=@Login OR Phone=@Login;
GO
