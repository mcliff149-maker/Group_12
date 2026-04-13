#!/usr/bin/env bash
# Backend2 – curl smoke-test examples
# Usage: bash scripts/curl_examples.sh
# Requires: curl, jq (optional but recommended)

BASE="http://localhost:8000"

echo "=== Health Check ==="
curl -s "$BASE/health" | python3 -m json.tool

echo ""
echo "=== Register a new user ==="
curl -s -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","full_name":"Alice Smith","password":"secret123"}' \
  | python3 -m json.tool

echo ""
echo "=== Login and capture tokens ==="
TOKENS=$(curl -s -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}')
echo "$TOKENS" | python3 -m json.tool

ACCESS_TOKEN=$(echo "$TOKENS" | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
REFRESH_TOKEN=$(echo "$TOKENS" | python3 -c "import sys,json; print(json.load(sys.stdin)['refresh_token'])")

echo ""
echo "=== Get current user (/api/auth/me) ==="
curl -s "$BASE/api/auth/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  | python3 -m json.tool

echo ""
echo "=== Create a course ==="
COURSE=$(curl -s -X POST "$BASE/api/courses/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"title":"Python Fundamentals","description":"Learn Python from scratch"}')
echo "$COURSE" | python3 -m json.tool
COURSE_ID=$(echo "$COURSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo ""
echo "=== Create a lesson inside the course ==="
curl -s -X POST "$BASE/api/lessons/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d "{\"title\":\"Variables & Types\",\"content\":\"Everything about Python types.\",\"order\":1,\"course_id\":$COURSE_ID}" \
  | python3 -m json.tool

echo ""
echo "=== List courses ==="
curl -s "$BASE/api/courses/" | python3 -m json.tool

echo ""
echo "=== Get course with lessons ==="
curl -s "$BASE/api/courses/$COURSE_ID" | python3 -m json.tool

echo ""
echo "=== Refresh tokens ==="
curl -s -X POST "$BASE/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"refresh_token\":\"$REFRESH_TOKEN\"}" \
  | python3 -m json.tool

echo ""
echo "=== OpenAPI docs available at: $BASE/docs ==="
