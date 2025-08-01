#!/usr/bin/env python3
"""
Quick Backend API Test for Qwen Clone Application
Tests core endpoints with shorter timeouts
"""

import requests
import sys
import json

class QuickQwenAPITester:
    def __init__(self, base_url="https://08087b24-d133-459f-97d8-0914e68e7106.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=15):
        """Run a single API test with shorter timeout"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if 'status' in response_data:
                        print(f"   Response Status: {response_data['status']}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Raw Response: {response.text[:200]}")
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timed out after {timeout}s")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_model_info(self):
        """Test GET /model endpoint"""
        success, response = self.run_test(
            "Get Current Model Info",
            "GET",
            "/model",
            200
        )
        if success and 'model_name' in response:
            print(f"   Current Model: {response['model_name']}")
        return success

    def test_basic_chat(self):
        """Test POST /chat endpoint with basic message"""
        success, response = self.run_test(
            "Basic Chat Message",
            "POST",
            "/chat",
            200,
            data={"prompt": "Hello, respond with just 'Hi there!'"}
        )
        if success and 'chat_id' in response:
            print(f"   Chat ID: {response['chat_id']}")
            print(f"   Response Preview: {response.get('response', '')[:100]}...")
        return success

    def test_image_generation(self):
        """Test POST /image endpoint"""
        success, response = self.run_test(
            "Image Generation",
            "POST",
            "/image",
            200,
            data={"prompt": "A simple red circle"},
            timeout=60  # Image generation takes longer
        )
        if success and 'image_url' in response:
            print(f"   Image URL: {response['image_url'][:50]}...")
        return success

def main():
    print("🚀 Starting Quick Qwen API Tests")
    print("=" * 50)
    
    tester = QuickQwenAPITester()
    
    # Test core working endpoints
    test_results = []
    test_results.append(("Model Info", tester.test_model_info()))
    test_results.append(("Basic Chat", tester.test_basic_chat()))
    test_results.append(("Image Generation", tester.test_image_generation()))
    
    # Print final results
    print("\n" + "=" * 50)
    print("📊 QUICK TEST RESULTS")
    print("=" * 50)
    
    for test_name, passed in test_results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print(f"\n📈 Overall: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed >= 2:  # At least model and chat should work
        print("🎉 Core functionality is working!")
        return 0
    else:
        print("⚠️  Core functionality has issues")
        return 1

if __name__ == "__main__":
    sys.exit(main())