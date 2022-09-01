import React from "react";
import { useState } from "react";

export const Projects = (props) => {

    const [address, setAddress] = useState(null);


  return (
    <div className="row pt-4">
       <h1 className="title">
                Projects
              </h1>
      {props.projects.map((project) => (
        <div className="col-4">
          <div className="card" key={project.index}>
            
            <div className="card-body">
              <h2 className="card-title">
                Project Name: {project.name}
              </h2>
              <h3 className="card-title">Project Description: {project.description}</h3>

              <h4 class="card-title mt-5">List of Applicants</h4>
              {project.applicants.map((a) =>(
    <p class="card-text mt-2" key={a.index}>Id: {a.Id} Address: {a.applicantAddress}</p>
       ))}

              {props.walletAddress !== project.admin && (
                    <button
                      type="button"
                      className="btn btn-success mt-2"
                      onClick={() => props.apply(project.index)}
                      
                    >
                     Apply
                    </button>
                  
              )}


{props.walletAddress !== project.admin && (
         <h5 class="card-title mt-5">You cannot apply if you have not uploaded a profile</h5>
                    
                  
              )}







            {props.walletAddress === project.admin && (
                    <form>
                    <div class="form-r">
                        <input type="text" class="form-control mt-4" value={address}
                             onChange={(e) => setAddress(e.target.value)} placeholder="enter address"/>
                        <button type="button" onClick={()=>props.choose(project.index, address)} class="btn btn-primary mt-2">Select Designer</button>
                        
                    </div>
                  </form>
                  
              )}

           {props.walletAddress === project.admin && (
                    <button
                      type="button"
                      className="btn btn-success mt-2"
                      onClick={() => props.end(project.index)}
                    >
                    End Contract
                    </button>
                  
              )}
                 
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default Projects;
