# API Test Script for CMS Backend
$BaseURL = "http://localhost:5000"
$Results = @()

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Description,
        [object]$Body = $null,
        [hashtable]$Headers = @{"Content-Type" = "application/json"}
    )
    
    $FullURL = "$BaseURL$Endpoint"
    $TestResult = @{
        Endpoint = $Endpoint
        Method = $Method
        Description = $Description
        Status = "Pending"
        StatusCode = $null
        Response = $null
        Error = $null
    }
    
    try {
        Write-Host "Testing: $Method $Endpoint - $Description" -ForegroundColor Cyan
        
        $Params = @{
            Uri = $FullURL
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $Params["Body"] = ($Body | ConvertTo-Json)
        }
        
        $Response = Invoke-WebRequest @Params
        $TestResult.Status = "SUCCESS"
        $TestResult.StatusCode = $Response.StatusCode
        $TestResult.Response = $Response.Content | ConvertFrom-Json
        
        Write-Host "✓ Success (HTTP $($Response.StatusCode))" -ForegroundColor Green
    }
    catch {
        $TestResult.Status = "FAILED"
        $TestResult.Error = $_.Exception.Message
        
        if ($_.Exception.Response) {
            $TestResult.StatusCode = $_.Exception.Response.StatusCode
            try {
                $TestResult.Response = $_.Exception.Response.Content | ConvertFrom-Json
            } catch {
                $TestResult.Response = $_.Exception.Response.Content
            }
        }
        
        Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    $Results += $TestResult
    Write-Host ""
    
    return $TestResult
}

Write-Host "===================================================" -ForegroundColor Yellow
Write-Host "CMS Backend API Test Suite" -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health Check
Write-Host "1. HEALTH CHECK" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/health" -Description "Check if API is running"

# Test 2: Login (Create Test Admin First)
Write-Host "2. ADMIN AUTHENTICATION" -ForegroundColor Magenta
$LoginResult = Test-Endpoint -Method "POST" -Endpoint "/api/admin/login" `
    -Description "Admin login with credentials" `
    -Body @{
        email = "admin@example.com"
        password = "password123"
    }

# Extract token from login response (if successful)
$AuthToken = $null
if ($LoginResult.StatusCode -eq 200 -and $LoginResult.Response.data.token) {
    $AuthToken = $LoginResult.Response.data.token
    Write-Host "✓ Auth Token obtained: $($AuthToken.Substring(0, 20))..." -ForegroundColor Green
} else {
    Write-Host "⚠ No auth token obtained - protected endpoints will fail" -ForegroundColor Yellow
}

# Create headers with auth token if available
$AuthHeaders = @{"Content-Type" = "application/json"}
if ($AuthToken) {
    $AuthHeaders["Authorization"] = "Bearer $AuthToken"
}

# Test 3: Content Endpoints
Write-Host "3. CONTENT ENDPOINTS" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/content" -Description "Get all content items" -Headers $AuthHeaders
Test-Endpoint -Method "POST" -Endpoint "/api/content" `
    -Description "Create new content (blog)" `
    -Body @{
        title = "Test Blog Post"
        slug = "test-blog-post"
        type = "blog"
        content = "This is a test blog post content"
        author = "Test Author"
    } `
    -Headers $AuthHeaders

# Test 4: Page Endpoints
Write-Host "4. PAGE ENDPOINTS" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/pages" -Description "Get all pages" -Headers $AuthHeaders
Test-Endpoint -Method "POST" -Endpoint "/api/pages" `
    -Description "Create new page" `
    -Body @{
        title = "Test Page"
        slug = "test-page"
        content = "This is a test page"
    } `
    -Headers $AuthHeaders

# Test 5: Admin Endpoints (Protected)
Write-Host "5. ADMIN CRUD ENDPOINTS" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/admins" -Description "Get all admins (requires auth)" -Headers $AuthHeaders
Test-Endpoint -Method "POST" -Endpoint "/api/admins" `
    -Description "Create new admin (requires super_admin)" `
    -Body @{
        name = "New Admin"
        email = "newadmin@example.com"
        password = "securepass123"
        role = "admin"
    } `
    -Headers $AuthHeaders

# Test 6: Admin Profile
Write-Host "6. ADMIN PROFILE ENDPOINTS" -ForegroundColor Magenta
Test-Endpoint -Method "GET" -Endpoint "/api/admin/profile" -Description "Get current admin profile" -Headers $AuthHeaders
Test-Endpoint -Method "PUT" -Endpoint "/api/admin/profile" `
    -Description "Update admin profile" `
    -Body @{
        name = "Updated Admin Name"
    } `
    -Headers $AuthHeaders

# Test 7: Guide Content Type
Write-Host "7. GUIDE CONTENT TYPE" -ForegroundColor Magenta
Test-Endpoint -Method "POST" -Endpoint "/api/content" `
    -Description "Create guide content with guideLink" `
    -Body @{
        title = "Complete Node.js Guide"
        slug = "nodejs-guide"
        type = "guide"
        content = "A comprehensive guide to Node.js"
        guideLink = "https://nodejs.org/docs"
        author = "Tech Writer"
    } `
    -Headers $AuthHeaders

# Summary Report
Write-Host "===================================================" -ForegroundColor Yellow
Write-Host "TEST SUMMARY" -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Yellow

$Successful = $Results | Where-Object { $_.Status -eq "SUCCESS" } | Measure-Object | Select-Object -ExpandProperty Count
$Failed = $Results | Where-Object { $_.Status -eq "FAILED" } | Measure-Object | Select-Object -ExpandProperty Count
$Total = $Results.Count

Write-Host "Total Tests: $Total" -ForegroundColor Cyan
Write-Host "Successful: $Successful" -ForegroundColor Green
Write-Host "Failed: $Failed" -ForegroundColor Red
Write-Host ""

Write-Host "Detailed Results:" -ForegroundColor Cyan
$Results | ForEach-Object {
    $StatusColor = if ($_.Status -eq "SUCCESS") { "Green" } else { "Red" }
    Write-Host "$($_.Method) $($_.Endpoint) - $($_.Status) (HTTP $($_.StatusCode))" -ForegroundColor $StatusColor
}

Write-Host ""
Write-Host "===================================================" -ForegroundColor Yellow
Write-Host "Test completed at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Yellow
