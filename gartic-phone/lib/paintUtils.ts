import { getSocket } from "./socket";
const get_time = () => {
  const formatter24 = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});
  const now = new Date();
  return formatter24.format(now);
}

export function renderCanvas(canvas: HTMLCanvasElement) {
  const dataURL = canvas.toDataURL("image/png");
  console.log(dataURL);
}

export async function uploadCanvas(canvas: HTMLCanvasElement) {
  const socket = getSocket();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png")
  );

  if (!blob) {
    console.error("Nie udało się wygenerować Blob z canvasu");
    return;
  }
  const filename = `SID-${socket.id}_D-${get_time()}.jpg`;

  const formData = new FormData();
  formData.append("file", blob, filename); //SID-{SOCKET ID}_D-{TIME}.jpg

  try {
    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Upload response:", data);
    socket.emit('submit', {type: 'image', content: data.filename})
    alert(`Plik wysłany! Nazwa: ${data.filename}`);
  } catch (err) {
    console.error(err);
    alert("Błąd przy wysyłaniu pliku");
  }
}
