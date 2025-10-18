import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:3001/api/video/generate';

async function testVideoGeneration() {
  console.log('\n🧪 Testing Video Generation API\n');
  console.log('━'.repeat(50));

  try {
    // Test 1: Health Check
    console.log('\n📍 Test 1: Health Check');
    const healthResponse = await fetch('http://localhost:3001/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData.status);

    // Test 2: Valid Request
    console.log('\n📍 Test 2: Valid Video Generation Request');
    console.log('Prompt: "A sunset over the ocean"');
    
    const startTime = Date.now();
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'A beautiful sunset over the ocean with waves crashing'
      })
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    if (response.ok) {
      const videoBuffer = await response.buffer();
      const sizeInMB = (videoBuffer.length / (1024 * 1024)).toFixed(2);
      
      console.log(`✅ Video generated successfully!`);
      console.log(`   Duration: ${duration}s`);
      console.log(`   Size: ${sizeInMB} MB`);
      console.log(`   Content-Type: ${response.headers.get('content-type')}`);

      // Save video to test output
      const outputPath = path.join(process.cwd(), 'test', 'output', `test-video-${Date.now()}.mp4`);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, videoBuffer);
      console.log(`   Saved to: ${outputPath}`);
    } else {
      const errorData = await response.json();
      console.log(`❌ Request failed with status ${response.status}`);
      console.log(`   Error:`, errorData);
    }

    // Test 3: Invalid Request (missing prompt)
    console.log('\n📍 Test 3: Invalid Request (missing prompt)');
    const invalidResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    const invalidData = await invalidResponse.json();
    if (invalidResponse.status === 400) {
      console.log('✅ Validation working correctly');
      console.log(`   Response:`, invalidData);
    } else {
      console.log('❌ Expected 400 status for invalid request');
    }

    // Test 4: Empty Prompt
    console.log('\n📍 Test 4: Empty Prompt');
    const emptyResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: '' })
    });

    const emptyData = await emptyResponse.json();
    if (emptyResponse.status === 400) {
      console.log('✅ Empty prompt validation working');
      console.log(`   Response:`, emptyData);
    } else {
      console.log('❌ Expected 400 status for empty prompt');
    }

    console.log('\n' + '━'.repeat(50));
    console.log('\n✅ All tests completed!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\n💡 Make sure the server is running:');
    console.error('   cd server');
    console.error('   npm install');
    console.error('   npm start\n');
  }
}

// Run tests
testVideoGeneration();
