#!/usr/bin/env powershell
# Test HTML upload to backend

$htmlFile = "C:\Users\Lenovo\Desktop\cardano hack\new frontend\cardano-hackathon\ai_backend\My Activity.html"
$backendUrl = "http://localhost:5001/api/transactions"

# Check if file exists
if (-not (Test-Path $htmlFile)) {
    Write-Host "ERROR: HTML file not found: $htmlFile" -ForegroundColor Red
    exit 1
}

Write-Host "Reading HTML file..." -ForegroundColor Cyan
$htmlContent = Get-Content -Path $htmlFile -Raw -Encoding UTF8

Write-Host "HTML file loaded: $($htmlContent.Length) characters" -ForegroundColor Green
Write-Host "First 100 chars: $($htmlContent.Substring(0, 100))" -ForegroundColor Gray

# Create test user ID (use a test ObjectId)
$userId = "692b15b8984fb2ea8ff34454"

# Create JSON payload
$payload = @{
    userId = $userId
    type = "expense"
    amount = 0
    category = "Uncategorized"
    description = "Google Pay Import"
    date = (Get-Date).ToString("o")
    htmlFile = @{
        content = $htmlContent
        fileName = "My Activity.html"
        uploadDate = (Get-Date).ToString("o")
    }
} | ConvertTo-Json -Depth 10

Write-Host "Payload size: $($payload.Length) characters" -ForegroundColor Green
Write-Host "Sending to backend: $backendUrl" -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri $backendUrl `
        -Method POST `
        -ContentType "application/json" `
        -Body $payload `
        -TimeoutSec 60

    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
}
catch {
    Write-Host "ERROR!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $content = $reader.ReadToEnd()
        Write-Host "Response Body: $content" -ForegroundColor Yellow
    }
}
