document.getElementById("toggleScreenshots").addEventListener("click", (event) => {
  const button = event.target;
  if (button.dataset.state === "off") {
    button.dataset.state = "on";
    button.textContent = "Stop Auto Screenshots";
    chrome.runtime.sendMessage({ action: "startScreenshots" });
  } else {
    button.dataset.state = "off";
    button.textContent = "Start Auto Screenshots";
    chrome.runtime.sendMessage({ action: "stopScreenshots" });
  }
});
