import React from 'react';

const KVMPage: React.FC = () => {
  const iframeSrc = "https://c25a52200f91.ngrok-free.app/?console=kvm&novnc=1&vmid=100&vmname=Windows10&node=pve&resize=off&cmd=";

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <h1 style={{ textAlign: 'center', margin: '10px 0' }}>Consola KVM de Windows 10</h1>
      <iframe
        src={iframeSrc}
        title="Consola KVM"
        style={{ border: 'none', width: '100%', height: 'calc(100% - 60px)' }} // Adjust height to account for the title
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default KVMPage;
