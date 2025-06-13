# BlazoredGoogleCaptcha: A .NET wrapper library for eBay REST API.

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
```@page "/counterv2"

@inject CaptchaService captchaService

<PageTitle>Counter</PageTitle>
<h1>Counter</h1>

<p role="status">Current count: @currentCount</p>

<BlazoredGoogleCaptcha.BlazoredGoogleCaptcha 
    SiteKey="YOUR_SITE_KEY" OnSuccess="@OnCaptchaSuccess" OnExpired="@OnCaptchaExpired">
</BlazoredGoogleCaptcha.BlazoredGoogleCaptcha>
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
        string? captchaSecret = "YOUR_SECRET";
        CaptchaV2Response? captchaResponse= await captchaService.VerifyV2(captchaSecret, response);
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