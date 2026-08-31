
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaPaw,
  FaSyringe,
  FaWeight,
  FaVenusMars,
  FaBirthdayCake,
  FaPalette,
  FaCalendarAlt,
  FaClinicMedical,
} from "react-icons/fa";

import api from "../services/api";
import "./PetDetailsPage.css";

function PetDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [vaccinations, setVaccinations] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPetDetails();
    loadVaccinations();
  }, [id]);

  const loadPetDetails = async () => {
    try {
      const response = await api.get(
        `pets/${id}/`
      );

      setPet(response.data);
    } catch (error) {
      console.error(
        "Unable to load pet:",
        error.response?.data || error.message
      );

      setError(
        "Unable to load pet details."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadVaccinations = async () => {
    try {
      const response = await api.get(
        `pets/vaccinations/?pet=${id}`
      );

      const data =
        response.data.results ||
        response.data;

      setVaccinations(data);
    } catch (error) {
      console.error(
        "Unable to load vaccinations:",
        error.response?.data || error.message
      );
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) {
      return "Not specified";
    }

    const birthDate =
      new Date(dateOfBirth);

    const today = new Date();

    let years =
      today.getFullYear() -
      birthDate.getFullYear();

    let months =
      today.getMonth() -
      birthDate.getMonth();

    if (
      months < 0 ||
      (
        months === 0 &&
        today.getDate() <
          birthDate.getDate()
      )
    ) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years} ${
        years === 1
          ? "year"
          : "years"
      }`;
    }

    if (months > 0) {
      return `${months} ${
        months === 1
          ? "month"
          : "months"
      }`;
    }

    return "Less than a month";
  };

  const handleDelete = async () => {
    if (!pet) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${pet.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `pets/${pet.id}/`
      );

      alert(
        `${pet.name} has been deleted.`
      );

      navigate("/pets");

    } catch (error) {
      console.error(
        "Unable to delete pet:",
        error.response?.data || error.message
      );

      alert(
        "Unable to delete this pet."
      );
    }
  };

  if (loading) {
    return (
      <div className="pet-details-page">

        <div className="pet-details-loading">

          <div className="pet-details-loading-icon">
            🐾
          </div>

          <h3>
            Loading pet details...
          </h3>

        </div>

      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="pet-details-page">

        <div className="pet-details-error">

          <div>
            😿
          </div>

          <h3>
            {error ||
              "Pet not found."}
          </h3>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              navigate("/pets")
            }
          >
            Back to My Pets
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="pet-details-page">

      <div className="container">

        {/* BACK */}

        <button
          type="button"
          className="pet-back-button"
          onClick={() =>
            navigate("/pets")
          }
        >
          <FaArrowLeft />
          Back to My Pets
        </button>

        {/* ================= PROFILE ================= */}

        <section className="pet-profile-card">

          <div className="pet-profile-image">

            {pet.image ? (

              <img
                src={pet.image}
                alt={pet.name}
              />

            ) : (

              <div className="pet-profile-placeholder">
                <FaPaw />
              </div>

            )}

          </div>

          <div className="pet-profile-info">

            <div className="pet-profile-species">
              🐾 {pet.species}
            </div>

            <h1>
              {pet.name}
            </h1>

            <p className="pet-profile-breed">
              {pet.breed ||
                "Breed not specified"}
            </p>

            <div className="pet-profile-status">

              {pet.vaccination_status ? (

                <span className="status vaccinated">
                  <FaSyringe />
                  Vaccinated
                </span>

              ) : (

                <span className="status not-vaccinated">
                  <FaSyringe />
                  Vaccination Needed
                </span>

              )}

            </div>

            <div className="pet-profile-actions">

              <button
                type="button"
                className="pet-edit-main"
                onClick={() =>
                  navigate(
                    `/pets/${pet.id}/edit`
                  )
                }
              >
                <FaEdit />
                Edit Pet
              </button>

              <button
                type="button"
                className="pet-delete-main"
                onClick={handleDelete}
              >
                <FaTrash />
                Delete
              </button>

            </div>

          </div>

        </section>

        {/* ================= BASIC INFO ================= */}

        <section className="details-section">

          <div className="details-section-heading">

            <span>
              PET INFORMATION
            </span>

            <h2>
              About {pet.name}
            </h2>

          </div>

          <div className="details-info-grid">

            <div className="details-info-card">

              <div className="details-info-icon">
                <FaBirthdayCake />
              </div>

              <div>
                <small>
                  Age
                </small>

                <strong>
                  {calculateAge(
                    pet.date_of_birth
                  )}
                </strong>
              </div>

            </div>

            <div className="details-info-card">

              <div className="details-info-icon">
                <FaVenusMars />
              </div>

              <div>
                <small>
                  Gender
                </small>

                <strong>
                  {pet.gender ||
                    "Not specified"}
                </strong>
              </div>

            </div>

            <div className="details-info-card">

              <div className="details-info-icon">
                <FaWeight />
              </div>

              <div>
                <small>
                  Weight
                </small>

                <strong>
                  {pet.weight
                    ? `${pet.weight} kg`
                    : "Not specified"}
                </strong>
              </div>

            </div>

            <div className="details-info-card">

              <div className="details-info-icon">
                <FaPalette />
              </div>

              <div>
                <small>
                  Color
                </small>

                <strong>
                  {pet.color ||
                    "Not specified"}
                </strong>
              </div>

            </div>

            <div className="details-info-card">

              <div className="details-info-icon">
                <FaCalendarAlt />
              </div>

              <div>
                <small>
                  Date of Birth
                </small>

                <strong>
                  {pet.date_of_birth ||
                    "Not specified"}
                </strong>
              </div>

            </div>

          </div>

        </section>

        {/* ================= VACCINATION ================= */}

        <section className="details-section">

          <div className="details-section-heading vaccination-heading">

            <div>

              <span>
                HEALTH RECORDS
              </span>

              <h2>
                Vaccination History
              </h2>

            </div>

            <div
              className={`vaccination-summary ${
                pet.vaccination_status
                  ? "vaccination-good"
                  : "vaccination-warning"
              }`}
            >
              <FaSyringe />

              {pet.vaccination_status
                ? "Vaccinations Up to Date"
                : "Vaccination Needed"}

            </div>

          </div>

          {vaccinations.length === 0 ? (

            <div className="vaccination-empty">

              <FaSyringe />

              <h4>
                No vaccination records
              </h4>

              <p>
                No vaccination history has
                been added for {pet.name} yet.
              </p>

            </div>

          ) : (

            <div className="vaccination-list">

              {vaccinations.map(
                (vaccination) => (

                  <div
                    className="vaccination-card"
                    key={vaccination.id}
                  >

                    <div className="vaccination-icon">
                      <FaSyringe />
                    </div>

                    <div className="vaccination-main">

                      <h4>
                        {vaccination.vaccine_name}
                      </h4>

                      <div className="vaccination-details">

                        <span>
                          <FaCalendarAlt />
                          Vaccinated:{" "}
                          {vaccination.vaccination_date}
                        </span>

                        {vaccination.next_due_date && (
                          <span>
                            <FaCalendarAlt />
                            Next Due:{" "}
                            {vaccination.next_due_date}
                          </span>
                        )}

                        {vaccination.clinic_name && (
                          <span>
                            <FaClinicMedical />
                            {vaccination.clinic_name}
                          </span>
                        )}

                      </div>

                      {vaccination.notes && (
                        <p>
                          {vaccination.notes}
                        </p>
                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* ================= NOTES ================= */}

        {pet.notes && (

          <section className="details-section">

            <div className="details-section-heading">

              <span>
                PERSONAL NOTES
              </span>

              <h2>
                About {pet.name}
              </h2>

            </div>

            <div className="pet-notes">

              <FaPaw />

              <p>
                {pet.notes}
              </p>

            </div>

          </section>

        )}

      </div>

    </div>
  );
}

export default PetDetailsPage;
