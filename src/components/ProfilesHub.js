import React from "react";
import { useState } from "react";

export const Profiles = (props) => {


  return (
    <div className="row pt-4">
       <h1 className="title">
                Profiles
              </h1>
      {props.profiles.map((design) => (
        <div className="col-4">
          <div className="card" key={design.index}>
          <h2 className="card-title">
                Designer Id: {design.index}
              </h2>
            
            <div className="card-body">
              <h5 className="card-title">
                Designer Expertise: {design.expertise}
              </h5>
              <h5 className="card-title">Designer Name: {design.name}</h5>
              <h5 className="card-title">
                Online Portfolio: {design.onlinePortfolio}
              </h5>
              <h5 classname="card-title">
                designer Location: {design.location}
              </h5>
              <h5 className="card-title">
                {design.yearsExperience} Designer Years Experience
              </h5>
              <h1>
               Price: {design.price / 1000000000000000000} cUSD
              </h1>
              <h5 className="card-title"> {design.onContract}  Design Team</h5>

              {props.walletAddress === design.designer && (
                    <button
                      type="button"
                      className="btn btn-outline-info mt-2"
                      onClick={() => props.removeProfile(design.index)}
                    >
                      remove design
                    </button>
                  
              )}

                 
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Profiles;
