1. DATABASE: open SQL Server Management Studio, run FinanceApi/Database/Schema.sql, then every file in FinanceApi/Database/StoredProcedures/ (Users.sql, Clients.sql, Loans.sql).
2. BACKEND (.NET 8): ensure the SQL Server Express instance is running and FinanceApi/appsettings.json points to your server. The default targets the local .\\SQLEXPRESS instance and the FinanceDb database. Then:
   cd FinanceApi && dotnet run --urls http://localhost:5000
3. FRONTEND (Angular 17+): 
   ng new finance-ui --standalone --routing=false --style=css
   Copy ALL files from angular-src/app/ into finance-ui/src/app/ (overwrite app.config.ts and app.component.ts; delete app.component.html/css/spec if present).
   In src/main.ts use: bootstrapApplication(AppComponent, appConfig)
   ng serve  ->  http://localhost:4200
