document.addEventListener("DOMContentLoaded", async () => {
  const urlField = document.getElementById("url");
  const commentsContainer = document.getElementById("comments");
  const addButton = document.getElementById("addButton");
  const commentInput = document.getElementById("commentInput");

  // 獲取當前網址
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentUrl = tab.url;
  urlField.textContent = currentUrl;

  // 讀取留言
  async function fetchComments() {
    const response = await fetch(`https://script.google.com/macros/s/AKfycbzFbTaRLgjEP5usVaO9gU3qgSI1XlW1WzDlsdvjneoVWj4rLfuta-HVeImPh2229XhX/exec?url=${encodeURIComponent(currentUrl)}`);
    const comments = await response.json();
    commentsContainer.innerHTML = "";
    comments.forEach(comment => {
      const div = document.createElement("div");
    
      // 格式化時間軸（秒 -> 分:秒）
      const seconds = comment[2];
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const timeString = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    
      div.innerHTML = `<span class="time" style="color:blue; cursor:pointer;">[${timeString}]</span> ${comment[1]} (${new Date(comment[3]).toLocaleString()})`;
  
      // 添加點擊事件
      div.querySelector(".time").addEventListener("click", () => {
        const videoElement = document.querySelector("video");
        if (videoElement) {
          videoElement.currentTime = seconds; // 跳轉到留言的時間軸
          videoElement.play();
        }
  });
  
  commentsContainer.appendChild(div);
    });
  }

  // 添加留言
  addButton.addEventListener("click", async () => {
    const newComment = commentInput.value.trim();
    if (!newComment) return;

    await fetch("https://script.google.com/macros/s/AKfycbzFbTaRLgjEP5usVaO9gU3qgSI1XlW1WzDlsdvjneoVWj4rLfuta-HVeImPh2229XhX/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: currentUrl, comment: newComment })
    });

    commentInput.value = "";
    fetchComments();
  });

  fetchComments();
});