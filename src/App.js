import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";
import OrderTable from "./owner/orderTable";
import TableList from "./owner/TableList";
import TableBlockerView from "./owner/TableBlockerView";
import CategoryMenuManager from "./owner/CategoryMenuManager";
import UserProfiles from "./owner/userProfile";
import SignIn from "./owner/AuthPageLayout/SignIn";
import MenuPage from "./customers/MenuPage";
import CartPage from "./customers/CartPage";
import OrderStatusPage from "./customers/OrderStatusPage";
import PaymentRedirectPage from "./customers/payment/PaymentRedirectPage";
import PaymentSuccess from "./customers/PaymentSuccess";
import { ThemeProvider } from "./components/context/ThemeContext";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import SignUp from "./owner/AuthPageLayout/SignUp";
import PaymentFailurePage from "./customers/payment/PaymentFailurePage";

function App() {
  return (
    <>
      <Routes>
        {/* ✅ Owner routes wrapped in ThemeProvider */}
        <Route
          path="/owner/Dashboard/*"
          element={
            <ThemeProvider>
              <Layout />
            </ThemeProvider>
          }
        >
          <Route path="basic-tables" element={<OrderTable />} />
          <Route path="tableqr" element={<TableList />} />
          <Route path="blocker" element={<TableBlockerView />} />
          <Route path="menu-manager" element={<CategoryMenuManager />} />
          <Route path="manage" element={<UserProfiles />} />
        </Route>

        {/* ✅ Customer routes */}
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/customer/menu" element={<MenuPage />} />
        <Route path="/customer/cart" element={<CartPage />} />
        <Route path="/customer/order/status" element={<OrderStatusPage />} />
        <Route path="/payment/status/:orderId" element={<PaymentRedirectPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentFailurePage />} />

        {/* ✅ Catch-all 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
