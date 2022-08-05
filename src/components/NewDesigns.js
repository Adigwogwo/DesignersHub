import React from "react";

import { useState } from "react";

export const UploadDesignjobs = (props) => {
  const [expertise, setExpertise] = useState("");
  const [name, setName] = useState("");
  const [onlinePortfolio, setOnlinePortfolio] = useState("");
  const [location, setLocation] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [price, setPrice] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    if (
      !expertise ||
      !name ||
      !onlinePortfolio ||
      !location ||
      !yearsExperience ||
      !price
    ) {
      alert("Please fill up all fields");
      return;
    }
    props.uploadDesignjobs(
      expertise,
      name,
      onlinePortfolio,
      location,
      yearsExperience,
      price
    );

    setExpertise("");
    setName("");
    setOnlinePortfolio("");
    setLocation("");
    setYearsExperience("");
    setPrice("");
  };

  return (
    <div className="container mt-3">
      <form onSubmit={submitHandler}>
        <div className="row">
          <div class="form-row">
            <input
              type="text"
              className="form-control"
              placeholder="Enter expertise"
              name="expertise"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
            />
          </div>
          <div class="form-row">
            <input
              type="text"
              className="form-control"
              placeholder="Enter name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div class="form-row">
            <input
              type="text"
              className="form-control"
              placeholder="Enter online portfolio"
              name="online portfolio"
              value={onlinePortfolio}
              onChange={(e) => setOnlinePortfolio(e.target.value)}
            />
          </div>
          <div class="form-row">
            <input
              type="text"
              className="form-control"
              placeholder="Enter location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div class="form-row">
            <input
              type="text"
              className="form-control"
              placeholder="Enter years experience"
              name="years experience"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
            />
          </div>
          <div class="form-row">
            <input
              type="text"
              className="form-control"
              placeholder="Enter price"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="form-row">
          <button type="submit" className="btn btn-outline-success bot">
            Upload Design Jobs
          </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default UploadDesignjobs;
