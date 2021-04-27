import './App.css';
import ClockSource from "./components/client/ClockSource";
import SyncSource from "./components/client/SyncSource";

function App() {
  return (
    <div>
     <SyncSource>
      <ClockSource>
      
      </ClockSource>
      </SyncSource>
    </div>
  );
}

export default App;
