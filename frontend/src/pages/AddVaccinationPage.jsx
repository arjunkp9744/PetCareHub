import { useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";

function AddVaccinationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vaccineName, setVaccineName] =
    useState("");

  const [vaccinationDate, setVaccinationDate] =
    useState("");

  const [nextDueDate, setNextDueDate] =
    useState("");

  const [clinicName, setClinicName] =
    useState("");

  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  setSubmitting(true);

  try {
    const data = {
      pet: id,
      vaccine_name: vaccineName,
      vaccination_date: vaccinationDate,
      next_due_date: nextDueDate || null,
      clinic_name: clinicName,
      notes: notes,
    };

    const response = await api.post(
      "pets/vaccinations/",
      data
    );

    console.log(
      "Vaccination created:",
      response.data
    );

    alert("Vaccination added successfully!");

    navigate(`/pets/${id}`);

  } catch (error) {
    console.error(
      "Unable to add vaccination:",
      error.response?.data || error.message
    );

    alert("Unable to add vaccination.");

  } finally {
    setSubmitting(false);
  }
};  

  return (
    <div
      className="container mt-5"
      style={{ maxWidth: "650px" }}
    >
      <h2 className="mb-4">
        Add Vaccination
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            Vaccine Name
          </label>

          <input
            type="text"
            className="form-control"
            value={vaccineName}
            onChange={(e) =>
              setVaccineName(e.target.value)
            }
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Vaccination Date
          </label>

          <input
            type="date"
            className="form-control"
            value={vaccinationDate}
            onChange={(e) =>
              setVaccinationDate(e.target.value)
            }
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Next Due Date
          </label>

          <input
            type="date"
            className="form-control"
            value={nextDueDate}
            onChange={(e) =>
              setNextDueDate(e.target.value)
            }
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Clinic Name
          </label>

          <input
            type="text"
            className="form-control"
            value={clinicName}
            onChange={(e) =>
              setClinicName(e.target.value)
            }
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
            ? "Adding..."
            : "Add Vaccination"}
        </button>
      </form>
    </div>
  );
}

export default AddVaccinationPage;