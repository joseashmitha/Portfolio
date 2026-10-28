# Jose Ashmitha's QA Portfolio — Public Live Sharer
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$host.UI.RawUI.WindowTitle = "Jose Ashmitha's QA Portfolio — Live Link Sharer"

$scriptDir = $PSScriptRoot
Clear-Host
Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "        JOSE ASHMITHA V. — QA PORTFOLIO LIVE PUBLIC SHARER            " -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host " [1/2] Starting local portfolio server on port 8080..." -ForegroundColor Green

# Start the background server process
$serverProcess = Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$scriptDir\serve.ps1`" -Port 8080" -WindowStyle Hidden -PassThru
Start-Sleep -Milliseconds 1500

Write-Host " [2/2] Generating public live HTTPS link for third-party systems..." -ForegroundColor Green
Write-Host ""
Write-Host " =====================================================================" -ForegroundColor DarkGray
Write-Host " LOOK FOR YOUR PUBLIC LIVE LINK BELOW (e.g. https://xxxxxx.lhr.life):" -ForegroundColor Cyan
Write-Host " Anyone worldwide or any third-party system can view your portfolio!" -ForegroundColor White
Write-Host " (Keep this window open to keep the link active)" -ForegroundColor Yellow
Write-Host " =====================================================================" -ForegroundColor DarkGray
Write-Host ""

$tunnelProcess = Start-Process ssh -ArgumentList "-o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R 80:127.0.0.1:8080 nokey@localhost.run" -NoNewWindow -PassThru

try {
    $tunnelProcess.WaitForExit()
} finally {
    if ($serverProcess -and -not $serverProcess.HasExited) {
        Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
    }
}
