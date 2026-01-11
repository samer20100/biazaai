@echo off
echo Starting Biazaai Preview Server...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Using Python HTTP server...
    cd /d "%~dp0"
    python serve.py
    goto :end
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Using Node.js HTTP server...
    cd /d "%~dp0"
    npx serve client/public -p 8000
    goto :end
)

REM Use PowerShell built-in web server
echo Using PowerShell HTTP server...
echo Opening browser to http://localhost:8000...
echo.

cd /d "%~dp0"
start "" "http://localhost:8000"

powershell -Command "& {
    $path = '%~dp0client\public'
    $url = 'http://localhost:8000/'
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($url)
    $listener.Start()
    Write-Host '🚀 Serving Biazaai at' $url -ForegroundColor Green
    Write-Host '📁 Directory:' $path -ForegroundColor Cyan
    Write-Host '🛑 Press Ctrl+C to stop' -ForegroundColor Yellow
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $filePath = Join-Path $path ($request.Url.LocalPath.TrimStart('/'))
        if ($filePath -eq $path) { $filePath = Join-Path $path 'index.html' }
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes('404 - File not found')
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }
        
        $response.Close()
    }
}"

:end
pause