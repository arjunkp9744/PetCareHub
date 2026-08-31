import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AppointmentsPage() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("appointments/")
      .then((response) => {
        const appointmentData =
          response.data.results || response.data;

        setAppointments(appointmentData);
      })
      .catch((error) => {
        console.error(
          "Unable to load appointments:",
          error.response?.data || error.message
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <h4>Loading appointments...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Appointments</h2>

        <button
          className="btn btn-success"
          onClick={() => navigate("/vet-booking")}
        >
          + Book Appointment
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="alert alert-info">
          You don't have any appointments yet.
        </div>
      ) : (
        <div className="row">
          {appointments.map((appointment) => (
            <div
              className="col-md-6 mb-4"
              key={appointment.id}
            >
              <div className="card shadow-sm h-100">
                <div className="card-body">

                  <h5 className="card-title">
                    {appointment.pet_name}
                  </h5>

                  <p>
                    <strong>Clinic:</strong>{" "}
                    {appointment.clinic_name}
                  </p>

                  <p>
                    <strong>Veterinarian:</strong>{" "}
                    {appointment.veterinarian_name}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {appointment.appointment_date}
                  </p>

                  <p>
                    <strong>Time:</strong>{" "}
                    {appointment.appointment_time}
                  </p>

                  <p>
                    <strong>Reason:</strong>{" "}
                    {appointment.reason}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="badge bg-primary">
                      {appointment.status}
                    </span>
                  </p>

                  {appointment.notes && (
                    <p className="text-muted">
                      <strong>Notes:</strong>{" "}
                      {appointment.notes}
                    </p>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;