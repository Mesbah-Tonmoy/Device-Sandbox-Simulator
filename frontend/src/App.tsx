import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DeviceProvider } from './context/DeviceContext';
import Sidebar from './components/Sidebar/Sidebar';
import Canvas from './components/Canvas/Canvas';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <DeviceProvider>
        <div className="h-screen w-screen flex flex-col md:flex-row overflow-auto bg-dark-primary">
          <Sidebar />
          <Canvas />
        </div>
      </DeviceProvider>
    </DndProvider>
  );
}

export default App;
