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
Install the package and create 2 seperate pages for V2 and V3 reCAPTCHA.

In the demo project, I have created 2 pages : 'CounterV2.razor' and 'CounterV3.razor'.

