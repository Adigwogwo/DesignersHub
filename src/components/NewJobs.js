import React from "react";

import { useState } from "react";

export const Uploadjobs = (props) => {
 
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
 

  const submitHandler = (e) => {
    e.preventDefault();

    if (
      !name ||
      !description
     
    ) {
      alert("Please fill up all fields");
      return;
    }
    props.uploadJobs(
      name,
      description
    );

    setName("");
    setDescription("");
  };

  return (
    <div className="container mt-3">
      <form onSubmit={submitHandler}>
        <div className="row">
          
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
              placeholder="description"
              name="online portfolio"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="form-row">
          <button type="submit" className="btn btn-outline-success bot">
            Upload Jobs
          </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Uploadjobs;
