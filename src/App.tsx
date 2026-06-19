import { Navigate, Outlet, Route, BrowserRouter, Routes, useLocation } from "react-router-dom";
import { AppFrame } from "./components/shell/AppFrame";
import { HomeScreen } from "./screens/HomeScreen";
import { MenuScreen } from "./screens/MenuScreen";
import { ProductDetailsScreen } from "./screens/ProductDetailsScreen";
import { CartScreen } from "./screens/CartScreen";
import { PaymentMethodScreen } from "./screens/PaymentMethodScreen";
import { FakePaymentScreen } from "./screens/FakePaymentScreen";
import { CounterQRScreen } from "./screens/CounterQRScreen";
import { OrderTrackingScreen } from "./screens/OrderTrackingScreen";
import { LoyaltyScreen } from "./screens/LoyaltyScreen";
import { ProfileScreen } from "./screens/ProfileScreen";

const NAV_PATH_PREFIXES = ["/home", "/menu", "/cart", "/loyalty", "/profile"];

function Layout() {
  const location = useLocation();
  const showBottomNav = NAV_PATH_PREFIXES.some((prefix) => location.pathname.startsWith(prefix));

  return (
    <AppFrame showBottomNav={showBottomNav}>
      <Outlet />
    </AppFrame>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/menu" element={<MenuScreen />} />
          <Route path="/product/:productId" element={<ProductDetailsScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/payment" element={<PaymentMethodScreen />} />
          <Route path="/payment/processing" element={<FakePaymentScreen />} />
          <Route path="/payment/counter" element={<CounterQRScreen />} />
          <Route path="/tracking" element={<OrderTrackingScreen />} />
          <Route path="/loyalty" element={<LoyaltyScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
