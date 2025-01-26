import './App.css'
import MessageBar from './components/MessageBar';
import Presentation from './components/Presentation';
import Sidebar from './components/SideBar';

function App() {
  return (
    <>
      <div className='flex flex-1 flex-row overflow-hidden'>
        <Presentation />
        <Sidebar />
      </div>
      <MessageBar />
    </>
  );
}

export default App;
