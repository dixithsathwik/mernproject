import './App.css'; // Make sure this is at the top of your App.js file

import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const mystyle = {
    backgroundImage: 'url(docimg1.jpg)',
    backgroundSize: 'cover',  // Fixed background size issue
    height: '150vh',
    backgroundPosition: 'center',  // Ensures background is centered
    backgroundRepeat: 'no-repeat' // Prevents repetition
  };

  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    specialization: "",
    phone_number: "",
    location: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:8001/getAlldoctors");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addDoctor = async () => {
    try {
      const response = await axios.post("http://localhost:8001/insertDoctor", form);
      setDoctors([...doctors, response.data]);
      setForm({ id: "", name: "", specialization: "", phone_number: "", location: "" });
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  const updateDoctor = async (id) => {
    try {
      await axios.put("http://localhost:8001/updateData", { ...form, id });
      fetchDoctors();
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await axios.delete(`http://localhost:8001/deleteRecord/${id}`);
      fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  return (
    <div style={mystyle}>
      <h1>Doctor Management</h1>

      <div>
        <h2>Add or Update Doctor</h2>
        <input name="id" value={form.id} onChange={handleChange} placeholder="ID" />
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="Specialization" />
        <input name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="Phone Number" />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
        <button onClick={addDoctor}>Add Doctor</button>
        <button onClick={() => updateDoctor(form.id)}>Update Doctor</button>
      </div>

      <h2>Doctors List</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialization</th>
            <th>Phone Number</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id}>
              <td>{doctor.id}</td>
              <td>{doctor.name}</td>
              <td>{doctor.specialization}</td>
              <td>{doctor.phone_number}</td>
              <td>{doctor.location}</td>
              <td>
                <button onClick={() => deleteDoctor(doctor.id)} className="delete-button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
