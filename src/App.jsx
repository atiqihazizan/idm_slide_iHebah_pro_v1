import "./App.css";
import MessageBar from "./components/MessageBar";
import Carousel from "./components/Carousel";
import Sidebar from "./components/SideBar";

function App() {
  return (
    <>
      <div className="flex flex-1 flex-row overflow-hidden">
        <Carousel />
        <Sidebar />
      </div>
      <MessageBar />
    </>
  );
}

export default App;
