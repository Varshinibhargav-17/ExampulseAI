import AssessmentPage from "./AssessmentPage";
import Dashboard from "./Dashboard";
import MockTest from "./MockTest";

function App() {
  const url = window.location.search;

  if (url.includes("mock=true")) return <MockTest />;
  if (url.includes("admin=true")) return <Dashboard />;

  return <AssessmentPage />;
}

export default App;


