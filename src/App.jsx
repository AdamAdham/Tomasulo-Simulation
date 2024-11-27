import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Init from "./Components/Init/Init";
import Colors from "./Constants/Colors";
import { InstructionsProvider } from "./Components/Common/Context/InstructionsContext";
import { FloatingRegistersProvider } from "./Components/Common/Context/FloatingRegistersContext";
import { IntegerRegistersProvider } from "./Components/Common/Context/IntegerRegistersContext";
import { CacheProvider } from "./Components/Common/Context/CacheContext";

import { ConfigProvider, theme, Button, Card } from "antd";
import { InstructionLatencyProvider } from "./Components/Common/Context/InstructionLatencyContext";
import { ResourcesProvider } from "./Components/Common/Context/ResourcesContext";
import { ClockProvider } from "./Components/Common/Context/ClockContext";
import { SimulationProvider } from "./Components/Common/Context/SimulationContext";
import { MemoryProvider } from "./Components/Common/Context/MemoryContext";

import Simulation from "./Components/Simulation/Simulation";
const appStyle = {
  backgroundColor: Colors.background,
  minHeight: "100vh",
  color: "#ffffff",
  padding: "0 20px",
};

const darkTheme = createTheme({
  palette: {
    mode: "dark", // This enables dark mode
  },
});

function App() {
  const { defaultAlgorithm, darkAlgorithm } = theme;
  return (
    <ConfigProvider
      theme={{
        algorithm: darkAlgorithm,
      }}
    >
      <InstructionLatencyProvider>
        <MemoryProvider>
          <SimulationProvider>
            <ClockProvider>
              <ResourcesProvider>
                <CacheProvider>
                  <InstructionsProvider>
                    <FloatingRegistersProvider>
                      <IntegerRegistersProvider>
                        <ThemeProvider theme={darkTheme}>
                          <div className="App" style={appStyle}>
                            <Router>
                              <Routes>
                                <Route path="/" element={<Init />} />
                                <Route
                                  path="/simulation"
                                  element={<Simulation />}
                                />
                              </Routes>
                            </Router>
                          </div>
                        </ThemeProvider>
                      </IntegerRegistersProvider>
                    </FloatingRegistersProvider>
                  </InstructionsProvider>
                </CacheProvider>
              </ResourcesProvider>
            </ClockProvider>
          </SimulationProvider>
        </MemoryProvider>
      </InstructionLatencyProvider>
    </ConfigProvider>
  );
}

export default App;
