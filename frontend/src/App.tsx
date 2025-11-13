import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DeviceProvider } from './context/DeviceContext';
import Sidebar from './components/Sidebar/Sidebar';
import Canvas from './components/Canvas/Canvas';

function App() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <DeviceProvider>
        <div className="h-screen w-screen flex overflow-auto bg-dark-primary">
          <Sidebar isMobileOpen={isMobileSidebarOpen} onClose={closeSidebar} />
          <Canvas onToggleSidebar={toggleSidebar} />
        </div>
      </DeviceProvider>
    </DndProvider>
  );
}

export default App;
