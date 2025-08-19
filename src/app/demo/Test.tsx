"use client";
export const Test = ({
  chat
}: {
  chat: React.ReactNode
}) => {
  return (
    <div>
      <h1>Test Component</h1>
      <p>This is a test component to verify the layout and functionality.</p>
      <div className="chat-container">
        {chat}
      </div>
    </div>
  );
}