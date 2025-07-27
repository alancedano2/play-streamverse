// src/app/pc-gaming/page.tsx
'use client';

import React, { useRef, useState } from 'react';
// Import your CSS file, e.g.:
// import styles from './PcGamingPage.module.css'; // If using CSS Modules
// import '../globals.css'; // Or if it's a global class

export default function PcGamingPage() {
  const displayRef = useRef(null);
  const [vmStatus, setVmStatus] = useState('Off');
  const [showStream, setShowStream] = useState(false); // New state for stream visibility

  const startVmAndStream = async () => {
    setVmStatus('Starting...');
    setShowStream(false); // Hide potentially previous stream
    try {
      // --- Simulate API call and stream connection ---
      // Replace with your actual backend call to Proxmox API
      // and getting SPICE proxy URL
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
      const data = { spiceProxyUrl: 'ws://your-backend-proxy:port/spice' }; // Example

      if (data.spiceProxyUrl) {
        setVmStatus('Connected!');
        setShowStream(true); // Show the stream container after successful connection
        // --- Initialize html5-spice here ---
        // You would typically include the html5-spice library script in your
        // `public` folder or via a CDN, and then initialize it here.
        // Example (conceptual):
        // if (displayRef.current && typeof SpiceDisplay !== 'undefined') {
        //   const spiceClient = new SpiceDisplay(displayRef.current, {
        //     uri: data.spiceProxyUrl,
        //     // other options
        //   });
        //   spiceClient.connect();
        // } else {
        //   console.error("html5-spice library not loaded or displayRef missing.");
        // }
        console.log('Connecting to SPICE proxy:', data.spiceProxyUrl);
      } else {
        throw new Error('Failed to get SPICE proxy URL');
      }
    } catch (error) {
      console.error('Error starting VM or connecting to SPICE:', error);
      setVmStatus('Error');
      setShowStream(false); // Ensure it's hidden on error
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', minHeight: '100vh', color: '#e0e0e0' }}>
      <h1 style={{ color: '#007bff', textAlign: 'center', marginBottom: '30px' }}>Your PC Gaming VM</h1>

      <div
        id="spice-display-container"
        ref={displayRef}
        // Apply classes for styling and transition
        className={`
          spice-display-container
          ${showStream ? 'show-stream' : 'hide-stream'}
          ${vmStatus === 'Connected!' ? 'ready-to-stream' : ''}
        `}
        style={{
          width: '100%',
          maxWidth: '1280px',
          height: '720px',
          margin: '0 auto', // Center the box
          border: '1px solid #444',
          backgroundColor: '#000',
          overflow: 'hidden', // Crucial for managing the transition effect
          borderRadius: '10px',
          boxShadow: '0 0 20px rgba(0, 123, 255, 0.3)', // Glow effect
        }}
      >
        {vmStatus === 'Off' && (
          <p style={{ color: '#aaa', textAlign: 'center', paddingTop: '300px' }}>
            Click "Start PC" to power up your virtual machine.
          </p>
        )}
        {vmStatus === 'Starting...' && (
          <div style={{ color: '#007bff', textAlign: 'center', paddingTop: '300px' }}>
            <p>Loading virtual PC...</p>
            {/* You could add a simple CSS spinner here */}
            <div className="spinner"></div>
          </div>
        )}
        {vmStatus === 'Error' && (
          <p style={{ color: '#ff4d4d', textAlign: 'center', paddingTop: '300px' }}>
            Error connecting. Please try again.
          </p>
        )}
        {/* The actual html5-spice canvas will be injected directly into this container
            by the html5-spice library when it initializes and connects. */}
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={startVmAndStream}
          className="start-pc-button" // Apply the CSS class
          disabled={vmStatus === 'Starting...' || vmStatus === 'Connected!'}
        >
          {vmStatus === 'Starting...' ? 'Loading...' : 'Start PC'}
        </button>
        <p style={{ color: '#aaa', fontSize: '0.9em', marginTop: '10px' }}>Current Status: {vmStatus}</p>
      </div>

      {/* Basic Spinner CSS (add to your global CSS) */}
      <style jsx global>{`
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #007bff;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Stream Container Transitions */
        .spice-display-container {
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }

        .spice-display-container.show-stream {
          opacity: 1;
          transform: scale(1);
        }

        /* You might want to initially hide the html5-spice canvas itself */
        .spice-display-container canvas {
            opacity: 0;
            transition: opacity 0.5s ease-in 0.3s; /* Delay its appearance slightly */
        }
        .spice-display-container.ready-to-stream canvas {
            opacity: 1;
        }
      `}</style>
    </div>
  );
}
