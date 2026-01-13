export function renderCanvas(canvas: HTMLCanvasElement) {
  const dataURL = canvas.toDataURL("image/png");
  console.log(dataURL);
}

/**
 * Konwertuje canvas na plik i wysyła do backendu
 */
export async function uploadCanvas(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png")
  );

  if (!blob) {
    console.error("Nie udało się wygenerować Blob z canvasu");
    return;
  }

  const formData = new FormData();
  formData.append("file", blob, `QWJ3CN-1-Magma.jpg`); // schemat: {kod gry}-{runda}-{username}

  try {
    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Upload response:", data);
    alert(`Plik wysłany! Nazwa: ${data.filename}`);
  } catch (err) {
    console.error(err);
    alert("Błąd przy wysyłaniu pliku");
  }
}
