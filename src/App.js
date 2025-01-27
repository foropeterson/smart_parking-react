import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import AvailableSpots from "./components/Bookings/AvailableSpots";
import BookParking from "./components/Bookings/BookParking";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./components/LandingPage";
import AccessDenied from "./components/Auth/AccessDenied";
import Admin from "./components/AuditLogs/Admin";
import UserProfile from "./components/Auth/UserProfile";
import ForgotPassword from "./components/Auth/ForgotPassword";
import OAuth2RedirectHandler from "./components/Auth/OAuth2RedirectHandler";
import { Toaster } from "react-hot-toast";
import NotFound from "./components/NotFound";
import ContactPage from "./components/contactPage/ContactPage";
import AboutPage from "./components/aboutPage/AboutPage";
import ResetPassword from "./components/Auth/ResetPassword";
import MyBookings from "./components/Bookings/MyBookings";
import BookingDetails from "./components/Bookings/BookingDetails";
import Payment from "./components/Bookings/Payment";
import PaymentSuccessful from "./components/Bookings/PaymentSuccessful";
import Footer from "./components/Footer/Footer";
import MpesaCheckout from "./components/Bookings/MpesaCheckout";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Toaster position="bottom-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/available-spots" element={<AvailableSpots />} />
        <Route path ="/mpesa-checkout" element ={<MpesaCheckout /> } />
    
        <Route path="/book-parking"
          element={
            <ProtectedRoute>
              <BookParking />
            </ProtectedRoute>
          }
        />
         <Route
          path="/make-payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
         <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccessful />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:bookingId"
          element={
            <ProtectedRoute>
              <BookingDetails />
            </ProtectedRoute>
          }
        />
         <Route
          path="/available-spots"
          element={
            <ProtectedRoute>
              <AvailableSpots />
            </ProtectedRoute>
          }
        />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute adminPage={true}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
