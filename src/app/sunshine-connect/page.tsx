"use client";

import React, { useEffect, useRef } from "react";

export default function SunshinePC() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const signalingUrl = "ws://209.91.235.179:47989"; // Cambia esto a la IP/puerto de Sunshine WebSocket
    wsRef.current = new WebSocket(signalingUrl);

    wsRef.current.onopen = () => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      pc.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({ type: "candidate", candidate: event.candidate })
          );
        }
      };

      pc
        .createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          if (pc.localDescription) {
            wsRef.current?.send(
              JSON.stringify({ type: "offer", sdp: pc.localDescription.sdp })
            );
          }
        });
    };

    wsRef.current.onmessage = async (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "answer" && pcRef.current) {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription({ type: "answer", sdp: data.sdp })
        );
      } else if (data.type === "candidate" && pcRef.current) {
        try {
          await pcRef.current.addIceCandidate(data.candidate);
        } catch (e) {
          console.error("Error agregando ICE candidate", e);
        }
      }
    };

    wsRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      wsRef.current?.close();
      pcRef.current?.close();
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        controls
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
