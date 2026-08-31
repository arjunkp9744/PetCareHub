import { useState } from "react";
import api from "../services/api";

function AIAssistantPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await api.post(
        "ai/chat/",
        {
          question: trimmedQuestion,
        }
      );

      const aiMessage = {
        role: "assistant",
        content: response.data.answer,
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        aiMessage,
      ]);

    } catch (error) {
      console.error(
        "AI Assistant error:",
        error.response?.data || error.message
      );

      const errorMessage = {
        role: "assistant",
        content:
          "Sorry, I couldn't get a response right now. Please try again.",
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        errorMessage,
      ]);

    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mt-4">

      <div className="text-center mb-4">
        <h1>🐾 PetCare AI Assistant</h1>

        <p className="text-muted">
          Ask me anything about caring for your pet.
        </p>
      </div>

      <div
        className="card shadow-sm"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >

        <div
          className="card-body"
          style={{
            height: "500px",
            overflowY: "auto",
          }}
        >

          {messages.length === 0 && (
            <div className="text-center text-muted mt-5">

              <h4>How can I help you? 🐶🐱</h4>

              <p>
                Try asking:
              </p>

              <p>
                "What should I feed my puppy?"
              </p>

              <p>
                "How often should I groom my dog?"
              </p>

              <p>
                "How much exercise does a dog need?"
              </p>

            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-3 ${
                message.role === "user"
                  ? "text-end"
                  : "text-start"
              }`}
            >

              <div
                className={`d-inline-block p-3 rounded ${
                  message.role === "user"
                    ? "bg-primary text-white"
                    : "bg-light"
                }`}
                style={{
                  maxWidth: "75%",
                }}
              >
                {message.content}
              </div>

            </div>
          ))}

          {loading && (
            <div className="text-start mb-3">
              <div className="d-inline-block bg-light p-3 rounded">
                🤖 AI is thinking...
              </div>
            </div>
          )}

        </div>

        <div className="card-footer">

          <div className="input-group">

            <textarea
              className="form-control"
              placeholder="Ask a pet-care question..."
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              onKeyDown={handleKeyDown}
              rows="2"
              disabled={loading}
            />

            <button
              className="btn btn-primary"
              onClick={handleSend}
              disabled={
                loading ||
                !question.trim()
              }
            >
              {loading
                ? "Thinking..."
                : "Send"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AIAssistantPage;