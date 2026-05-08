#!/bin/bash
# qa-scripts/test_backend.sh
# Verifies all backend endpoints return correct DTO shapes before frontend integration

BASE="http://localhost:8080"
PASS=0
FAIL=0
LOG="BACKEND_QA.log"

echo "=============================" > $LOG
echo "Backend QA: $(date)" >> $LOG
echo "=============================" >> $LOG

check() {
  local label=$1
  local status=$2
  if [ "$status" -eq 200 ] || [ "$status" -eq 201 ]; then
    echo "✅ PASS [$label] HTTP $status" >> $LOG
    PASS=$((PASS+1))
  else
    echo "❌ FAIL [$label] HTTP $status" >> $LOG
    FAIL=$((FAIL+1))
  fi
}

# ─── AUTH ─────────────────────────────────────────────────────────────────────

echo "" >> $LOG
echo "Testing Authentication..." >> $LOG

REGISTER=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"QA User","email":"qa@test.com","password":"Test@123"}')
check "POST /api/auth/register" $REGISTER

LOGIN_RESP=$(curl -s -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"qa@test.com","password":"Test@123"}')

TOKEN=$(echo $LOGIN_RESP | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
USER_ID=$(echo $LOGIN_RESP | grep -o '"userId":[0-9]*' | cut -d':' -f2)

if [ -n "$TOKEN" ] && [ -n "$USER_ID" ]; then
  echo "✅ JWT token received: ${TOKEN:0:20}..." >> $LOG
  echo "✅ userId extracted: $USER_ID" >> $LOG
  check "POST /api/auth/login (token + userId)" 200
else
  echo "❌ Missing token or userId in login response" >> $LOG
  check "POST /api/auth/login (token + userId)" 401
fi

# ─── HOTELS (PUBLIC) ──────────────────────────────────────────────────────────

echo "" >> $LOG
echo "Testing Hotels (Public)..." >> $LOG

HOTELS_RESP=$(curl -s "$BASE/api/hotels")
HOTELS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/hotels")
check "GET /api/hotels" $HOTELS_STATUS

# Verify DTO shape
if echo "$HOTELS_RESP" | grep -q '"imageUrl"'; then
  echo "✅ HotelSummaryDTO has 'imageUrl' field" >> $LOG
else
  echo "❌ Missing 'imageUrl' field in HotelSummaryDTO" >> $LOG
  FAIL=$((FAIL+1))
fi

if echo "$HOTELS_RESP" | grep -q '"startingPrice"'; then
  echo "✅ HotelSummaryDTO has 'startingPrice' field" >> $LOG
else
  echo "❌ Missing 'startingPrice' field in HotelSummaryDTO" >> $LOG
  FAIL=$((FAIL+1))
fi

# Get first hotel ID for detail test
HOTEL_ID=$(echo "$HOTELS_RESP" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -n "$HOTEL_ID" ]; then
  HOTEL_DETAIL=$(curl -s "$BASE/api/hotels/$HOTEL_ID")
  HOTEL_DETAIL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/hotels/$HOTEL_ID")
  check "GET /api/hotels/$HOTEL_ID" $HOTEL_DETAIL_STATUS
  
  # Verify rooms array exists
  if echo "$HOTEL_DETAIL" | grep -q '"rooms"'; then
    echo "✅ HotelDetailDTO has 'rooms' array" >> $LOG
  else
    echo "⚠️  HotelDetailDTO missing 'rooms' array (will crash frontend)" >> $LOG
    FAIL=$((FAIL+1))
  fi
fi

# ─── BOOKINGS ─────────────────────────────────────────────────────────────────

if [ -n "$TOKEN" ] && [ -n "$USER_ID" ]; then
  echo "" >> $LOG
  echo "Testing Bookings..." >> $LOG
  
  BOOKINGS=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $TOKEN" \
    "$BASE/api/bookings/user/$USER_ID")
  check "GET /api/bookings/user/$USER_ID" $BOOKINGS
fi

# ─── SUMMARY ──────────────────────────────────────────────────────────────────

echo "" >> $LOG
echo "=============================" >> $LOG
echo "TOTAL: ✅ PASS=$PASS  ❌ FAIL=$FAIL" >> $LOG
echo "=============================" >> $LOG

cat $LOG

if [ $FAIL -eq 0 ]; then
  echo ""
  echo "🎉 All tests passed! Backend is ready for integration."
  echo "👉 Set USE_MOCKS = false in apiService.js"
  exit 0
else
  echo ""
  echo "⚠️  $FAIL test(s) failed. Fix backend issues before going live."
  echo "👉 Keep USE_MOCKS = true for demo"
  exit 1
fi
