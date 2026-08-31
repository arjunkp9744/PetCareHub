import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddPetPage() {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");
  const [vaccinationStatus, setVaccinationStatus] = useState(false);
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);


  const handleAddPet = async (e) => {
  e.preventDefault();

  setSubmitting(true);

  try {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("species", species);
    formData.append("breed", breed);
    formData.append("gender", gender);
    formData.append("color", color);
    formData.append(
      "vaccination_status",
      vaccinationStatus
    );
    formData.append("notes", notes);

    if (dateOfBirth) {
      formData.append(
        "date_of_birth",
        dateOfBirth
      );
    }

    if (weight) {
      formData.append("weight", weight);
    }

    if (image) {
      formData.append("image", image);
    }

    const response = await api.post(
      "pets/",
      formData
    );

    console.log(
      "Pet created:",
      response.data
    );

    alert("Pet added successfully!");

    navigate("/pets");

  } catch (error) {
    console.error(
      "Unable to add pet:",
      error.response?.data || error.message
    );

    alert("Unable to add pet.");

  } finally {
    setSubmitting(false);
  }
};

  return (
  <div
    className="container mt-5"
    style={{ maxWidth: "650px" }}
  >
    <h2 className="mb-4">Add Pet</h2>

    <form onSubmit={handleAddPet}>
      <div className="mb-3">
        <label className="form-label">Pet Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
            Pet Photo
        </label>

        <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) =>
            setImage(e.target.files[0])
            }
        />
        </div>

      <div className="mb-3">
        <label className="form-label">Species</label>
        <input
          type="text"
          className="form-control"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          placeholder="Dog, Cat, Bird..."
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Breed</label>
        <input
          type="text"
          className="form-control"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Gender</label>
        <select
          className="form-select"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">
          Date of Birth
        </label>
        <input
          type="date"
          className="form-control"
          value={dateOfBirth}
          onChange={(e) =>
            setDateOfBirth(e.target.value)
          }
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Weight (kg)
        </label>
        <input
          type="number"
          step="0.01"
          className="form-control"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Color</label>
        <input
          type="text"
          className="form-control"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          checked={vaccinationStatus}
          onChange={(e) =>
            setVaccinationStatus(e.target.checked)
          }
        />

        <label className="form-check-label">
          Vaccinated
        </label>
      </div>

      <div className="mb-3">
        <label className="form-label">Notes</label>
        <textarea
          className="form-control"
          rows="3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={submitting}
        >
        {submitting ? "Adding Pet..." : "Add Pet"}
      </button>
    </form>
  </div>
);
}

export default AddPetPage;