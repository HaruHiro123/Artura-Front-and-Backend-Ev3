import { useLanguage } from './i18n/useLanguage.js'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute.jsx'

import LoginPage from './pages/LoginPage.jsx'
import LogoutPage from './pages/LogoutPage.jsx'

import Dashboard from './pages/frontpages/Dashboard.jsx'
import Portfolio from './pages/frontpages/Portfolio.jsx'
import Shop from './pages/frontpages/Shop.jsx'
import ArtworkDetail from './pages/frontpages/ArtworkDetail.jsx'
import Commission from './pages/frontpages/Commission.jsx'
import CommissionPayment from './pages/frontpages/CommissionPayment.jsx'
import CommissionStatus from './pages/frontpages/CommissionStatus.jsx'
import Cart from './pages/frontpages/Cart.jsx'
import Checkout from './pages/frontpages/Checkout.jsx'
import Payment from './pages/frontpages/Payment.jsx'
import OrderStatus from './pages/frontpages/OrderStatus.jsx'
import PurchaseStatus from './pages/frontpages/PurchaseStatus.jsx'
import About from './pages/frontpages/About.jsx'

import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminArtworks from './pages/admin/AdminArtworks.jsx'
import ArtworkForm from './pages/admin/ArtworkForm.jsx'
import AdminCommissions from './pages/admin/AdminCommissions.jsx'
import CommissionDetail from './pages/admin/CommissionDetail.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import OrderDetail from './pages/admin/OrderDetail.jsx'
import AdminPayments from './pages/admin/AdminPayments.jsx'
import AdminReviews from './pages/admin/AdminReviews.jsx'
import AdminPricing from './pages/admin/AdminPricing.jsx'
import AdminProfile from './pages/admin/AdminProfile.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'

export default function App() {
  const { t } = useLanguage()

  const { pathname } = useLocation()
  return (
    <Routes key={pathname}>
      {/* Rute Login sesuai Modul Pembelajaran Laravel Auth */}
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="shop" element={<Shop />} />
        <Route path="artwork/:slug" element={<ArtworkDetail />} />
        <Route path="commission" element={<Commission />} />
        <Route path="commission/payment/:id" element={<CommissionPayment />} />
        <Route path="commission/status/:id" element={<CommissionStatus />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="payment/:orderId" element={<Payment />} />
        <Route path="order/:orderId" element={<OrderStatus />} />
        <Route path="status" element={<PurchaseStatus />} />
        <Route path="about" element={<About />} />
        <Route path="logout" element={<LogoutPage />} />
        <Route path="artworks" element={<Navigate to="/portfolio" replace />} />
        <Route path="product/:id" element={<Navigate to="/shop" replace />} />
        <Route
          path="*"
          element={
            <section className="rounded-3xl bg-white p-8 text-center">
              <h1 className="font-serif text-3xl">{t("Page not found")}</h1>
              <p className="mt-4 text-stone-600">
                {t("Use the navigation menu to return to ARTURA.")}
              </p>
            </section>
          }
        />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="artworks" element={<AdminArtworks />} />
          <Route path="artworks/add" element={<ArtworkForm mode="add" />} />
          <Route path="artworks/edit/:id" element={<ArtworkForm mode="edit" />} />
          {/* Rute alias sesuai Modul BAB IV Integrasi React */}
          <Route path="add-product" element={<ArtworkForm mode="add" />} />
          <Route path="edit-product/:id" element={<ArtworkForm mode="edit" />} />
          <Route path="commissions" element={<AdminCommissions />} />
          <Route path="commissions/:id" element={<CommissionDetail />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="pricing" element={<AdminPricing />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="logout" element={<LogoutPage />} />
        </Route>
      </Route>
    </Routes>
  )
}