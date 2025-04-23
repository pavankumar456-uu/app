import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./Component/Homepage";
import Login from "./Component/Login";
import SignUp from "./Component/SignUp";
import DoctorSchedule from "./Component/DoctorSchedule";
import BookAppointment from "./Component/BookAppointment";
import ViewAppointments from "./Component/ViewAppointment";
import PatientDashboard from "./Component/PatientDashboard";
import Patient from "./Component/Patient";
import DoctorScheduleDashboard from "./Component/DoctorScheduleDashboard";
import AddMedicalHistory from "./Component/AddMedicalHistory";
import TreatmentDetails from "./Component/TreatmentDetails";
// import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Patient Routes */}
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/add-patient" element={<Patient />} />
          <Route path="/viewappointments" element={<ViewAppointments />} />
          <Route path="/bookappointment" element={<BookAppointment />} />

          {/* Doctor Routes */}
          <Route path="/doctorscheduledashboard" element={<DoctorScheduleDashboard />} />
          <Route path="/doctorschedule" element={<DoctorSchedule />} />
          <Route path="/addmedicalhistory" element={<AddMedicalHistory />} />
          <Route path="/treatmentdetails" element={<TreatmentDetails />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;