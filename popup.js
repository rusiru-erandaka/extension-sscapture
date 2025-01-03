// Folder ID where the file will be uploaded
const FOLDER_ID = '1S1FKR2zyQtpemsbXSNWvrR3gWowbszOk'; // Replace with your folder ID

let gapiLoaded = false;

function loadGapi() {
  return new Promise((resolve) => {
    if (gapiLoaded) return resolve();
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      gapiLoaded = true;
      gapi.load("client:auth2", resolve);
    };
    document.body.appendChild(script);
  });
}

async function authenticateGoogle() {
  await loadGapi();

  await gapi.client.init({
    apiKey: "AIzaSyBSUDJ9NoGE8kfOY37M_8uzK7llDvrUaeE", // Replace with your API key
    clientId: "889788755448-un2snlul3kl9eu745na1076kjdh70qup.apps.googleusercontent.com", // Replace with your client ID
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    scope: "https://www.googleapis.com/auth/drive.file",
  });

  const authInstance = gapi.auth2.getAuthInstance();
  return authInstance.signIn();
}

// Upload screenshot to Google Drive
async function uploadToDrive(blob, fileName) {
  try {
    const user = await authenticateGoogle();
    console.log("Authenticated user:", user.getBasicProfile().getName());

    const metadata = {
      name: fileName,
      mimeType: blob.type,
      parents: [FOLDER_ID], // Specify the folder ID to upload the file to a specific folder
    };

    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", blob);

    const response = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${gapi.auth.getToken().access_token}`,
        },
        body: form,
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("File uploaded successfully:", data);
    } else {
      console.error("Failed to upload file:", await response.json());
    }
  } catch (error) {
    console.error("Error during Google Drive upload:", error);
  }
}

document.getElementById("start-upload").addEventListener("click", () => {
  chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
    if (chrome.runtime.lastError) {
      console.error("Screenshot capture error:", chrome.runtime.lastError);
      return;
    }

    const fileName = `screenshot_${new Date().toISOString().replace(/:/g, "-")}.png`; // Replace ":" to make file name compatible
    const blob = dataURLToBlob(dataUrl);
    uploadToDrive(blob, fileName);
  });
});

function dataURLToBlob(dataURL) {
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const buffer = new ArrayBuffer(byteString.length);
  const data = new Uint8Array(buffer);
  for (let i = 0; i < byteString.length; i++) {
    data[i] = byteString.charCodeAt(i);
  }
  return new Blob([buffer], { type: mimeString });
}
