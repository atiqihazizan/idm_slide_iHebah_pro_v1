import { useEffect, useRef } from "react"
import { useContextState } from "../../contextState"

const Popup = () => {
  const { isPopup, srcPath, setPopup, setPath } = useContextState()
  const videoRefs = useRef()

  useEffect(() => {
    const video = videoRefs.current;
    if (video) {
      video.src = srcPath
      video.muted = true;
      video.play();
      video.muted = false
      video.onended = () => {
        setPopup(false)
        setPath(null)
      }
    }
  }, [isPopup, srcPath])

  return <div className="flex-shrink relative">
    <video
      preload="none"
      ref={videoRefs}
      style={{ width: '100%', height: '100%', border: 0, zIndex: 1 }}
      type="video/mp4"
    ></video>
  </div>
}

export default Popup