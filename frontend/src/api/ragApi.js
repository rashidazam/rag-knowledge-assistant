
import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api",
  timeout: 180000,
});

export async function checkHealth() {
  const { data } = await api.get("/health");
  return data;
}

export async function askQuestion(question) {
  const { data } = await api.post("/ask", {
    question,
  });

  return data;
}

export async function ingestText(title, content) {
  const { data } = await api.post("/documents", {
    title,
    content,
  });

  return data;
}

export async function ingestPdf(file) {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await api.post(
    "/documents/pdf",
    formData
  );

  return data;
}

export async function ingestUrl(url) {
  const { data } = await api.post("/documents/url", {
    url,
  });

  return data;
}

export function getErrorMessage(error) {
  return (
    error.response?.data?.error ||
    error.message ||
    "Something went wrong"
  );
}