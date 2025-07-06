# BlazoredGoogleCaptcha: Google reCAPTCHA V2 and V3 for Blazor

[![NuGet](https://img.shields.io/nuget/v/CMS365.BlazoredGoogleCaptcha.svg?logo=nuget)](https://www.nuget.org/packages/CMS365.BlazoredGoogleCaptcha/)
![NuGet Downloads](https://img.shields.io/nuget/dt/CMS365.BlazoredGoogleCaptcha)
![GitHub last commit (main)](https://img.shields.io/github/last-commit/CMS365-PTY-LTD/BlazoredGoogleCaptcha/main.svg?logo=github)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
![GitHub Stars](https://img.shields.io/github/stars/CMS365-PTY-LTD/BlazoredGoogleCaptcha?style=social)

BlazoredGoogleCaptcha is a lightweight .NET library that simplifies Google reCAPTCHA integration in Blazor WebAssembly (WASM) and Blazor Server applications. It provides an easy-to-use component for both reCAPTCHA v2 ("I'm not a robot" checkbox) and reCAPTCHA v3 (invisible background verification).

# Installation

BlazoredGoogleCaptcha is [available on NuGet](https://www.nuget.org/packages/CMS365.BlazoredGoogleCaptcha/). Use the package manager
console in Visual Studio to install it:

```pwsh
Install-Package CMS365.BlazoredGoogleCaptcha
```

## Getting started
Navigate to https://www.google.com/recaptcha/admin/create and register 2 sites.

Select "Score based (v3)" for the first site and "Checkbox (v2)" for the second site.
![alt text](https://github.com/CMS365-PTY-LTD/BlazoredGoogleCaptcha/blob/main/images/step2.png?raw=true)
Add demain, for example localhost for testing purposes.

Also select Google Cloud Platform project, if you have one, or create a new one.

Once the projct has been created, click on the settings icon in the top right corner of the page and copy the site key and secret key for both reCAPTCHA v2 and v3.

![alt text](https://github.com/CMS365-PTY-LTD/BlazoredGoogleCaptcha/blob/main/images/step3.png?raw=true)

![alt text](https://github.com/CMS365-PTY-LTD/BlazoredGoogleCaptcha/blob/main/images/step4.png?raw=true)


Install the package and create 2 seperate pages for V2 and V3 reCAPTCHA.

In the demo project, I have created 2 pages : 'CounterV2.razor' and 'CounterV3.razor'.

![alt text](https://github.com/CMS365-PTY-LTD/BlazoredGoogleCaptcha/blob/main/images/step1.png?raw=true)

## V2 ReCaptcha

Add the following code to your `Program.cs` file to register the `CaptchaService` and configure the BlazoredGoogleCaptcha component:
```csharp
builder.Services.AddSingleton<CaptchaService>();
```
Open the 'CounterV2.razor' page and add the following code:
```
@page "/counterv2"

@rendermode InteractiveServer

@using BlazoredGoogleCaptcha.Responses
@using BlazoredGoogleCaptcha.Services

@inject IConfiguration configuration
@inject CaptchaService captchaService

<PageTitle>Counter</PageTitle>
<h1>Counter</h1>

<p role="status">Current count: @currentCount</p>

<Captcha SiteKey="@configuration["v2SiteKey"]" OnSuccess="@OnCaptchaSuccess" OnExpired="@OnCaptchaExpired"></Captcha>
<button class="btn btn-primary" @onclick="IncrementCount" disabled="@IsButtonDisabled">Click me</button>

@code {
    private int currentCount = 0;
    private bool captchaVerified = false;
    private bool IsButtonDisabled => !captchaVerified;

    private void IncrementCount()
    {
        currentCount++;
    }
    private async void OnCaptchaSuccess(string response)
    {
        string? captchaSecret = configuration["v2SecretKey"];
        CaptchaV2Response? captchaResponse = await captchaService.VerifyV2(captchaSecret, response);
        if (captchaResponse.Success)
        {
            captchaVerified = true;
            StateHasChanged();
        }
        else
        {
            //show error message or handle failure
        }
    }
    private void OnCaptchaExpired()
    {
        captchaVerified = false;
    }
}

```
By default, V2 will be rendered.

In the example aboue, I have the counter button disbaled on the page load. 

![alt text](https://github.com/CMS365-PTY-LTD/BlazoredGoogleCaptcha/blob/main/images/step5.png?raw=true)

Once the user clicks on the reCAPTCHA checkbox and passes the verification, the button will be enabled.

![alt text](https://github.com/CMS365-PTY-LTD/BlazoredGoogleCaptcha/blob/main/images/package.gif?raw=true)

## V3 ReCaptcha

Open the 'CounterV3.razor' page and add the following code:
```
@page "/counterv3"

@using BlazoredGoogleCaptcha.Models
@using BlazoredGoogleCaptcha.Responses
@using BlazoredGoogleCaptcha.Services

@rendermode InteractiveServer

@inject IConfiguration configuration
@inject CaptchaService captchaService

<PageTitle>Counter</PageTitle>
<h1>Counter</h1>

<p role="status">Current count: @currentCount</p>

<Captcha SiteKey="@configuration["v3SiteKey"]" @ref="recaptchaV3" OnVerified="@HandleVerification" Version="CaptchaVersionEnum.V3"></Captcha>
@if (showV2)
{
    <Captcha SiteKey="@configuration["v2SiteKey"]" OnSuccess="@OnCaptchaSuccess" OnExpired="@OnCaptchaExpired"></Captcha>
}
<button class="btn btn-primary" @onclick="IncrementCount" disabled="@IsButtonDisabled">Click me</button>

@code {
    private int currentCount = 0;
    private Captcha? recaptchaV3;
    private float lastScore = 1.0f;
    private bool showV2 = false;
    private bool IsButtonDisabled = false;
    private bool captchaVerified = false;

    private async Task IncrementCount()
    {
        await recaptchaV3.ExecuteAsync("Login");
    }
    private async Task HandleVerification((string Token, string Action) result)
    {
        string token = result.Token;
        captchaVerified = false;
        string? captchaSecret = configuration["v3SecretKey"];
        try
        {
            Responses.CaptchaV3Response? captchaResponse = await captchaService.VerifyV3(captchaSecret, result.Token, null);
            if (captchaResponse.Success)
            {
                lastScore = captchaResponse.Score;
                IsButtonDisabled = false;
                captchaVerified = true;
                currentCount++;
                StateHasChanged();
            }
            if (lastScore < 0.5 || captchaVerified==false)
            {
                showV2 = true;
                IsButtonDisabled = true;
                StateHasChanged();
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
    private async void OnCaptchaSuccess(string response)
    {
        string? captchaSecret = configuration["v2SecretKey"];
        CaptchaV2Response? captchaResponse = await captchaService.VerifyV2(captchaSecret, response);
        if (captchaResponse.Success)
        {
            captchaVerified = true;
            IsButtonDisabled = false; 
            currentCount++;
            showV2 = false;
            StateHasChanged();
        }
        else
        {
            //show error message or handle failure
        }
    }
    private void OnCaptchaExpired()
    {
        captchaVerified = false;
    }
}

```

Make sure you set V3 in the `Captcha` component.

V3 is an invisible reCAPTCHA, so it will be executed when the user clicks on the button. Response will be returned to the `HandleVerification` method, where you can verify the response with your secret key.

V3 captcha will return a score, which you can use to determine if the user is a bot or not. If the score is less than 0.5, you can show V2 reCAPTCHA to the user.
