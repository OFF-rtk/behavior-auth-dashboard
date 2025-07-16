'use client';

import Image from 'next/image';
import Link from 'next/link';
import ZoomableImage from '@/app/ui/ZoomableImage';

export default function TesterManualPage() {
  return (
    <main className="prose prose-lg prose-slate mx-auto max-w-4xl py-6 px-10">
      <h1>BlackH's Behavior-Baased Auth Model - Tester's Manual</h1>

      <p>
       Welcome to the official testing manual for <strong>BlackH's Behavior-Based Authentication Model</strong>. This guide will walk you through how to interact with the API dashboard to evaluate risk detection and behavioral anomalies.
      </p>

      <blockquote>
        This dashboard is strictly for hackathon judges. No login is required for now. After the event, access will be restricted.
      </blockquote>

      <h2>🔗 Quick Links</h2>
      <ul>
        <li><Link href="/users">Users Page</Link> — View all test users</li>
        <li><Link href="/ApiTestPanel">API Testing Panel</Link> — Interact with device profiles, session data, and predictions</li>
        <li><Link href="/api-docs.pdf" target="_blank"> API Docs (PDF)</Link> — Full API schema and endpoint descriptions</li>
      </ul>

      <h2>🧪 Testing Flow Overview</h2>
      
        
      <h3><strong>1. Health Check ✅</strong></h3>
      <p>Go to the <strong>API Testing Panel</strong> and click <code>Check Status</code>. This confirms if the backend is live.</p>  
      <ZoomableImage src="/manual/API-health-check.png" alt="API Health Check" width={800} height={400} />
      
      <hr></hr>
      
      <h3><strong>2. Select a Test User 👤</strong></h3>
      <p>Navigate to the dropdown in the API Test Panel. Choose a user between <code>s001_test</code> and <code>s010_test</code>. Each test user has preloaded:</p>  
      <ul>
        <li>A unique device profile</li>
        <li>Normal user behavior</li>
        <li>Attack patterns</li>
        <li>Bot Behavior</li>
      </ul>
      <blockquote>The selection interface looks like this:</blockquote>
      <ZoomableImage src="/manual/send-device-profile.png" alt="Send Device Profile" width={800} height={400} />
      
      <hr></hr>
      
      <h3><strong>3. Send Device Profile 📲</strong></h3>
      <p>Click <code>Store Device Profile</code> to send the device data to the backend. This is a <strong>required first step</strong>.</p>  
      <ZoomableImage src="/manual/send-device-profile.png" alt="Send Device Profile" width={800} height={400} />
      
      <hr></hr>
      
      <h3><strong>4. Submit Sessional Data 📦</strong></h3>
      <p>Click <code>Submit Session Data</code>. This will store a complete session (10+ snapshots) for the selected user.</p>  
      <blockquote>
        This is necessary to simulate a real user session and to train/update their model.
      </blockquote>
      <ZoomableImage src="/manual/submit-sesssional-data.png" alt="Submit Session" width={800} height={400} />
        
      <hr></hr>

      <h3><strong>5. Predict Risk Across Modes 🧠</strong></h3>
      <p>Use the dropdown to switch between:</p>
      <ul>
        <li>
          <code>Normal User</code>
          <ZoomableImage src="/manual/prediction-normal-user.png" alt="Prediction Normal User" width={800} height={400} />
        </li>
        <li>
          <code>Attacker</code>
          <ZoomableImage src="/manual/prediction-attacker.png" alt="Prediction Attacker" width={800} height={400} />
        </li>
        <li>
          <code>Bot</code>
          <ZoomableImage src="/manual/prediction-bot.png" alt="Prediction Bot" width={800} height={400} />
        </li>  
      </ul>  
      <p>Click <code>Load Snapshot</code> to autofill, then <code>Submit Snapshot</code>.</p>
      <blockquote>
        You'll get <strong>Risk Score</strong> and anomaly breakdown:
      </blockquote>
      <ul>
        <li>Total Risk Score (0-100)</li>
        <li>Geo Shift Score</li>
        <li>Network Shift Score</li>
        <li>Device Mismatch Score</li>
      </ul>
      <h3>📊 Risk Thresholds</h3>
      <ul>
        <li><strong>0–19.9</strong>: ✅ Safe</li>
        <li><strong>20–39.9</strong>: ⚠️ Minor deviations</li>
        <li><strong>40–59.9</strong>: 🟠 Medium drift</li>
        <li><strong>60–79.9</strong>: 🔴 Strong anomaly</li>
        <li><strong>80–100</strong>: 🚨 Critical threat</li>
      </ul>
      <blockquote>
        Any of Geo/Network/Device Score = 100 means a <strong>hard anomaly</strong>, regardless of overall risk.
      </blockquote>
      
      <hr></hr>

      <h3><strong>6. Explore via Users Page 📊</strong></h3>
      <p>Click on any user in the <Link href="/users">Users Page</Link> to view:</p>
      <ul>
        <li>User Id</li>
        <li>Model details (trained or not, version)</li>
        <li>When the model was last trained</li>
        <li>Latest Predicted Risk</li>  
      </ul>  
      <ZoomableImage src="/manual/users-page-front.png" alt="Users Page" width={800} height={400} />

      <hr></hr>

      <h2>🧪 Want to test your own snapshot?</h2>
      <p>You can!</p>
      <ul>
        <li>Refer to the snapshot schema provided in the <code><Link href="/api-docs.pdf" target="_blank"> API Docs (PDF) </Link></code></li>
        <li>Use tools like Postman or ThunderClient</li>
        <li>Send data to:
          <ul>
            <li><code>POST /store-device-profile/userId</code> - for storing device profiles if not already</li>
            <li><code>POST /end-session</code> - for submit full sessions for training.(without this the model will not be trained)</li>
            <li><code>POST /predict</code> - for single risk prediction</li>
        </ul>
        </li>
      </ul>

      <hr></hr>

      <h2>Thank You 🙏</h2>
      <p>We hope you enjoy exploring this project! If you find any bugs or edge cases, feel free to include your notes in your feedback form.</p>
      <p><em>This tool was designed with extensibility and research in mind – not just for detection, but trust.</em></p>
    </main>
  );
}
