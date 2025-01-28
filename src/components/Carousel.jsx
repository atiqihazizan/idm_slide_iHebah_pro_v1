import { useContextState } from "../contextState"
import Popup from "./carousel/Popup"
import Slider from "./carousel/Slider"

const Carousel = () => {
  const { isPopup } = useContextState()
  return isPopup ? <Popup /> : <Slider />
}

export default Carousel