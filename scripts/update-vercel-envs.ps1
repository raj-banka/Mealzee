<#
Update Vercel environment variables using the Vercel CLI.

Prerequisites:
- `vercel` CLI installed and logged in (`npm i -g vercel` and `vercel login`).

This script prompts for new values and then sets them for the Production scope.
>
param()

if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  Write-Host "vercel CLI not found. Install with: npm i -g vercel" -ForegroundColor Red
  exit 1
}

function promptAndSet($key) {
  $val = Read-Host "Enter value for $key (leave blank to skip)"
  if ($val -and $val.Trim() -ne '') {
    Write-Host "Setting $key for Production..."
    & vercel env add $key production <<< $val
    if ($LASTEXITCODE -ne 0) { Write-Host "Failed to set $key" -ForegroundColor Red }
  } else {
    Write-Host "Skipping $key"
  }
}

Write-Host "This will add/update the following Production environment variables on Vercel:"
Write-Host "  mealzee_POSTGRES_URL, mealzee_PRISMA_DATABASE_URL, DATABASE_URL, MESSAGECENTRAL_CLIENT_ID, MESSAGECENTRAL_TOKEN"

promptAndSet 'mealzee_POSTGRES_URL'
promptAndSet 'mealzee_PRISMA_DATABASE_URL'
promptAndSet 'DATABASE_URL'
promptAndSet 'MESSAGECENTRAL_CLIENT_ID'
promptAndSet 'MESSAGECENTRAL_TOKEN'

Write-Host "Done. Remember to redeploy your Vercel project to pick up new env vars." -ForegroundColor Green
