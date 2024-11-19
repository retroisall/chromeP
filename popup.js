// popup.js
document.addEventListener('DOMContentLoaded', function () {
  const saveUrlButton = document.getElementById('save-url');
  const saveMessageButton = document.getElementById('save-message');
  const messageInput = document.getElementById('message-input');
  const messagesDiv = document.getElementById('messages');

  const webAppUrl = 'https://script.google.com/macros/s/AKfycbyQYo56wVTNCbKNTM-Ch-Vxj51qd2nFDuqluPNx3Fn11ng7YoGExtP1d5BqJU_UhGNF/exec'; // <-- 在這裡填入你的 Google Apps Script Web App URL

  saveUrlButton.addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab.url;

    // Save URL locally
    chrome.storage.sync.get('urls', (data) => {
      const urls = data.urls || [];
      urls.push(url);
      chrome.storage.sync.set({ urls });
    });

    // Send URL to Google Sheets through Apps Script
    fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'url', value: url }),
    }).then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));
  });

  saveMessageButton.addEventListener('click', () => {
    const message = messageInput.value;

    // Save message locally
    chrome.storage.sync.get('messages', (data) => {
      const messages = data.messages || [];
      messages.push(message);
      chrome.storage.sync.set({ messages }, () => {
        displayMessages();
        messageInput.value = '';
      });
    });

    // Send message to Google Sheets through Apps Script
    fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'message', value: message }),
    }).then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));
  });

  function displayMessages() {
    chrome.storage.sync.get('messages', (data) => {
      const messages = data.messages || [];
      messagesDiv.innerHTML = '';
      messages.forEach((msg, index) => {
        const div = document.createElement('div');
        div.textContent = `${index + 1}. ${msg}`;
        messagesDiv.appendChild(div);
      });
    });
  }

  displayMessages();
});