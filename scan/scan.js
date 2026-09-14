// PillScope — camera barcode scanner
//
// Uses the ZXing-js library (loaded from a CDN in index.html) to decode
// barcodes from the live camera feed. ZXing is used instead of the
// native BarcodeDetector API because BarcodeDetector isn't supported in
// Safari/Firefox as of this writing — ZXing works across all modern
// browsers that support getUserMedia.
//
// Once a code is decoded, it's handed to PillAPI.getByBarcode(), which
// tries it as a National Drug Code (NDC) — see the big comment above
// getByBarcode in /pillscope-data.js for exactly what this can and can't
// resolve.

(function () {
  const video = document.getElementById("scan-video");
  const statusEl = document.getElementById("scan-status");
  const manualInput = document.getElementById("manual-code");
  const manualBtn = document.getElementById("manual-submit");

  let reader = null;
  let stopped = false;

  function setStatus(text) {
    statusEl.textContent = text;
  }

  async function handleCode(rawText) {
    if (stopped) return;
    stopped = true;
    stopScanning();
    setStatus(`Scanned "${rawText}" — looking it up…`);

    try {
      const med = await PillAPI.getByBarcode(rawText);
      if (med) {
        window.location.href = med.ndc
          ? `/med.html?ndc=${encodeURIComponent(med.ndc)}`
          : `/med.html?barcode=${encodeURIComponent(rawText)}`;
        return;
      }
    } catch (err) {
      console.warn("Barcode lookup failed:", err);
    }

    setStatus(`No medicine found for "${rawText}". You can type it in manually below, or try scanning again.`);
    stopped = false;
    startScanning();
  }

  function stopScanning() {
    try {
      if (reader) reader.reset();
    } catch (_) {
      // ignore
    }
  }

  function startScanning() {
    if (typeof ZXing === "undefined") {
      setStatus("Barcode scanning library failed to load — use manual entry below instead.");
      return;
    }
    reader = new ZXing.BrowserMultiFormatReader();
    setStatus("Point your camera at the barcode…");

    reader
      .decodeFromConstraints(
        { video: { facingMode: "environment" } },
        video,
        (result, err) => {
          if (result) {
            handleCode(result.getText());
          }
          // NotFoundException fires continuously while no code is in
          // frame — that's expected, not a real error, so it's ignored.
        }
      )
      .catch((err) => {
        console.warn("Camera init failed:", err);
        setStatus(
          "Couldn't access the camera (permission denied, no camera, or not on HTTPS). Use manual entry below instead."
        );
      });
  }

  function submitManual() {
    const value = manualInput.value.trim();
    if (!value) return;
    handleCode(value);
  }

  manualBtn.addEventListener("click", () => {
    stopped = false; // allow handleCode to proceed even after a prior scan
    submitManual();
  });

  manualInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      stopped = false;
      submitManual();
    }
  });

  window.addEventListener("beforeunload", stopScanning);

  document.addEventListener("DOMContentLoaded", () => {
    if (typeof PillAPI === "undefined") {
      setStatus("Lookup engine failed to load — check your connection and reload.");
      return;
    }
    startScanning();
  });
})();
