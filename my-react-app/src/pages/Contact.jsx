import { useState } from "react";

function Contact() {
  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  return (
    <section className="contact-container">

      <h2>Contact Me</h2>
      <p className="subtitle">
        Feel free to send me a message. I'd love to hear from you!
      </p>

      <div className="contact-card">

        <input
          type="text"
          placeholder="Enter your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <p className="live-message">
          <strong>Your Message:</strong> {message || "Nothing typed yet"}
        </p>

        <p className="count">
          Characters: {message.length}
        </p>

        <button
          onClick={() => setShowHelp(!showHelp)}
        >
          {showHelp ? "Hide Help" : "Show Help"}
        </button>

        {showHelp && (
          <div className="help-box">
            💡 Type your message above. The input updates in real time because
            it is controlled using <strong>useState</strong>.
          </div>
        )}

      </div>

    </section>
  );
}

export default Contact;