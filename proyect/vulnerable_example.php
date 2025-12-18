


<?php

// VULNERABLE: SQL Injection
function query_user($username) {
    // CWE-89: SQL Injection
    $sql = "SELECT * FROM users WHERE username = '" . $username . "'";
    $result = mysqli_query($conn, $sql);
    return mysqli_fetch_assoc($result);
}

// VULNERABLE: Cross-Site Scripting (XSS)
function greet_user() {
    // CWE-79: Improper Neutralization of Input During Web Page Generation
    $name = $_GET['name'];
    echo "<h1>Hello " . $name . "</h1>";
}



// VULNERABLE: Local File Inclusion (LFI)
function include_page() {
    // CWE-22: Improper Limitation of a Pathname to a Restricted Directory
    $page = $_GET['page'];
    include("pages/" . $page . ".php");
}

// VULNERABLE: Remote File Inclusion (RFI)
function load_config() {
    // CWE-98: Improper Control of Filename for Include/Require Statement
    $config_url = $_POST['config_url'];
    include($config_url);
}

// VULNERABLE: Hardcoded Credentials
function connect_database() {
    // CWE-798: Use of Hard-Coded Credentials
    $host = "localhost";
    $user = "admin";
    $password = "Password123";
    $conn = mysqli_connect($host, $user, $password, "mydb");
    return $conn;
}

// VULNERABLE: Weak Hash Function
function hash_password($password) {
    // CWE-327: Use of a Broken or Risky Cryptographic Algorithm
    return md5($password);
}

// VULNERABLE: Insecure Deserialization
function process_session_data() {
    // CWE-502: Deserialization of Untrusted Data
    if (isset($_COOKIE['session_data'])) {
        $data = unserialize($_COOKIE['session_data']);
    }
}

// VULNERABLE: File Upload without Validation
function upload_file() {
    // CWE-434: Unrestricted Upload of File with Dangerous Type
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($_FILES["file"]["name"]);
    move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);
}

// VULNERABLE: CSRF (No token validation)
function transfer_money($amount, $account) {
    // CWE-352: Cross-Site Request Forgery (CSRF)
    $user_id = $_SESSION['user_id'];
    $sql = "INSERT INTO transfers (user_id, amount, account) VALUES ($user_id, $amount, '$account')";
    mysqli_query($conn, $sql);
}

// VULNERABLE: eval() with user input
function execute_code() {
    // CWE-95: Improper Neutralization of Directives in Dynamically Evaluated Code
    $code = $_POST['code'];
    eval($code);
}

// VULNERABLE: Path Traversal
function read_file() {
    // CWE-22: Path Traversal
    $file = $_GET['file'];
    $content = file_get_contents("files/" . $file);
    echo $content;
}

// VULNERABLE: XXE (XML External Entity)
function parse_xml() {
    // CWE-611: Improper Restriction of XML External Entity Reference
    libxml_disable_entity_loader(false);
    $dom = new DOMDocument();
    $dom->load($_FILES['xml']['tmp_name']);
    return $dom;
}

// VULNERABLE: Weak Random Number Generation
function generate_token() {
    // CWE-338: Use of Cryptographically Weak Pseudo-Random Number Generator
    return md5(rand());
}

// VULNERABLE: LDAP Injection
function authenticate_user($username, $password) {
    // CWE-90: Improper Neutralization of Special Elements used in an LDAP Query
    $dn = "uid=" . $username . ",dc=example,dc=com";
    $ldap_conn = ldap_connect("localhost");
    ldap_bind($ldap_conn, $dn, $password);
}

// SAFE: Parameterized Query (Prepared Statement)
function safe_query_user($username, $conn) {
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    return $stmt->get_result();
}

// SAFE: Proper Input Validation
function safe_greet_user() {
    $name = htmlspecialchars($_GET['name'], ENT_QUOTES, 'UTF-8');
    echo "<h1>Hello " . $name . "</h1>";
}

// SAFE: Input Validation for Command Execution
function safe_process_image($filename) {
    if (!preg_match('/^[a-zA-Z0-9._-]+$/', $filename)) {
        throw new Exception("Invalid filename");
    }
    $cmd = "convert " . escapeshellarg($filename) . " -thumbnail 100x100 thumb.png";
    exec($cmd);
}

// SAFE: Secure Hash Function
function safe_hash_password($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

// SAFE: File Upload with Validation
function safe_upload_file() {
    $allowed = ['jpg', 'jpeg', 'png', 'gif'];
    $filename = basename($_FILES["file"]["name"]);
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    
    if (!in_array($ext, $allowed)) {
        throw new Exception("Invalid file type");
    }
    
    $target_dir = "uploads/";
    $target_file = $target_dir . uniqid() . "." . $ext;
    move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);
}

?>


