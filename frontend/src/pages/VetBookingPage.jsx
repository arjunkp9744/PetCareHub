import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function VetBookingPage() {
  const [pets, setPets] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);

  const [petId, setPetId] = useState("");
  const [clinicId, setClinicId] = useState("");
  const [veterinarianId, setVeterinarianId] = useState("");

  const [appointmentDate, setAppointmentDate] =
    useState("");

  const [appointmentTime, setAppointmentTime] =
    useState("");

  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] =
    useState(false);
    
    const navigate = useNavigate();

   useEffect(() => {
  api
    .get("pets/")
    .then((response) => {
      const petData =
        response.data.results || response.data;

      setPets(petData);
    })
    .catch((error) => {
      console.error(
        "Unable to load pets:",
        error.response?.data || error.message
      );
    });

  api
    .get("appointments/clinics/")
    .then((response) => {
      const clinicData =
        response.data.results || response.data;

      setClinics(clinicData);
    })
    .catch((error) => {
      console.error(
        "Unable to load clinics:",
        error.response?.data || error.message
      );
    });
}, []); 

  useEffect(() => {
  if (!clinicId) {
    setVeterinarians([]);
    setVeterinarianId("");
    return;
  }

  api
    .get(
      `appointments/veterinarians/?clinic=${clinicId}`
    )
    .then((response) => {
      const veterinarianData =
        response.data.results || response.data;

      setVeterinarians(veterinarianData);
      setVeterinarianId("");
    })
    .catch((error) => {
      console.error(
        "Unable to load veterinarians:",
        error.response?.data || error.message
      );
    });
}, [clinicId]);

const handleBooking = async (e) => {
  e.preventDefault();

  setSubmitting(true);

  try {
    const data = {
      pet: petId,
      clinic: clinicId,
      veterinarian: veterinarianId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      reason: reason,
      notes: notes,
    };

    const response = await api.post(
      "appointments/",
      data
    );

    console.log(
      "Appointment created:",
      response.data
    );

    alert("Appointment booked successfully!");

    navigate("/appointments");

  } catch (error) {
    console.error(
      "Unable to book appointment:",
      error.response?.data || error.message
    );

    alert("Unable to book appointment.");

  } finally {
    setSubmitting(false);
  }
};

 return (
  <div
    className="container mt-5"
    style={{ maxWidth: "700px" }}
  >
    <h2 className="mb-4">
      Book Veterinary Appointment
    </h2>

   <form onSubmit={handleBooking}>
      <div className="mb-3">
        <label className="form-label">
          Select Pet
        </label>

        <select
          className="form-select"
          value={petId}
          onChange={(e) =>
            setPetId(e.target.value)
          }
          required
        >
          <option value="">
            Select your pet
          </option>

          {pets.map((pet) => (
            <option
              key={pet.id}
              value={pet.id}
            >
              {pet.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">
          Select Clinic
        </label>

        <select
          className="form-select"
          value={clinicId}
          onChange={(e) =>
            setClinicId(e.target.value)
          }
          required
        >
          <option value="">
            Select clinic
          </option>

          {clinics.map((clinic) => (
            <option
              key={clinic.id}
              value={clinic.id}
            >
              {clinic.name} - {clinic.city}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">
          Select Veterinarian
        </label>

        <select
          className="form-select"
          value={veterinarianId}
          onChange={(e) =>
            setVeterinarianId(e.target.value)
          }
          disabled={!clinicId}
          required
        >
          <option value="">
            Select veterinarian
          </option>

          {veterinarians.map((vet) => (
            <option
              key={vet.id}
              value={vet.id}
            >
              {vet.full_name}
              {vet.specialization
                ? ` - ${vet.specialization}`
                : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">
          Appointment Date
        </label>

        <input
          type="date"
          className="form-control"
          value={appointmentDate}
          onChange={(e) =>
            setAppointmentDate(e.target.value)
          }
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Appointment Time
        </label>

        <input
          type="time"
          className="form-control"
          value={appointmentTime}
          onChange={(e) =>
            setAppointmentTime(e.target.value)
          }
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Reason
        </label>

        <input
          type="text"
          className="form-control"
          value={reason}
          onChange={(e) =>
            setReason(e.target.value)
          }
          placeholder="Vaccination, check-up, injury..."
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Notes
        </label>

        <textarea
          className="form-control"
          rows="3"
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
        />
      </div>

      <button
        type="submit"
        className="btn btn-success w-100"
        disabled={submitting}
      >
        {submitting
          ? "Booking..."
          : "Book Appointment"}
      </button>
    </form>
  </div>
);
}

export default VetBookingPage;