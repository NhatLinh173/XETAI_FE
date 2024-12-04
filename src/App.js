import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./component/Common/Navbar";
import Footer from "./component/Common/Footer";
import CopyRight from "./component/Common/CopyRight";

import Home_One from "./page/indexPage";
import About from "./page/About";
import Service from "./page/Service";
import ServiceDetail from "./component/Common/Service/ServiceDetail";
import ServiceDetails from "./page/ServiceDetails";
import BlogGrid from "./page/BlogGrid";
import BlogWithSidebar from "./page/BlogWithSidebar";
import BlogDetails from "./page/BlogDetails";
import BlogDetail from "./component/BlogDetails/BlogDetail";
import OurTeamArea from "./page/OurTeam";
import Testimonials from "./page/Testimonial";
import Gallery from "./page/Gallery";
import Faqs from "./page/Faqs";
import TrackYourShip from "./page/TrackYourShip";
import SignUp from "./page/SignUp";
import SignIn from "./page/SignIn";
import PrivacyPolicy from "./page/PrivacyPolicy";
import TermsCondition from "./page/TermsCondition";
import Error from "./page/Error";
import Contact from "./page/Contact";
import PricingContent from "./page/Pricing";
import RequestQuote from "./page/RequestQuote";
import AccountTypes from "./page/AccountTypes";
import Profile from "./page/Profile";
import CustomModal from "./component/modal-popup/CustomModal";
import ScrollToTop from "./component/ScrollToTop";
import useModal from "./hooks/useModal";
import SignUpCustomerPage from "./page/SignUpCustomerPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FavoriteDrivers from "./page/FavoriteDrivers";
import DriverDetail from "./component/Profile/User/DriverDetail";
import TripDetail from "./component/Profile/User/TripDetail";
import HistoryPostDetail from "./component/Profile/User/HistoryPostDetail";
import PaymentSuccess from "./component/PaymentStatus/PaymentSuccess";
import PaymentFailed from "./component/PaymentStatus/PaymentFailed";
import Chat from "./component/Chat/chat";
import VehicalDetail from "./component/Profile/User/VehicalDetail";
import { WebSocketProvider } from "./hooks/WebSocketContext";
import VehicalAdd from "./component/Profile/User/VehicalAdd";
import ProtectedRoute from "./config/checkRole";
import Admin from "./page/AdminDashboard";
import DriverDetailManagement from "./component/AdminDashboard/DriverManagement/DriverDetailMangement";
import CustomerManagement from "./component/AdminDashboard/CustomerManagement/CustomerManagement";
import DriverManagement from "./component/AdminDashboard/DriverManagement/DriverManagement";
import ForgotPassword from "./component/ForgotPassword/forgotPassword";
import StaffManagement from "./component/AdminDashboard/StaffManagement/StaffManagement";
import Unauthorized from "./component/Unauthorized/unauthorized";
import ResetPassword from "./component/ForgotPassword/resetPassword";
import VehicleManager from "./component/AdminDashboard/VehicleManagement/vehicleManagement";
import ConfirmWithDraw from "./component/AdminDashboard/ConfirmWithDraw/confirmWithDraw";
import Post from "./page/Post";
import HistoryPostDriver from "./component/Profile/User/HistoryPostDriver";
import HistoryPostDriverDetail from "./component/Profile/User/HistoryPostDriverDetail";

const AppContent = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const location = useLocation();

  const isDashboardPage =
    location.pathname === "/dashboard-admin" ||
    location.pathname.startsWith("/dashboard-admin/") ||
    location.pathname.startsWith("/driverDetailManagement");

  return (
    <>
      {!isDashboardPage && <Navbar openModal={openModal} />}
      <Switch>
        <Route path="/signup" exact component={SignUp} />
        <Route path="/signin" exact component={SignIn} />
        <Route path="/accountType" exact component={AccountTypes} />
        <Route path="/signUp-customer" exact component={SignUpCustomerPage} />
        <Route path="/privacyPolicy" exact component={PrivacyPolicy} />
        <Route path="/terms" exact component={TermsCondition} />
        <Route path="/contact" exact component={Contact} />
        <Route path="/" exact component={Home_One} />
        <Route path="/about" exact component={About} />
        <Route path="/order" exact component={Service} />
        <Route path="/post-driver" component={Post} />
        <Route path="/order/:id" extract component={ServiceDetail} />
        <Route path="/history-post/:id" extract component={HistoryPostDetail} />
        <Route path="/order_details" exact component={ServiceDetails} />
        <Route path="/blog_grid" exact component={BlogGrid} />
        <Route path="/blog_with_sidebar" exact component={BlogWithSidebar} />
        <Route path="/blog_details" exact component={BlogDetails} />
        <Route path="/blog/:id" extract component={BlogDetail} />
        <Route path="/our_team" exact component={OurTeamArea} />
        <Route path="/testimonials" exact component={Testimonials} />
        <Route path="/gallery" exact component={Gallery} />
        <Route path="/faqs" exact component={Faqs} />
        <Route path="/track_ship" exact component={TrackYourShip} />
        <Route path="/pricing" exact component={PricingContent} />
        <Route path="/unauthorized" exact component={Unauthorized} />
        <Route path="/vehical/detail/:id" exact component={VehicalDetail} />
        <Route path="/vehical/add" exact component={VehicalAdd} />
        <Route path="/forgot-password" exact component={ForgotPassword} />
        <Route path="/reset-password" exact component={ResetPassword} />
        <Route path="/error" exact component={Error} />
        <Route path="/favorite-drivers" exact component={FavoriteDrivers} />
        <Route path="/driver/:driverId" exact component={DriverDetail} />
        <Route path="/trip/detail/:id" exact component={TripDetail} />
        <Route path="/payment/success" exact component={PaymentSuccess} />
        <Route path="/payment/failed" exact component={PaymentFailed} />
        <Route path="/chat/:id?" exact component={Chat} />
        <Route
          path="/history-post-driver/detail/:postId"
          exact
          component={HistoryPostDriverDetail}
        />
        <Route
          path="/history-post-driver-add"
          exact
          component={HistoryPostDriverDetail}
        />
        <Route
          path="/history-post-driver"
          exact
          component={HistoryPostDriver}
        />
        <ProtectedRoute
          path="/request_quote"
          exact
          component={RequestQuote}
          allowedRoles={["customer", "personal", "business"]}
        />
        <ProtectedRoute
          path="/profile"
          exact
          component={Profile}
          allowedRoles={["customer", "personal", "business  "]}
        />

        <ProtectedRoute
          path="/driverDetailManagement/:driverId"
          exact
          component={DriverDetailManagement}
          allowedRoles={["admin", "staff"]}
        />
        <ProtectedRoute
          path="/dashboard-admin"
          exact
          component={Admin}
          allowedRoles={["admin", "staff", "customer"]}
        />
        <ProtectedRoute
          path="/confirm-withdraw"
          exact
          component={ConfirmWithDraw}
          allowedRoles={["admin", "staff"]}
        />
        <ProtectedRoute
          path="/dashboard-admin/customers"
          exact
          component={CustomerManagement}
          allowedRoles={["admin", "staff"]}
        />
        <ProtectedRoute
          path="/dashboard-admin/drivers"
          exact
          component={DriverManagement}
          allowedRoles={["admin", "staff"]}
        />
        <ProtectedRoute
          path="/dashboard-admin/staffs"
          exact
          component={StaffManagement}
          allowedRoles={["admin", "staff"]}
        />
        <ProtectedRoute
          path="/dashboard-admin/vehicle"
          exact
          component={VehicleManager}
          allowedRoles={["admin", "staff"]}
        />
      </Switch>
      {!isDashboardPage && <Footer />}
      {!isDashboardPage && <CopyRight />}
      <CustomModal isOpen={isOpen} closeModal={closeModal} />
    </>
  );
};

const App = () => (
  <WebSocketProvider>
    <Router>
      <ScrollToTop>
        <AppContent />
      </ScrollToTop>
      <ToastContainer />
    </Router>
  </WebSocketProvider>
);

export default App;
