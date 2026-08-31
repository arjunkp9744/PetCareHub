
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaPaw,
  FaSearch,
  FaSyringe,
  FaWeight,
  FaVenusMars,
  FaBirthdayCake,
  FaEdit,
  FaTrash,
  FaEye,
  FaDog,
  FaCat,
  FaDove,
} from "react-icons/fa";

import api from "../services/api";
import "./PetsPage.css";

function PetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] =
    useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("pets/");

      const petData =
        response.data.results ||
        response.data;

      setPets(petData);
    } catch (error) {
      console.error(
        "Unable to load pets:",
        error.response?.data || error.message
      );

      setError("Unable to load your pets.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * Calculate pet age from date of birth.
   */
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) {
      return null;
    }

    const birthDate = new Date(dateOfBirth);
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
        years === 1 ? "year" : "years"
      }`;
    }

    if (months > 0) {
      return `${months} ${
        months === 1 ? "month" : "months"
      }`;
    }

    return "Less than a month";
  };

  /*
   * Get unique species.
   */
  const speciesList = useMemo(() => {
    const species = new Set();

    pets.forEach((pet) => {
      if (pet.species) {
        species.add(pet.species);
      }
    });

    return Array.from(species);
  }, [pets]);

  /*
   * Filter pets.
   */
  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        pet.name
          ?.toLowerCase()
          .includes(searchText) ||
        pet.species
          ?.toLowerCase()
          .includes(searchText) ||
        pet.breed
          ?.toLowerCase()
          .includes(searchText);

      const matchesSpecies =
        speciesFilter === "All" ||
        String(pet.species).toLowerCase() ===
          String(speciesFilter).toLowerCase();

      return (
        matchesSearch &&
        matchesSpecies
      );
    });
  }, [
    pets,
    search,
    speciesFilter,
  ]);

  /*
   * Statistics.
   */
  const totalPets = pets.length;

  const vaccinatedPets = pets.filter(
    (pet) => pet.vaccination_status
  ).length;

  const speciesCount = new Set(
    pets
      .map((pet) => pet.species)
      .filter(Boolean)
  ).size;

  /*
   * Species icon.
   */
  const getSpeciesIcon = (species) => {
    const value =
      String(species).toLowerCase();

    if (value.includes("dog")) {
      return <FaDog />;
    }

    if (value.includes("cat")) {
      return <FaCat />;
    }

    if (value.includes("bird")) {
      return <FaDove />;
    }

    return <FaPaw />;
  };

  /*
   * Delete pet.
   */
  const handleDelete = async (pet) => {
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

      setPets((currentPets) =>
        currentPets.filter(
          (item) => item.id !== pet.id
        )
      );
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
      <div className="pets-page">

        <div className="container">

          <div className="pets-loading">

            <div className="pets-loading-icon">
              🐾
            </div>

            <h3>
              Loading your pets...
            </h3>

            <p>
              Getting your furry friends ready.
            </p>

          </div>

        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="pets-page">

        <div className="container">

          <div className="pets-error">

            <div className="pets-error-icon">
              😿
            </div>

            <h3>
              Something went wrong
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={loadPets}
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="pets-page">

      <div className="container">

        {/* ================= HERO ================= */}

        <section className="pets-hero">

          <div className="pets-hero-content">

            <span className="pets-eyebrow">
              🐾 PETCARE HUB
            </span>

            <h1>
              Meet Your
              <span> Best Friends</span>
            </h1>

            <p>
              Keep all your pets' information,
              health details, and important
              records organized in one place.
            </p>

            <button
              type="button"
              className="pets-add-button"
              onClick={() =>
                navigate("/pets/add")
              }
            >
              <FaPlus />
              Add New Pet
            </button>

          </div>

          <div className="pets-hero-animals">
            <span>🐶</span>
            <span>🐱</span>
            <span>🐦</span>
          </div>

        </section>

        {/* ================= STATS ================= */}

        <section className="pets-stats">

          <div className="pet-stat-card">

            <div className="pet-stat-icon">
              <FaPaw />
            </div>

            <div>
              <strong>
                {totalPets}
              </strong>

              <span>
                Total Pets
              </span>
            </div>

          </div>

          <div className="pet-stat-card">

            <div className="pet-stat-icon">
              <FaDog />
            </div>

            <div>
              <strong>
                {speciesCount}
              </strong>

              <span>
                Species
              </span>
            </div>

          </div>

          <div className="pet-stat-card">

            <div className="pet-stat-icon">
              <FaSyringe />
            </div>

            <div>
              <strong>
                {vaccinatedPets}
              </strong>

              <span>
                Vaccinated
              </span>
            </div>

          </div>

        </section>

        {/* ================= TOOLBAR ================= */}

        {pets.length > 0 && (
          <section className="pets-toolbar">

            <div className="pets-search">

              <FaSearch />

              <input
                type="text"
                placeholder="Search your pets..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="pets-filter">

              <select
                value={speciesFilter}
                onChange={(event) =>
                  setSpeciesFilter(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Species
                </option>

                {speciesList.map(
                  (species) => (
                    <option
                      key={species}
                      value={species}
                    >
                      {species}
                    </option>
                  )
                )}

              </select>

            </div>

          </section>
        )}

        {/* ================= PETS ================= */}

        <section className="pets-section">

          <div className="pets-section-heading">

            <div>

              <span>
                YOUR COMPANIONS
              </span>

              <h2>
                My Pets
              </h2>

            </div>

            {pets.length > 0 && (
              <p>
                Showing{" "}
                <strong>
                  {filteredPets.length}
                </strong>{" "}
                of {pets.length} pets
              </p>
            )}

          </div>

          {pets.length === 0 ? (

            <div className="pets-empty">

              <div className="pets-empty-animals">
                🐶 🐱 🐦
              </div>

              <h2>
                No pets added yet
              </h2>

              <p>
                Add your first pet and keep
                their important information
                organized with PetCare Hub.
              </p>

              <button
                type="button"
                className="pets-add-button"
                onClick={() =>
                  navigate("/pets/add")
                }
              >
                <FaPlus />
                Add Your First Pet
              </button>

            </div>

          ) : filteredPets.length === 0 ? (

            <div className="pets-empty">

              <div className="pets-empty-icon">
                🔍
              </div>

              <h2>
                No pets found
              </h2>

              <p>
                Try changing your search
                or species filter.
              </p>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {
                  setSearch("");
                  setSpeciesFilter("All");
                }}
              >
                Show All Pets
              </button>

            </div>

          ) : (

            <div className="pets-grid">

              {filteredPets.map((pet) => {

                const age =
                  calculateAge(
                    pet.date_of_birth
                  );

                return (
                  <article
                    className="pet-card"
                    key={pet.id}
                  >

                    {/* IMAGE */}

                    <div className="pet-card-image">

                      {pet.image ? (

                        <img
                          src={pet.image}
                          alt={pet.name}
                        />

                      ) : (

                        <div className="pet-placeholder">
                          {getSpeciesIcon(
                            pet.species
                          )}
                        </div>

                      )}

                      <div className="pet-species-badge">
                        {getSpeciesIcon(
                          pet.species
                        )}

                        <span>
                          {pet.species}
                        </span>
                      </div>

                    </div>

                    {/* BODY */}

                    <div className="pet-card-body">

                      <div className="pet-card-title-row">

                        <div>

                          <h3>
                            {pet.name}
                          </h3>

                          <p>
                            {pet.breed ||
                              "Breed not specified"}
                          </p>

                        </div>

                      </div>

                      {/* DETAILS */}

                      <div className="pet-details-grid">

                        {age && (
                          <div className="pet-detail">

                            <FaBirthdayCake />

                            <div>
                              <small>
                                Age
                              </small>

                              <strong>
                                {age}
                              </strong>
                            </div>

                          </div>
                        )}

                        {pet.gender && (
                          <div className="pet-detail">

                            <FaVenusMars />

                            <div>
                              <small>
                                Gender
                              </small>

                              <strong>
                                {pet.gender}
                              </strong>
                            </div>

                          </div>
                        )}

                        {pet.weight && (
                          <div className="pet-detail">

                            <FaWeight />

                            <div>
                              <small>
                                Weight
                              </small>

                              <strong>
                                {pet.weight} kg
                              </strong>
                            </div>

                          </div>
                        )}

                        {pet.color && (
                          <div className="pet-detail">

                            <FaPaw />

                            <div>
                              <small>
                                Color
                              </small>

                              <strong>
                                {pet.color}
                              </strong>
                            </div>

                          </div>
                        )}

                      </div>

                      {/* VACCINATION */}

                      <div
                        className={`vaccination-status ${
                          pet.vaccination_status
                            ? "vaccinated"
                            : "not-vaccinated"
                        }`}
                      >

                        <FaSyringe />

                        <span>
                          {pet.vaccination_status
                            ? "Vaccination Up to Date"
                            : "Vaccination Needed"}
                        </span>

                      </div>

                      {/* ACTIONS */}

                      <div className="pet-card-actions">

                        <button
                          type="button"
                          className="pet-view-button"
                          onClick={() =>
                            navigate(
                              `/pets/${pet.id}`
                            )
                          }
                        >
                          <FaEye />
                          View Details
                        </button>

                        <button
                          type="button"
                          className="pet-edit-button"
                          onClick={() =>
                            navigate(
                              `/pets/${pet.id}/edit`
                            )
                          }
                          title="Edit pet"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          className="pet-delete-button"
                          onClick={() =>
                            handleDelete(pet)
                          }
                          title="Delete pet"
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

          )}

        </section>

      </div>

    </div>
  );
}

export default PetsPage;
