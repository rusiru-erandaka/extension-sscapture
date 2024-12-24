let screenshotInterval = null; // Variable to store the interval ID

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startScreenshots") {
    if (!screenshotInterval) {
      screenshotInterval = setInterval(() => {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
          if (chrome.runtime.lastError) {
            console.error("Error capturing screenshot:", chrome.runtime.lastError);
            return;
          }

          // Generate a timestamped filename
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          const filename = `screenshot-${timestamp}.png`;

          // Download the screenshot
          chrome.downloads.download({
            url: dataUrl,
            filename: filename,
            conflictAction: "overwrite"
          }, () => {
            if (chrome.runtime.lastError) {
              console.error("Error downloading file:", chrome.runtime.lastError);
            }
          });
        });
      }, 500); // Take a screenshot every 500ms (2 per second)
    }
  } else if (message.action === "stopScreenshots") {
    if (screenshotInterval) {
      clearInterval(screenshotInterval);
      screenshotInterval = null;
      console.log("Screenshot capturing stopped.");
    }
  }
});
