USE FinanceDb;
GO
CREATE OR ALTER PROCEDURE usp_Loan_Create @UserId INT, @ClientId INT, @Principal DECIMAL(18,2), @InterestPercent DECIMAL(5,2), @DueDate DATE, @PenaltyPerDay DECIMAL(18,2) AS
BEGIN
  IF NOT EXISTS(SELECT 1 FROM Clients WHERE Id=@ClientId AND UserId=@UserId) THROW 50002,'Client not found',1;
  INSERT Loans(UserId,ClientId,Principal,InterestPercent,DueDate,PenaltyPerDay) VALUES(@UserId,@ClientId,@Principal,@InterestPercent,@DueDate,@PenaltyPerDay);
  SELECT CAST(SCOPE_IDENTITY() AS INT);
END
GO
-- Interest = Principal * Percent% per month (min 1 month). Penalty = days overdue * PenaltyPerDay (only while Active).
CREATE OR ALTER PROCEDURE usp_Loan_List @UserId INT AS
  SELECT l.Id,l.ClientId,c.Name ClientName,c.Mobile,l.Principal,l.InterestPercent,l.LoanDate,l.DueDate,l.PenaltyPerDay,l.Status,
    i.Interest, o.DaysOverdue, o.DaysOverdue*l.PenaltyPerDay Penalty,
    l.Principal+i.Interest+o.DaysOverdue*l.PenaltyPerDay TotalDue
  FROM Loans l JOIN Clients c ON c.Id=l.ClientId
  CROSS APPLY (SELECT l.Principal*l.InterestPercent/100*CASE WHEN DATEDIFF(MONTH,l.LoanDate,l.DueDate)<1 THEN 1 ELSE DATEDIFF(MONTH,l.LoanDate,l.DueDate) END Interest) i
  CROSS APPLY (SELECT CASE WHEN l.Status='Active' AND CAST(GETDATE() AS DATE)>l.DueDate THEN DATEDIFF(DAY,l.DueDate,CAST(GETDATE() AS DATE)) ELSE 0 END DaysOverdue) o
  WHERE l.UserId=@UserId AND c.IsDeleted=0 ORDER BY l.DueDate;
GO
CREATE OR ALTER PROCEDURE usp_Loan_Clear @Id INT, @UserId INT AS
  UPDATE Loans SET Status='Cleared', ClearedOn=SYSDATETIME() WHERE Id=@Id AND UserId=@UserId;
GO
