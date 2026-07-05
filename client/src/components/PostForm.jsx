import { useState, useRef } from "react";

const MAX_CAPTION = 280;

export default function PostForm({ onCreate, isSubmitting }) {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !caption.trim() || isSubmitting) return;

    const formData = new FormData();
    formData.append("caption", caption.trim());
    formData.append("image", file);

    onCreate(formData, () => {
      // reset form after successful create
      setCaption("");
      clearImage();
    });
  };

  const canSubmit = file && caption.trim().length > 0 && !isSubmitting;

  return (
    <form className="composer" onSubmit={handleSubmit}>
      {preview ? (
        <div className="composer__preview">
          <img src={preview} alt="Upload preview" />
          <button
            type="button"
            className="composer__remove"
            onClick={clearImage}
            aria-label="Remove image"
          >
            ×
          </button>
        </div>
      ) : (
        <label className="composer__dropzone">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
          <span className="composer__dropzone-icon">＋</span>
          <span className="composer__dropzone-text">Add a photo</span>
        </label>
      )}

      <div className="composer__fields">
        <textarea
          className="composer__textarea"
          placeholder="Say something about this moment…"
          value={caption}
          maxLength={MAX_CAPTION}
          onChange={(e) => setCaption(e.target.value)}
          rows={2}
        />
        <div className="composer__footer">
          <span className="composer__counter">
            {caption.length}/{MAX_CAPTION}
          </span>
          <button type="submit" className="btn btn--primary" disabled={!canSubmit}>
            {isSubmitting ? "Posting…" : "Share"}
          </button>
        </div>
      </div>
    </form>
  );
}
