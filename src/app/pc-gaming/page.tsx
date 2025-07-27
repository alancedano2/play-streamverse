// src/app/pc-gaming/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
// Assuming your combined CSS (including button styles, spinner, and stream container transitions)
// is imported via src/app/layout.tsx and thus globally available.

// This declaration makes the RFB object from noVNC available in TypeScript,
// assuming noVNC's rfb.js is loaded via a script tag in your layout.tsx.
declare global {
  interface Window {
    RFB: any; // Using 'any' for simplicity. For production, consider proper noVNC type definitions.
  }
}

export default function PcGamingPage() {
  // Ref to attach the noVNC canvas/display to
  const displayRef = useRef<HTMLDivElement>(null);
  // State for VM connection status (Off, Starting..., Connected!, Disconnected, Error)
  const [vmStatus, setVmStatus] = useState('Off');
  // State to control the visibility and animation of the stream container
  const [showStream, setShowStream] = useState(false);
  // Ref to hold the noVNC RFB client instance for managing connections
  const rfbClientRef = useRef<any>(null);

  // --- Configuration for noVNC connection via websockify ---
  // IMPORTANT:
  // 1. Replace '192.168.1.18' with the ACTUAL LAN IP address of your Proxmox host.
  //    Your browser (running this Next.js app) needs to be able to reach this IP.
  // 2. '6080' is the port you configured websockify to listen on.
  const PROXMOX_HOST_LAN_IP = '192.168.1.18'; // <--- VERIFY AND REPLACE WITH YOUR PROXMOX IP
  const WEBSOCKIFY_PORT = '6080';       // <--- VERIFY THIS MATCHES YOUR WEBSOCKIFY PORT
  const VNC_WEBSOCKET_URL = `ws://${PROXMOX_HOST_LAN_IP}:${WEBSOCKIFY_PORT}`;
  // -----------------------------------------------------------------

  const startVmAndStream = async () => {
    // Reset status and hide stream for new connection attempt
    setVmStatus('Starting...');
    setShowStream(false);

    try {
      // --- Simulate VM Start / Backend API Call ---
      // In a full production setup, this would be an API call to your custom backend
      // that then interacts with the Proxmox API to start the VM.
      // For this direct testing, we assume the VM is already running or starts quickly.
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading time
      console.log('VM presumed started. Attempting direct VNC connection...');

      // --- Initialize noVNC Client ---
      // Ensure displayRef is current and window.RFB (noVNC library) is loaded
      if (displayRef.current && typeof window.RFB !== 'undefined') {
        // Disconnect any existing noVNC client instance before creating a new one
        if (rfbClientRef.current) {
          rfbClientRef.current.disconnect();
          rfbClientRef.current = null;
        }

        // Create a new noVNC RFB client instance
        const rfb = new window.RFB(displayRef.current, VNC_WEBSOCKET_URL, {
          // noVNC client options:
          shared: true, // Allow multiple clients to connect to the same session
          // credentials: { password: 'your_vnc_password' }, // Uncomment and set if your VM has a VNC password
          true_color: true,
          local_cursor: true, // Render cursor locally for better responsiveness
          clipViewport: true, // Adjust display to fit the viewport
          resizeSession: true, // Request server to resize VM resolution if browser window changes
          // Add more noVNC options as needed (e.g., quality, compression)
        });

        rfbClientRef.current = rfb; // Store the RFB instance in a ref

        // --- Add Event Listeners for noVNC Client ---
        rfb.addEventListener('connect', () => {
          console.log('noVNC Connected!');
          setVmStatus('Connected!');
          setShowStream(true); // Trigger stream container animation
        });
        rfb.addEventListener('disconnect', (evt: any) => {
          console.log('noVNC Disconnected:', evt.detail.clean ? 'Clean' : 'Unclean', evt.detail.msg);
          setVmStatus('Disconnected');
          setShowStream(false); // Hide stream container
          rfbClientRef.current = null; // Clear the instance
        });
        rfb.addEventListener('desktopname', (evt: any) => {
          console.log('Desktop Name:', evt.detail.name);
        });
        rfb.addEventListener('error', (evt: any) => {
          console.error('noVNC Error:', evt.detail.error);
          setVmStatus(`Error: ${evt.detail.error.message || 'Connection failed'}`);
          setShowStream(false);
        });

      } else {
        console.error("noVNC RFB library not loaded or displayRef is not available.");
        setVmStatus('Error: VNC library missing');
      }

    } catch (error) {
      console.error('Error during stream setup:', error);
      setVmStatus('Error');
      setShowStream(false);
    }
  };

  // useEffect hook to handle component lifecycle effects, like loading external scripts
  useEffect(() => {
    // This useEffect is mostly a reminder. The best place to load noVNC's `rfb.js`
    // and its dependencies is usually in `src/app/layout.tsx` via <script> tags,
    // as it makes them globally available before your component mounts.
    // Example in src/app/layout.tsx:
    // <script src="/novnc/core/rfb.js"></script>
    // <script src="/novnc/core/util.js"></script>
    // <script src="/novnc/core/input.js"></script>
    // (Adjust paths and include all necessary noVNC core JS files you copied to `public/novnc`)

    // Optional: A cleanup function for when the component unmounts
    return () => {
      if (rfbClientRef.current) {
        rfbClientRef.current.disconnect();
        rfbClientRef.current = null;
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount


  return (
    // Main container with global background and text colors from your CSS vars
    <div style={{ padding: '20px', backgroundColor: 'var(--background)', minHeight: '100vh', color: 'var(--foreground)' }}>
      {/* Page Title */}
      <h1 className="text-4xl text-blue-500 text-center mb-8">Your PC Gaming VM</h1>

      {/* Container for the noVNC stream */}
      <div
        id="vnc-display-container" // ID for potential direct DOM manipulation, ref is for React
        ref={displayRef} // Attach ref for noVNC to render into
        // Apply your custom CSS classes for styling and transitions
        className={`
          spice-display-container // Reusing your existing CSS for layout & transition
          ${showStream ? 'show-stream' : 'hide-stream'}
          ${vmStatus === 'Connected!' ? 'ready-to-stream' : ''}
          bg-black border border-gray-700 rounded-lg shadow-xl mx-auto
        `}
        style={{
          width: '100%',
          maxWidth: '1280px', // Max width for larger screens
          height: '720px',    // Fixed height for the display area
          overflow: 'hidden', // Ensures content stays within bounds during transitions
          boxShadow: '0 0 20px rgba(0, 123, 255, 0.3)', // Aesthetic glow
        }}
      >
        {/* Conditional messages based on VM status */}
        {vmStatus === 'Off' && (
          <p className="text-gray-400 text-center pt-[300px]">
            Click "Start PC" to power up your virtual machine.
          </p>
        )}
        {vmStatus === 'Starting...' && (
          <div className="text-blue-500 text-center pt-[300px]">
            <p>Loading virtual PC...</p>
            {/* Simple CSS spinner, assuming its CSS is in global.css */}
            <div className="spinner"></div>
          </div>
        )}
        {vmStatus === 'Error' && (
          <p className="text-red-500 text-center pt-[300px]">
            Error connecting. Please try again. Status: {vmStatus}
          </p>
        )}
        {/* The actual noVNC <canvas> element will be injected directly into this div
            by the noVNC library when it initializes and connects successfully. */}
      </div>

      {/* Controls Section (Button and Status Text) */}
      <div className="text-center mt-8">
        <button
          onClick={startVmAndStream}
          className="start-pc-button" // Apply your custom button styles
          disabled={vmStatus === 'Starting...' || vmStatus === 'Connected!'} // Disable button when connecting or connected
        >
          {vmStatus === 'Starting...' ? 'Loading...' : 'Start PC'}
        </button>
        <p className="text-gray-400 text-sm mt-2">Current Status: {vmStatus}</p>
      </div>

      {/*
        The custom CSS for the button, spinner, and stream container transitions
        (e.g., .start-pc-button, .spinner, .spice-display-container, .show-stream, etc.)
        should be located in your global CSS file (e.g., src/app/globals.css)
        as per our earlier discussions.
      */}
    </div>
  );
}
