// src/app/pc-gaming/page.tsx
'use client'; // <-- Add this line for client-side interactivity

import React, { useEffect, useRef, useState } from 'react';
// You would import the html5-spice library here after npm install or similar

export default function PcGamingPage() {
  const displayRef = useRef(null);
  const [vmStatus, setVmStatus] = useState('Off');

  const startVmAndStream = async () => {
    setVmStatus('Starting...');
    try {
      // Call your backend API to start the Proxmox VM
      const response = await fetch('/api/start-vm', { method: 'POST' });
      const data = await response.json();

      if (response.ok && data.spiceProxyUrl) {
        // Initialize html5-spice here
        // Assuming html5-spice is globally available or imported
        // This is a conceptual example; actual html5-spice usage varies by library
        // For example: new SpiceDisplay(displayRef.current, data.spiceProxyUrl);
        console.log('Connecting to SPICE proxy:', data.spiceProxyUrl);
        setVmStatus('Connected!');
        // Your actual html5-spice initialization code goes here
        // It will typically connect to a WebSocket URL provided by your backend proxy
      } else {
        throw new Error(data.message || 'Failed to start VM');
      }
    } catch (error) {
      console.error('Error starting VM or connecting to SPICE:', error);
      setVmStatus('Error');
    }
  };

  // Example of handling client-side display setup if needed
  useEffect(() => {
    if (displayRef.current && vmStatus === 'Connected!') {
      // Additional SPICE display setup or cleanup
    }
  }, [vmStatus]);


  return (
    <div>
      <h1>Your PC Gaming VM</h1>
      <p>Status: {vmStatus}</p>
      <div
        id="spice-display"
        ref={displayRef}
        style={{ width: '100%', maxWidth: '1280px', height: '720px', border: '1px solid gray', backgroundColor: 'black' }}
      >
        {/* SPICE video stream will render inside this div */}
        {vmStatus === 'Off' && <p style={{ color: 'white', textAlign: 'center', paddingTop: '300px' }}>Click Start PC to begin.</p>}
        {vmStatus === 'Starting...' && <p style={{ color: 'white', textAlign: 'center', paddingTop: '300px' }}>Loading virtual PC...</p>}
      </div>
      <button onClick={startVmAndStream} disabled={vmStatus !== 'Off'}>
        Start PC
      </button>
    </div>
  );
}
