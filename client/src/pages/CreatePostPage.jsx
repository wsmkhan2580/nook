import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import { useAuth } from "../context/AuthContext";

export default function CreatePostPage({ onCreate, isSubmitting }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreate = (formData, onSuccess) => {
    onCreate(formData, () => {
      onSuccess?.();
      navigate("/feed");
    });
  };

  return (
    <div className="page page--narrow">
      <h2 className="page__title">New post</h2>
      {!user && (
        <p className="page__hint">
          Posting anonymously — log in to have posts credited to your name.
        </p>
      )}
      <PostForm onCreate={handleCreate} isSubmitting={isSubmitting} />
    </div>
  );
}
