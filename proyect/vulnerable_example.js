


// VULNERABLE: SQL Injection
function queryUserByName(username) {
    // CWE-89: SQL Injection
    let query = `SELECT * FROM users WHERE username = '${username}'`;
    return database.execute(query);
}

// VULNERABLE: Cross-Site Scripting (XSS)
function displayUserGreeting() {
    // CWE-79: Cross-site Scripting
    let name = document.location.search.substring(1);
    document.getElementById('greeting').innerHTML = `<h1>Hello ${name}</h1>`;
}





// VULNERABLE: DOM-based XSS
function loadContentFromURL() {
    // CWE-79: DOM-based XSS
    let url = window.location.hash.substring(1);
    document.body.innerHTML = `<iframe src="${url}"></iframe>`;
}

// VULNERABLE: eval() with user input
function executeUserCode() {
    // CWE-95: Improper Neutralization of Directives in Dynamically Evaluated Code
    let userCode = document.getElementById('code-input').value;
    eval(userCode);
}

// VULNERABLE: Function letructor
function runUserExpression() {
    // CWE-95: Code Injection
    let expression = document.getElementById('expr').value;
    let fn = new Function('return ' + expression);
    return fn();
}

// VULNERABLE: Hardcoded Credentials
let API_KEYS = {
    // CWE-798: Use of Hard-Coded Credentials
    aws_access_key: 'AKIA1234567890ABCDEF',
    aws_secret_key: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY',
    db_password: 'admin123456'
};

// VULNERABLE: Insecure Direct Object Reference (IDOR)
function getUserProfile(userId) {
    // CWE-639: Authorization Bypass Through User-Controlled Key
    return fetch(`/api/users/${userId}`).then(r => r.json());
}

// VULNERABLE: CSRF (No Token Validation)
async function transferMoney(amount, account) {
    // CWE-352: Cross-Site Request Forgery
    let response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount, account: account })
    });
    return response.json();
}

// VULNERABLE: Insecure Deserialization
function parseUserData(data) {
    // CWE-502: Deserialization of Untrusted Data
    return eval('(' + data + ')');  // Can execute arbitrary code
}

// VULNERABLE: Path Traversal
function readFile(filename) {
    // CWE-22: Improper Limitation of a Pathname to a Restricted Directory
    return fetch(`/files/${filename}`).then(r => r.text());
}

// VULNERABLE: Command Injection in Node.js
let { exec } = require('child_process');
function processImage(filename) {
    // CWE-78: OS Command Injection
    exec(`convert ${filename} -resize 100x100 thumb.png`);
}

// VULNERABLE: Weak Random Number Generation
function generateSessionToken() {
    // CWE-338: Use of Cryptographically Weak Pseudo-Random Number Generator
    return Math.random().toString(36).substring(2);
}

// VULNERABLE: Regex DoS (ReDoS)
function validateEmail(email) {
    // CWE-1333: Inefficient Regular Expression Complexity
    let pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email);
}

// VULNERABLE: NoSQL Injection
async function findUser(username) {
    // CWE-943: Improper Neutralization of Special Elements in Data Query Logic
    return db.users.find({ username: username });
}

// VULNERABLE: XXE in XML Parsing (Node.js)
let xml2js = require('xml2js');
function parseXML(xmlData) {
    // CWE-611: Improper Restriction of XML External Entity Reference
    let parser = new xml2js.Parser({ strict: false });
    return parser.parseString(xmlData);
}

// SAFE: Parameterized Query
async function safeQueryUserByName(username) {
    let query = 'SELECT * FROM users WHERE username = ?';
    return database.execute(query, [username]);
}

// SAFE: Proper Input Validation and Encoding
function safeDisplayGreeting() {
    let name = new URLSearchParams(window.location.search).get('name');
    let encodedName = document.createElement('div');
    encodedName.textContent = name;
    document.getElementById('greeting').appendChild(encodedName);
}

// SAFE: Avoid eval() - Use safer alternatives
function safeEvaluateExpression(expression) {
    // Use Function letructor with restricted context or a library like Math.js
    let mathJs = require('mathjs');
    return mathJs.evaluate(expression);
}

// SAFE: Use Environment letiables for Secrets
let API_KEYS_SAFE = {
    aws_access_key: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_key: process.env.AWS_SECRET_ACCESS_KEY,
    db_password: process.env.DB_PASSWORD
};

// SAFE: Proper CSRF Protection
async function safeTransferMoney(amount, account, csrfToken) {
    let response = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ amount: amount, account: account })
    });
    return response.json();
}

// SAFE: Secure Random Generation
let crypto = require('crypto');
function safeGenerateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// SAFE: Command Injection Prevention
let { execFile } = require('child_process');
function safeProcessImage(filename) {
    execFile('convert', [filename, '-resize', '100x100', 'thumb.png']);
}

module.exports = {
    queryUserByName,
    safeQueryUserByName,
    displayUserGreeting,
    safeGenerateToken
};




