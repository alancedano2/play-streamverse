import React, { useRef } from 'react';

const DualIframePage: React.FC = () => {
  const rightIframeRef = useRef<HTMLIFrameElement>(null);

  const refreshRightIframe = () => {
    if (rightIframeRef.current) {
      rightIframeRef.current.src = rightIframeRef.current.src;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Left Iframe Window */}
      <div style={{ flex: 1, borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ textAlign: 'center', margin: '10px 0' }}>Panel Principal</h2>
        <iframe
          src="https://c25a52200f91.ngrok-free.app/"
          title="Panel Principal"
          style={{ border: 'none', width: '100%', flexGrow: 1 }}
          allowFullScreen
        ></iframe>
      </div>

      {/* Right Iframe Window with Refresh */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ textAlign: 'center', margin: '10px 0' }}>Consola KVM de Windows 10</h2>
        <button
          onClick={refreshRightIframe}
          style={{ margin: '5px auto', padding: '10px 20px', cursor: 'pointer' }}
        >
          Recargar Consola
        </button>
        <iframe
          ref={rightIframeRef}
          src="https://c25a52200f91.ngrok-free.app/?console=kvm&novnc=1&vmid=100&vmname=Windows10&node=pve&resize=off&cmd="
          title="Consola KVM"
          style={{ border: 'none', width: '100%', flexGrow: 1 }}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default DualIframePage;
