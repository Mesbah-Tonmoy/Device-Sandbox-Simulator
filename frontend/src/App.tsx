import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { DeviceProvider } from './context/DeviceContext';
import Sidebar from './components/Sidebar/Sidebar';
import Canvas from './components/Canvas/Canvas';

function App() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Detect if device supports touch
  const isTouchDevice =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Choose backend based on device
  const backendForDND = isTouchDevice ? TouchBackend : HTML5Backend;

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <DndProvider backend={backendForDND}>
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
