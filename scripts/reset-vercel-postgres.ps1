<#
.SYNOPSIS
  Reset a Postgres database by dropping and recreating the `public` schema,
  then running Prisma generate + migrations.

  WARNING: This is destructive and will permanently delete all data.
  You already indicated no backup is needed — this script will proceed
  only if you type YES to confirm.
>
param()

function Abort($msg) {
  Write-Host "ABORT: $msg" -ForegroundColor Red
  exit 1
}

# Get DATABASE_URL from environment or prompt
$databaseUrl = $env:DATABASE_URL
if (-not $databaseUrl) {
  $databaseUrl = Read-Host "Enter DATABASE_URL for Vercel Postgres (postgres://user:pass@host:port/db)"
}

if (-not $databaseUrl) { Abort('No DATABASE_URL provided') }

Write-Host "\nWARNING: This will irreversibly DELETE ALL DATA in the database pointed to by:" -ForegroundColor Yellow
Write-Host "  $databaseUrl\n" -ForegroundColor Yellow

$confirm = Read-Host "Type 'YES' (uppercase) to proceed"
if ($confirm -ne 'YES') { Abort('User did not confirm') }

Write-Host "Proceeding with schema reset..." -ForegroundColor Cyan

# Prefer local psql if available
if (Get-Command psql -ErrorAction SilentlyContinue) {
  Write-Host "Using local psql to drop and recreate schema..."
  & psql $databaseUrl -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
  if ($LASTEXITCODE -ne 0) { Abort('psql command failed') }
} else {
  Write-Host "psql not found. Trying docker fallback (requires docker installed)..."
  if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { Abort('Neither psql nor docker are available on this machine') }

  # Parse the connection string to individual parts for docker/psql invocation
  $m = [regex]::Match($databaseUrl, 'postgres(?:ql)?:\/\/(?<user>[^:]+):(?<pass>[^@]+)@(?<host>[^:\/]+)(?::(?<port>\d+))?\/(?<db>[^?]+)')
  if (-not $m.Success) { Abort('Failed to parse DATABASE_URL for docker fallback. Provide a standard postgres://user:pass@host:port/db URL or install psql.') }
  $u = $m.Groups['user'].Value
  $p = $m.Groups['pass'].Value
  $h = $m.Groups['host'].Value
  $port = $m.Groups['port'].Value; if (-not $port) { $port = '5432' }
  $db = $m.Groups['db'].Value

  Write-Host "Running docker postgres image to run psql against $h:$port/$db"
  & docker run --rm -e PGPASSWORD=$p postgres:15 psql -h $h -p $port -U $u -d $db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
  if ($LASTEXITCODE -ne 0) { Abort('docker psql command failed') }
}

Write-Host "Schema reset successful. Running Prisma generate and migrate deploy..." -ForegroundColor Green

if (-not (Get-Command npx -ErrorAction SilentlyContinue)) { Write-Host "npx not found: running via npm exec instead" }

try {
  & npx prisma generate
  if ($LASTEXITCODE -ne 0) { Abort('prisma generate failed') }
  & npx prisma migrate deploy
  if ($LASTEXITCODE -ne 0) { Abort('prisma migrate deploy failed') }
} catch {
  Abort("Prisma commands failed: $_")
}

Write-Host "Reset + migrations complete. Redeploy your app on Vercel and verify functionality." -ForegroundColor Green
