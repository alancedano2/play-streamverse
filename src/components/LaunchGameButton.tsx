import { useState } from "react";

interface Props {
  gameId: string;
}

export default function LaunchGameButton({ gameId }: Props) {
  const [message, setMessage] = useState("");

  const handleLaunch = async () => {
    setMessage("Iniciando juego...");
    try {
      const res = await fetch("http://TU_IP_LOCAL:5000/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game: gameId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.status}`);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (e) {
      setMessage("Error conectando con el servidor");
    }
  };

  return (
    <div>
      <button onClick={handleLaunch} className="btn-primary">
        Iniciar Juego
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
