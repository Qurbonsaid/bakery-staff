import { useEffect, useMemo } from "react";
import "./App.css";
import useQueryParam from "./hooks/useQueryParam";
import { createXRStore, XR, XRLayer } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";

function App() {
  const [userId] = useQueryParam(
    "userId",
    localStorage.getItem("userId") || ""
  );
  const [token] = useQueryParam("token", localStorage.getItem("token") || "");
  const [refreshToken] = useQueryParam(
    "refreshToken",
    localStorage.getItem("refreshToken") || ""
  );
  const store = createXRStore({
    controller: false,
    hand: false,
    transientPointer: false,
    gaze: false,
    screenInput: false,
    emulate: false,
    handTracking: false,
  });

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
            localStorage.setItem("userId", userId);
            localStorage.setItem("token", token);
            localStorage.setItem("refreshToken", refreshToken);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [token, refreshToken, userId]);

  const video = useMemo(() => {
    const result = document.createElement("video");
    result.src = "./video.mp4";
    return result;
  }, []);

  return (
    <>
      <button onClick={() => store.enterVR()}>Enter VR</button>
      <Canvas>
        <XR store={store}>
          <XRLayer
            position={[0, 1.5, -0.5]}
            onClick={() => video.play()}
            scale={0.5}
            src={video}
          />
        </XR>
      </Canvas>
    </>
  );
}

export default App;
