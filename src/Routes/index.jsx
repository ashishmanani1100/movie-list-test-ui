import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Protected from "./Protected";
import Auth from "./Auth";
import Signin from "../Components/Signin";
import Movies from "../Components/Movies";
import PageNotFound from "../Components/404";
import Movie from "../Components/Movies/Movie";
import Signup from "../Components/Signup";

// Defines all routes present in app
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<Protected />}>
        <Route path="movie-list" element={<Movies />} />
        <Route path="movie" element={<Movie />} />
      </Route>
      <Route element={<Auth />}>
        <Route index element={<Signin />} />
        <Route path="signup" element={<Signup />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Route>
  )
);

const Index = () => {
  return <RouterProvider router={router} />;
};

export default Index;
