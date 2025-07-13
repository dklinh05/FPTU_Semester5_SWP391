import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { publicRoutes } from "./routes";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import { LocationProvider } from "./context/LocationContext";
import { DefaultLayout } from "./layouts";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <LocationProvider>
          <ToastContainer
            position="top-left"
            autoClose={3000}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />

          <Router>
            <div>
              <Chatbot />
              <Routes>
                {publicRoutes.map((route, index) => {
                  const Page = route.component;

                  let Layout = DefaultLayout;

                  if (route.layout) {
                    Layout = route.layout;
                  } else if (route.layout === null) {
                    Layout = Fragment;
                  }

                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={
                        <Layout>
                          <Page />
                        </Layout>
                      }
                    />
                  );
                })}
              </Routes>
            </div>
          </Router>
        </LocationProvider>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
