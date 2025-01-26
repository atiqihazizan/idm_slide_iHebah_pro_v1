import { useContextState } from "../contextState"
import Popup from "./screen/Popup"
import Slider from "./screen/Slider"

const Presentation = () => {
  const { isPopup } = useContextState()
  return isPopup ? <Popup /> : <Slider />
}

export default Presentation