USE FinanceDb;
GO
CREATE OR ALTER PROCEDURE usp_Client_List @UserId INT AS
  SELECT c.*, (SELECT COUNT(*) FROM Documents d WHERE d.ClientId=c.Id) DocCount
  FROM Clients c WHERE c.UserId=@UserId AND c.IsDeleted=0 ORDER BY c.Id DESC;
GO
CREATE OR ALTER PROCEDURE usp_Client_Save @Id INT=NULL, @UserId INT, @Name NVARCHAR(100), @Gender NVARCHAR(10), @Mobile NVARCHAR(20), @Address NVARCHAR(300)=NULL AS
BEGIN
  IF @Id IS NULL OR @Id=0 BEGIN
    INSERT Clients(UserId,Name,Gender,Mobile,Address) VALUES(@UserId,@Name,@Gender,@Mobile,@Address);
    SELECT CAST(SCOPE_IDENTITY() AS INT);
  END ELSE BEGIN
    UPDATE Clients SET Name=@Name,Gender=@Gender,Mobile=@Mobile,Address=@Address WHERE Id=@Id AND UserId=@UserId;
    SELECT @Id;
  END
END
GO
CREATE OR ALTER PROCEDURE usp_Client_SetPhoto @Id INT, @UserId INT, @PhotoPath NVARCHAR(300) AS
  UPDATE Clients SET PhotoPath=@PhotoPath WHERE Id=@Id AND UserId=@UserId;
GO
CREATE OR ALTER PROCEDURE usp_Client_Delete @Id INT, @UserId INT AS
  UPDATE Clients SET IsDeleted=1 WHERE Id=@Id AND UserId=@UserId;
GO
CREATE OR ALTER PROCEDURE usp_Client_Clear @Id INT, @UserId INT AS
BEGIN
  UPDATE Clients SET Status='Cleared' WHERE Id=@Id AND UserId=@UserId;
  UPDATE Loans SET Status='Cleared', ClearedOn=SYSDATETIME() WHERE ClientId=@Id AND UserId=@UserId AND Status='Active';
END
GO
CREATE OR ALTER PROCEDURE usp_Document_Add @ClientId INT, @UserId INT, @DocType NVARCHAR(50), @FilePath NVARCHAR(300) AS
  INSERT Documents(ClientId,DocType,FilePath) SELECT Id,@DocType,@FilePath FROM Clients WHERE Id=@ClientId AND UserId=@UserId;
GO
CREATE OR ALTER PROCEDURE usp_Document_List @ClientId INT, @UserId INT AS
  SELECT d.* FROM Documents d JOIN Clients c ON c.Id=d.ClientId WHERE d.ClientId=@ClientId AND c.UserId=@UserId;
GO
