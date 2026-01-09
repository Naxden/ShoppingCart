import { useState } from "react";
import { login } from "@/app/lib/api";
import { userStore } from "@/app/stores/userStore";

export default function LoginForm() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      return;
    }

    setLoading(true);

    try {
      const accessToken = await login(userId);
      userStore.login(accessToken);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="userId" className="block text-gray-400 mb-2">
          User ID:
        </label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
