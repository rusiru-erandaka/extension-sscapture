document.getElementById("capture").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "captureScreenshot" });
});
