using BarcodeGenerator.Models;
using BarcodeGenerator.Services;
using Microsoft.Extensions.Options;
using System.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// https://docs.microsoft.com/ru-ru/aspnet/core/tutorials/first-mongo-app?view=aspnetcore-6.0&tabs=visual-studio
builder.Services.Configure<PavluqueDatabaseSettings>(builder.Configuration.GetSection(nameof(PavluqueDatabaseSettings)));
builder.Services.AddSingleton<IPavluqueDatabaseSettings>(sp => sp.GetRequiredService<IOptions<PavluqueDatabaseSettings>>().Value);

builder.Services.AddSingleton<OrderService>();

builder.Services.AddControllersWithViews();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

//app.MapFallbackToFile("index.html"); ;

app.Run();
