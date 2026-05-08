# QA Scripts

This folder contains automated testing scripts for backend verification before frontend integration.

## 📁 Files

- `test_backend.sh` - Comprehensive backend endpoint verification script

## 🚀 Usage

### Prerequisites

1. Backend must be running on `http://localhost:8080`
2. Bash shell (Git Bash on Windows, native on Mac/Linux)
3. `curl` command available

### Running the Script

```bash
# Make script executable (first time only)
chmod +x test_backend.sh

# Run the script
./test_backend.sh
```

### Expected Output

```
=============================
Backend QA: Fri May 8 14:55:00 2026
=============================

Testing Authentication...
✅ PASS [POST /api/auth/register] HTTP 201
✅ JWT token received: eyJhbGciOiJIUzI1NiIs...
✅ userId extracted: 1
✅ PASS [POST /api/auth/login (token + userId)] HTTP 200

Testing Hotels (Public)...
✅ PASS [GET /api/hotels] HTTP 200
✅ HotelSummaryDTO has 'imageUrl' field
✅ HotelSummaryDTO has 'startingPrice' field
✅ PASS [GET /api/hotels/1] HTTP 200
✅ HotelDetailDTO has 'rooms' array

Testing Bookings...
✅ PASS [GET /api/bookings/user/1] HTTP 200

=============================
TOTAL: ✅ PASS=6  ❌ FAIL=0
=============================

🎉 All tests passed! Backend is ready for integration.
👉 Set USE_MOCKS = false in apiService.js
```

## 🔍 What It Tests

### 1. Authentication
- ✅ User registration endpoint
- ✅ User login endpoint
- ✅ JWT token generation
- ✅ `userId` included in JWT payload

### 2. Hotels (Public Endpoints)
- ✅ Get all hotels endpoint
- ✅ Get hotel by ID endpoint
- ✅ DTO field names (`imageUrl`, `startingPrice`)
- ✅ `rooms` array exists in hotel details

### 3. Bookings (Protected Endpoints)
- ✅ Get user bookings endpoint
- ✅ JWT authentication works

## 📊 Exit Codes

- `0` - All tests passed (FAIL=0)
- `1` - One or more tests failed (FAIL>0)

## 📝 Output Files

The script generates a log file:
- `BACKEND_QA.log` - Detailed test results

## ⚠️ Troubleshooting

### "Connection refused"
**Problem:** Backend is not running

**Solution:**
```bash
cd Backend/Backend-Template
./mvnw spring-boot:run
```

### "FAIL [POST /api/auth/register] HTTP 409"
**Problem:** Test user already exists in database

**Solution:** This is normal on subsequent runs. The script will still test login.

### "Missing 'imageUrl' field"
**Problem:** Backend DTO doesn't include `imageUrl` field

**Solution:** Check `HotelSummaryDTO.java` has `imageUrl` field (not `image`)

### "Missing 'userId' in login response"
**Problem:** JWT doesn't include `userId` claim

**Solution:** Check `JWTService.java` includes:
```java
claims.put("userId", userId);
```

## 🎯 When to Run

Run this script:
- ✅ Before switching `USE_MOCKS = false` in frontend
- ✅ After making backend changes
- ✅ Before demo to judges
- ✅ After deploying to production

## 🔄 Integration Workflow

```
1. Start Backend
   ↓
2. Run test_backend.sh
   ↓
3. Check: FAIL=0?
   ↓
   YES → Set USE_MOCKS = false
   NO  → Keep USE_MOCKS = true
   ↓
4. Test frontend
   ↓
5. Demo!
```

## 📚 Related Documentation

- `../INTEGRATION_VERIFICATION_REPORT.md` - Detailed integration analysis
- `../QUICK_INTEGRATION_GUIDE.md` - 5-minute go-live checklist
- `../INTEGRATION_SUMMARY.md` - Executive summary

## 🛠️ Customization

To test additional endpoints, add to the script:

```bash
# Example: Test hotel creation
CREATE_HOTEL=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -X POST "$BASE/api/hotels" \
  -d '{"name":"Test Hotel","location":"Test City"}')
check "POST /api/hotels" $CREATE_HOTEL
```

## 🔐 Security Note

This script creates a test user (`qa@test.com`) in your database. This is safe for development but should be cleaned up in production.

---

**Questions?** Check the main integration documentation in the project root.
