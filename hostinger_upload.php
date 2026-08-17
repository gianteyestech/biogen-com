<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Upload-Secret");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTO-UPDATE MECHANISM (Syncs code directly from GitHub if updated)
// ─────────────────────────────────────────────────────────────────────────────
if (isset($_GET['action']) && $_GET['action'] === 'sync') {
    // 1. Direct POST Push Sync (Most Secure & Works even for Private Repos)
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = file_get_contents('php://input');
        $json = json_decode($input, true);
        $pushedCode = isset($json['code']) ? $json['code'] : (isset($_POST['code']) ? $_POST['code'] : '');
        $token = isset($_SERVER['HTTP_X_UPLOAD_SECRET']) ? $_SERVER['HTTP_X_UPLOAD_SECRET'] : (isset($_GET['token']) ? $_GET['token'] : '');

        if ($token !== $SECRET_KEY) {
            http_response_code(401);
            header("Content-Type: application/json");
            echo json_encode(["error" => "Unauthorized sync request"]);
            exit();
        }

        if (!empty($pushedCode) && strpos($pushedCode, '<?php') !== false) {
            file_put_contents(__FILE__, $pushedCode);
            header("Content-Type: application/json");
            echo json_encode(["success" => true, "message" => "Hostinger upload.php updated via direct push sync!"]);
            exit();
        }
    }

    // 2. GET Pull Sync from GitHub Raw
    $rawUrl = "https://raw.githubusercontent.com/gianteyestech/idealdryfruit-com/main/hostinger_upload.php";
    $latestCode = false;
    $curlErr = "";

    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $rawUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        $latestCode = curl_exec($ch);
        if (curl_errno($ch)) {
            $curlErr = curl_error($ch);
        }
        curl_close($ch);
    } else {
        $opts = ['http' => ['header' => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n"]];
        $context = stream_context_create($opts);
        $latestCode = @file_get_contents($rawUrl, false, $context);
    }

    if ($latestCode && strpos($latestCode, '<?php') !== false) {
        file_put_contents(__FILE__, $latestCode);
        header("Content-Type: application/json");
        echo json_encode(["success" => true, "message" => "Hostinger upload.php self-updated to latest GitHub version!"]);
        exit();
    } else {
        http_response_code(500);
        header("Content-Type: application/json");
        echo json_encode([
            "error" => "GitHub Raw URL is private/inaccessible. You can push updates using POST sync or make GitHub repo public."
        ]);
        exit();
    }
}

// Secret key to verify requests from Vercel Next.js backend
$SECRET_KEY = "idealdryfruit_media_secret_2026_change_me";

// Verify secret header across different PHP/Nginx/Apache configurations
$authHeader = '';
if (isset($_SERVER['HTTP_X_UPLOAD_SECRET'])) {
    $authHeader = $_SERVER['HTTP_X_UPLOAD_SECRET'];
} else if (function_exists('apache_request_headers')) {
    $headers = apache_request_headers();
    if (isset($headers['X-Upload-Secret'])) {
        $authHeader = $headers['X-Upload-Secret'];
    } else if (isset($headers['x-upload-secret'])) {
        $authHeader = $headers['x-upload-secret'];
    }
}

if (!empty($SECRET_KEY) && $authHeader !== $SECRET_KEY) {
    http_response_code(401);
    header("Content-Type: application/json");
    echo json_encode(["error" => "Unauthorized request to media server"]);
    exit();
}

// Recursive file scanner for GET media listing
function scanMediaRecursive($dir, $baseUrl) {
    $files = [];
    if (!is_dir($dir)) return $files;
    
    $items = array_diff(scandir($dir), array('.', '..'));
    foreach ($items as $item) {
        $path = $dir . '/' . $item;
        if (is_dir($path)) {
            $files = array_merge($files, scanMediaRecursive($path, $baseUrl));
        } else if (is_file($path) && preg_match('/\.(jpg|jpeg|png|webp|avif|gif|svg)$/i', $item)) {
            $relPath = ltrim(str_replace(__DIR__, '', $path), '/\\');
            $relPathUrl = str_replace('\\', '/', $relPath);
            $files[] = [
                "filename" => $item,
                "url" => $baseUrl . '/' . $relPathUrl,
                "size" => filesize($path),
                "createdAt" => filemtime($path) * 1000
            ];
        }
    }
    return $files;
}

// Handle GET list of media files
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $uploadDir = __DIR__ . '/uploads/';
    $baseUrl = "https://media.idealdryfruit.com";
    $media = scanMediaRecursive($uploadDir, $baseUrl);

    header("Content-Type: application/json");
    echo json_encode(["success" => true, "media" => array_values($media)]);
    exit();
}

// Handle POST file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(["error" => "No file uploaded"]);
        exit();
    }

    $file = $_FILES['file'];
    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(500);
        echo json_encode(["error" => "Upload error code: " . $file['error']]);
        exit();
    }

    // Enterprise Date & Folder Partitioning: /uploads/products/2026/08/
    $year = date('Y');
    $month = date('m');
    $folderType = isset($_POST['folder']) && !empty($_POST['folder']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['folder']) : 'products';
    if (empty($folderType)) {
        $folderType = 'products';
    }
    
    $relSubPath = "uploads/{$folderType}/{$year}/{$month}/";
    $uploadDir = __DIR__ . '/' . $relSubPath;

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $customFilename = isset($_POST['filename']) ? preg_replace('/[^a-zA-Z0-9\._-]/', '', $_POST['filename']) : basename($file['name']);
    $targetPath = $uploadDir . $customFilename;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $publicUrl = "https://media.idealdryfruit.com/" . $relSubPath . $customFilename;
        header("Content-Type: application/json");
        echo json_encode([
            "success" => true,
            "url" => $publicUrl,
            "filename" => $customFilename,
            "size" => filesize($targetPath)
        ]);
        exit();
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to save file on Hostinger server"]);
        exit();
    }
}
