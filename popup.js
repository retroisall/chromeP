document.addEventListener('DOMContentLoaded', function () {
  const saveMessageButton = document.getElementById('save-message');
const messageInput = document.getElementById('message-input');
const messagesDiv = document.getElementById('messages');

const webAppUrl = 'https://script.google.com/macros/s/AKfycbz05IwpBc8O_hnQrF-6f-16O_9RtKxXtmfJqr8xmi29_4wfnbNEinBuXCfsRNMgBUS_/exec'; // <-- 在這裡填入你的 Google Apps Script Web App URL

  saveMessageButton.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const message = messageInput.value;
  const timestamp = new Date().toLocaleString();
  const url = tab.url;

  chrome.storage.sync.get('messages', (data) => {
    const messages = data.messages || [];
    messages.push({ url: url, message: message, timestamp: timestamp });
    chrome.storage.sync.set({ messages }, () => {
      displayMessages();
      messageInput.value = '';
    });
  });

  // Send data to Google Apps Script Web App
  fetch(webAppUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: url, message: message, timestamp: timestamp }),
  }).then(response => response.json())
    .then(data => console.log('Data successfully sent to Google Sheets:', data))
    .catch((error) => console.error('Error:', error));
});

function displayMessages() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0].url;
    chrome.storage.sync.get('messages', (data) => {
      const messages = data.messages || [];
      const filteredMessages = messages.filter(msg => msg.url === currentUrl);
      messagesDiv.innerHTML = '';
      filteredMessages.forEach((msg, index) => {
        const div = document.createElement('div');
        div.textContent = `${index + 1}. ${msg.message} (Saved on: ${msg.timestamp})`;
        messagesDiv.appendChild(div);
      });
    });
  });
}

displayMessages();
});