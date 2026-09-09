async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const userMessage = inputField.value.trim();

    if (!userMessage) return;

    // Render User Message Bubble
    const userDiv = document.createElement("div");
    userDiv.className = "message user-message";
    userDiv.textContent = userMessage;
    chatBox.appendChild(userDiv);
    
    inputField.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // Create AI Response Bubble
    const aiDiv = document.createElement("div");
    aiDiv.className = "message ai-message";
    chatBox.appendChild(aiDiv);

    try {
        const response = await fetch("https://34pl0h1p-8000.inc1.devtunnels.ms/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage }),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            aiDiv.textContent += decoder.decode(value, { stream: true });
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    } catch (error) {
        aiDiv.style.color = "#ef4444";
        aiDiv.textContent = "Error connecting to backend.";
    }
}