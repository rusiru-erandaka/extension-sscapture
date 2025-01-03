let screenshotInterval = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startScreenshots") {
    if (!screenshotInterval) {
      screenshotInterval = setInterval(() => {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
          if (chrome.runtime.lastError) {
            console.error("Error capturing screenshot:", JSON.stringify(chrome.runtime.lastError, null, 2));
            return;
          }
          

          
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          const filename = `screenshot-${timestamp}.png`;

          
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
      }, 500); 
    }
  } else if (message.action === "stopScreenshots") {
    if (screenshotInterval) {
      clearInterval(screenshotInterval);
      screenshotInterval = null;
      console.log("Screenshot capturing stopped.");
    }
  }
});

chrome.identity.getAuthToken({ interactive: true }, function(token) {
  if (chrome.runtime.lastError || !token) {
    console.error("Authentication failed: " + chrome.runtime.lastError.message);
    return;
  }
  // Use the token to authenticate Google Drive upload
});

