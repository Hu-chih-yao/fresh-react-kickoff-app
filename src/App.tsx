import { useState } from "react";
import "./App.scss";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import { SoapNoteProvider } from "./contexts/SoapNoteContext";
import SidePanel from "./components/side-panel/SidePanel";
import { Altair } from "./components/altair/Altair";
import ControlTray from "./components/control-tray/ControlTray";
import LandingPage from "./components/landing/LandingPage";
import cn from "classnames";

// Safely access Vite environment variables with fallback
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY environment variable is not set");
}

// Define the API endpoint with proper error checking
const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent`;

function App() {
  // this video reference is used for displaying the active stream, whether that is the webcam or screen capture
  const videoRef = useRef<HTMLVideoElement>(null);
  // either the screen capture, the video or null, if null we hide it
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  return (
    <div className="App">
      <LiveAPIProvider url={uri} apiKey={API_KEY}>
        <SoapNoteProvider>
          <LandingPage />
          <div className="streaming-console">
            <SidePanel />
            <main>
              <div className="main-app-area">
                <Altair />
                <video
                  className={cn("stream", {
                    hidden: !videoRef.current || !videoStream,
                  })}
                  ref={videoRef}
                  autoPlay
                  playsInline
                />
              </div>

              <ControlTray
                videoRef={videoRef}
                supportsVideo={true}
                onVideoStreamChange={setVideoStream}
              />
            </main>
          </div>
        </SoapNoteProvider>
      </LiveAPIProvider>
    </div>
  );
}

export default App;
