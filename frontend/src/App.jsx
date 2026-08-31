import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";

import PetsPage from "./pages/PetsPage";
import AddPetPage from "./pages/AddPetPage";
import PetDetailsPage from "./pages/PetDetailsPage";
import EditPetPage from "./pages/EditPetPage";
import AddVaccinationPage from "./pages/AddVaccinationPage";

import VetBookingPage from "./pages/VetBookingPage";
import AppointmentsPage from "./pages/AppointmentsPage";

import GroomingPage from "./pages/GroomingPage";
import GroomingBookingsPage from "./pages/GroomingBookingsPage";

import ProtectedRoute from "./components/ProtectedRoute";
import AIAssistantPage from "./pages/AIAssistantPage";

import BoardingPage from "./pages/BoardingPage";
import BoardingBookingsPage from "./pages/BoardingBookingsPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>

       <Route element={<MainLayout />}>

          {/* PUBLIC ROUTES */}

          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/products"
            element={<ProductsPage />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetailsPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />


          {/* PROTECTED ROUTES */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/cart"
              element={<CartPage />}
            />

            <Route
              path="/wishlist"
              element={<WishlistPage />}
            />

            <Route
              path="/profile"
              element={<ProfilePage />}
            />

            <Route
              path="/checkout"
              element={<CheckoutPage />}
            />

            <Route
              path="/orders"
              element={<OrdersPage />}
            />

            <Route
              path="/pets"
              element={<PetsPage />}
            />

            <Route
              path="/pets/add"
              element={<AddPetPage />}
            />

            <Route
              path="/pets/:id"
              element={<PetDetailsPage />}
            />

            <Route
              path="/pets/:id/edit"
              element={<EditPetPage />}
            />

            <Route
              path="/pets/:id/vaccinations/add"
              element={<AddVaccinationPage />}
            />

            <Route
              path="/vet-booking"
              element={<VetBookingPage />}
            />

            <Route
              path="/appointments"
              element={<AppointmentsPage />}
            />

            <Route
              path="/grooming"
              element={<GroomingPage />}
            />

            <Route
              path="/grooming/bookings"
              element={<GroomingBookingsPage />}
            />

          </Route>


          {/* 404 */}

          <Route
            path="*"
            element={<NotFoundPage />}
          />

          <Route
            path="/ai-assistant"
            element={<AIAssistantPage />}
          />

          <Route
            path="/boarding"
            element={<BoardingPage />}
          />

          <Route
            path="/boarding/bookings"
            element={<BoardingBookingsPage />}
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;