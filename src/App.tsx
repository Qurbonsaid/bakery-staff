import { useEffect, useState } from "react";
import "./App.css";
import useQueryParam from "./hooks/useQueryParam";

function App() {
  const [approved, setApproved] = useState(false);
  const [userId] = useQueryParam(
    "userId",
    localStorage.getItem("userId") || ""
  );
  const [token] = useQueryParam("token", localStorage.getItem("token") || "");
  const [refreshToken] = useQueryParam(
    "refreshToken",
    localStorage.getItem("refreshToken") || ""
  );

  useEffect(() => {
    if (token) {
      fetch("https://bakery.edumir.uz/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok");
        })
        .then((data) => {
          if (!data.msg && data._id === userId) {
            setApproved(true);
            localStorage.setItem("userId", userId);
            localStorage.setItem("token", token);
            localStorage.setItem("refreshToken", refreshToken);
          }
        })
        .catch((error) => {
          alert("Xatolik yuz berdi: " + error.message);
          console.error("Error fetching user data:", error);
        });
    }
  }, [token, refreshToken, userId]);

  return approved ? <h1>Profile page</h1> : <></>;
}

export default App;
