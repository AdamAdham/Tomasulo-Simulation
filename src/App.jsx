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
const appStyle = {
  backgroundColor: Colors.background,
  minHeight: "100vh",
  color: "#ffffff",
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
                        </Routes>
                      </Router>
                    </div>
                  </ThemeProvider>
                </IntegerRegistersProvider>
              </FloatingRegistersProvider>
            </InstructionsProvider>
          </CacheProvider>
        </ResourcesProvider>
      </InstructionLatencyProvider>
    </ConfigProvider>
  );
}

export default App;
