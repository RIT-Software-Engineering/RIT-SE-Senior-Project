import "./App.css";
import { Button } from "./components/ui/button";
import Nav from "./components/ui/nav";
import { ThemeProvider } from "./components/ui/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Nav />
      <div className="flex flex-col items-center justify-center min-h-svh">
        <Button>Click me</Button>
      </div>
    </ThemeProvider>
  );
}

export default App;
