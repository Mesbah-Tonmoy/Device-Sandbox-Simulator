import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DeviceProvider } from './context/DeviceContext';
import Sidebar from './components/Sidebar/Sidebar';
import Canvas from './components/Canvas/Canvas';
import Notification from './components/Notification/Notification';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <DeviceProvider>
        <div className="app-container h-screen w-screen flex overflow-auto bg-dark-primary">
          <Sidebar />

          <main className="flex-1 flex flex-col">
            <Canvas />
          </main>

          <Notification />
        </div>
      </DeviceProvider>
    </DndProvider>
  );
}

export default App;
