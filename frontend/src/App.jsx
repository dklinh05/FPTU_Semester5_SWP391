import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import { UserProvider } from './context/UserContext';
import { CartProvider } from "./context/CartContext";
import { DefaultLayout } from "./layouts";


function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <div>
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
      </CartProvider>
    </UserProvider>
  );
}

export default App;
