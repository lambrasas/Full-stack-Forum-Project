import React, { useState } from "react";
import PropTypes from "prop-types";
import InputField from "./InputField";
const EditableContent = ({ content, onSave, threadId, maxLength = 500 }) => {
  const [editContent, setEditContent] = useState(content);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (editContent.length > maxLength) {
      alert(`Content must be no longer than ${maxLength} characters.`);
      return;
    }
    onSave(editContent, threadId);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <InputField
            inputType="textarea"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={maxLength}
            rows={10}
            style={{ width: "100%" }}
          />
          <div style={{ marginTop: "10px" }}>
            {editContent.length}/{maxLength}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={{
                  background: "#7299e1",
                  border: "none",
                  padding: "2px 5px",
                  borderRadius: "5px",
                }}
                onClick={handleSave}
              >
                Save
              </button>
              <button
                style={{
                  background: "#7299e1",
                  border: "none",
                  padding: "2px 5px",
                  borderRadius: "5px",
                }}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>{content}</p>
          <button
            style={{
              background: "#7299e1",
              border: "none",
              padding: "2px 10px",
              borderRadius: "5px",
              fontSize: "15px",
              marginTop: "10px",
            }}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

EditableContent.propTypes = {
  content: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  threadId: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
};

export default EditableContent;
