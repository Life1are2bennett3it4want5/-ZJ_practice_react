import { createBrowserRouter, RouterProvider } from "react-router"
import Page1 from "./pages/page1";
import Page3 from "./pages/page3";
import Workout from "./pages/workout";
import TanstackQueryPage  from "./pages/tanstackQuery";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Workout/>
    },
    {
      path: "/page1",
      element: <Page1/>
    },
    {
      path: "/page2",
      element: <TanstackQueryPage/>
    },
    {
      path: "/page3",
      element: <Page3/>
    },
  ]);
  
  //RouterProvider can only take in a dataRouter type
  return(
    <div>
      <RouterProvider router={router} /> 
    </div>
  )
}

export default App
