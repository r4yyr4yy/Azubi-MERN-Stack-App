#!/bin/bash
echo "--- Verifying Containerized Application ---"
echo "Waiting 10 seconds for services to fully start..."
sleep 10

# 1. Test if the Frontend is online
echo -n "1. Testing Frontend... "
if curl -s --head http://localhost:80 | grep "200 OK" > /dev/null; then
  echo "✅ SUCCESS: Frontend is accessible."
else
  echo "❌ FAILURE: Frontend is not accessible on port 80."
  exit 1
fi

# 2. Test if the Backend is responding with data through the Frontend's proxy
echo -n "2. Testing Backend via Reverse Proxy (/api/gettodos)... "
if curl -s http://localhost/api/gettodos | grep '"todoList"' > /dev/null; then
  echo "✅ SUCCESS: Backend responded with data."
else
  echo "❌ FAILURE: Could not get a valid response from the backend."
  echo "   Check backend logs with 'docker-compose logs backend'"
  exit 1
fi

echo ""
echo "🎉 All checks passed! The application is running correctly."
exit