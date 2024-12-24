chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "captureScreenshot") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error("Error capturing screenshot:", chrome.runtime.lastError);
        return;
      }

      // Generate a timestamped filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // Replace invalid characters
      const filename = `screenshot-${timestamp}.png`;

      // Download the screenshot with the custom filename
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
  }
});
