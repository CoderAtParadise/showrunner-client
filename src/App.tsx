import './App.css';
import ClockSource from "./components/client/ClockSource";
import SyncSource from "./components/client/SyncSource";
import Current from "./components/client/Current";

function App() {
  return (
    <div>
     <SyncSource>
      <ClockSource>
        <Current></Current>
      </ClockSource>
      </SyncSource>
    </div>
  );
}

export default App;
