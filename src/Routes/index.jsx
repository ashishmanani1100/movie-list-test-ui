import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Protected from "./Protected";
import Signin from "../Components/Signin";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<Protected />}>
        {/* <Route index element={<Home />} /> */}
      </Route>
      <Route index element={<Signin />} />
      <Route path="*" element={<h1>Page not found</h1>} />
    </Route>
  )
);

const Index = () => {
  return <RouterProvider router={router} />;
};

export default Index;
