param(
    [switch]$SkipUI,
    [switch]$SkipServer,
    [switch]$CleanInstall
)

cp "$PSScriptRoot/server/.env.sample" "$PSScriptRoot/server/.env"
cp "$PSScriptRoot/ui/.env.sample" "$PSScriptRoot/ui/.env"
cp "$PSScriptRoot/server/server/config/rit-cert.pem.sample" "$PSScriptRoot/server/server/config/rit-cert.pem"
cp "$PSScriptRoot/server/server/config/seniorproject-key.pem.sample" "$PSScriptRoot/server/server/config/seniorproject-key.pem"
npm install -g prettier

if ($CleanInstall) {
    Write-Host "🧹 Cleaning up all installed packages..."
    Write-Host "This can take a while..."
    Remove-Item -Recurse -Force "$PSScriptRoot/server/node_modules" -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force "$PSScriptRoot/ui/node_modules" -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force "$PSScriptRoot/node_modules" -ErrorAction SilentlyContinue
    Remove-Item -Force "$PSScriptRoot/server/package-lock.json" -ErrorAction SilentlyContinue
    Remove-Item -Force "$PSScriptRoot/ui/package-lock.json" -ErrorAction SilentlyContinue
}   

if (-not $SkipServer) {
    Write-Host "ℹ️ Installing server packages..."
    Set-Location "$PSScriptRoot/server"
    npm install
} else {
    Write-Host "⚠️ Skipping server package installation."
}

if (-not $SkipUI) {
    Write-Host "ℹ️ Installing UI packages..."
    Set-Location "$PSScriptRoot/ui"
    npm install --legacy-peer-deps
} else {
    Write-Host "⚠️ Skipping UI package installation."
}

Set-Location "$PSScriptRoot"