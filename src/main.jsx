import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import theme from "../theme.js";
import "./index.css";
import Home from "./pages/Home/Home.jsx";
import Movies from "./pages/Movies/Movies.jsx";
import Shows from "./pages/Shows/Shows.jsx";
import Search from "./pages/Search/Search.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import DetailsPage from "./pages/DetailsPage/DetailsPage.jsx";
import Watchlists from "./pages/Watchlist/Watchlists.jsx";
import Protected from "./components/routes/Protected.jsx";
import React from "react";
import ReactDOM from "react-dom/client";
import AuthProvider from "./hooks/AuthProvider.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/movies",
        element: <Movies />,
      },
      {
        path: "/shows",
        element: <Shows />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/:type/:id",
        element: <DetailsPage />,
      },
      {
        path: "/watchlist",
        element: (
          <Protected>
            <Watchlists />
          </Protected>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
          <RouterProvider router={router} />
        </ChakraProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
