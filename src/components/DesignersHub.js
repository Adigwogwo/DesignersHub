import React from "react";
import { useState } from "react";

export const Designs = (props) => {
  const [ammount, setAmmount] = useState("");

  return (
    <div className="row pt-4">
      {props.designs.map((design) => (
        <div className="col-4">
          <div className="card" key={design.index}>
            <img
              className="card-img-top"
              src={design.image}
              alt="Card image cap"
            />
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
                Ticket Price{" "}
                <span className="badge badge-secondary">
                  {design.price / 1000000000000000000} cUSD
                </span>
              </h1>
              <h5 className="card-title">{design.designTeam} Design Team</h5>

              {props.walletAddress === design.owner && (
                <form>
                  <div className="form-r">
                    <input
                      type="text"
                      className="form-control mt-4"
                      value={ammount}
                      onChange={(e) => setAmmount(e.target.value)}
                      placeholder="enter ammount"
                    />
                    <button
                      type="button"
                      onClick={() => props.removeDesigns(design.index, ammount)}
                      className="btn btn-outline-info mt-2"
                    >
                      remove designs
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Designs;
