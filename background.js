chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "captureScreenshot") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error("Error capturing screenshot:", chrome.runtime.lastError);
        return;
      }

      // Directly download the screenshot using the data URL
      //updated file
      chrome.downloads.download({ 
        url: dataUrl,
        filename: "screenshot.png",
        conflictAction: "overwrite"
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error downloading file:", chrome.runtime.lastError);
        }
      });
    });
  }
});
