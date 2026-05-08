#!/bin/bash

# =================================================================================
# SMOKE TEST SCRIPT - HOTEL-BALL
# =================================================================================
# Description: Automated smoke test for Hotel Management System API.
# Saves results to Test-Smoke directory.
# =================================================================================

# --- CONFIGURATION ---
BASE_URL="http://localhost:8080"
LOG_DIR="Test-Smoke"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="$LOG_DIR/smoke_test_$TIMESTAMP.log"

COLOR_RESET="\033[0m"
COLOR_SUCCESS="\033[0;32m"
COLOR_FAILURE="\033[0;31m"
COLOR_INFO="\033[0;34m"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Redirect output to both console and log file
# Using a subshell to ensure all output is captured
exec > >(tee -a "$LOG_FILE") 2>&1

# --- HELPER FUNCTIONS ---

function check_endpoint() {
    local name=$1
    local url=$2
    local expected=$3
    local auth_token=$4
    
    echo -e "${COLOR_INFO}Testing $name ($url)...${COLOR_RESET}" >&2
    
    local status
    if [ -n "$auth_token" ]; then
        status=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $auth_token" "$BASE_URL$url")
    else
        status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url")
    fi
    
    if [ "$status" -eq "$expected" ]; then
        echo -e "${COLOR_SUCCESS}SUCCESS: $url returned $status${COLOR_RESET}" >&2
        return 0
    else
        echo -e "${COLOR_FAILURE}FAILURE: $url returned $status (Expected $expected)${COLOR_RESET}" >&2
        return 1
    fi
}

function login_and_get_token() {
    local email=$1
    local password=$2
    
    echo -e "${COLOR_INFO}Logging in user: $email...${COLOR_RESET}" >&2
    local login_payload="{\"email\":\"$email\", \"password\":\"$password\"}"
    
    local response=$(curl -s -X POST -H "Content-Type: application/json" -d "$login_payload" "$BASE_URL/login")
    
    if [[ $response == ey* ]]; then
        echo -e "${COLOR_SUCCESS}SUCCESS: Token received.${COLOR_RESET}" >&2
        echo "$response"
        return 0
    else
        echo -e "${COLOR_FAILURE}FAILURE: Could not retrieve token.${COLOR_RESET}" >&2
        echo "Response: $response" >&2
        return 1
    fi
}

function register_user() {
    local name=$1
    local email=$2
    local password=$3
    
    echo -e "${COLOR_INFO}Registering user: $email...${COLOR_RESET}" >&2
    local register_payload="{\"name\":\"$name\", \"email\":\"$email\", \"password\":\"$password\"}"
    
    local status=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$register_payload" "$BASE_URL/register")
    
    if [ "$status" -eq 200 ] || [ "$status" -eq 201 ]; then
        echo -e "${COLOR_SUCCESS}SUCCESS: User registered.${COLOR_RESET}" >&2
        return 0
    else
        echo -e "${COLOR_FAILURE}WARNING: Registration returned status $status${COLOR_RESET}" >&2
        return 0 
    fi
}

# --- EXECUTION FLOW ---

echo "===================================================="
echo "STARTING SMOKE TEST SUITE"
echo "Target: $BASE_URL"
echo "Log File: $LOG_FILE"
echo "===================================================="

# 1. Register a test user
# We use a timestamped email to ensure a fresh registration if needed, 
# or just a standard one for repeat tests.
TEST_EMAIL="smoke_test@example.com"
TEST_PASS="password123"
register_user "Smoke Test User" "$TEST_EMAIL" "$TEST_PASS"

# 2. Login to get token
TOKEN=$(login_and_get_token "$TEST_EMAIL" "$TEST_PASS")

# 3. Test Endpoints
if [ -n "$TOKEN" ]; then
    # Test authenticated user access
    check_endpoint "User Access Test" "/api/test/user" 200 "$TOKEN"
    
    # Test admin access (should fail with 403 for regular user)
    check_endpoint "Admin Access Test (Unauthorized)" "/api/test/admin" 403 "$TOKEN"
else
    echo -e "${COLOR_FAILURE}ERROR: Skipping protected endpoints because token was not retrieved.${COLOR_RESET}"
fi

# 4. Public Endpoint Check (Testing login endpoint without payload)
check_endpoint "Login Endpoint (Bad Request)" "/login" 400

echo -e "\n===================================================="
echo "SMOKE TEST COMPLETED"
echo "Results logged to: $LOG_FILE"
echo "===================================================="
