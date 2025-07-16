import { useState } from "react";
import Nav from "./Nav";
import axios from "axios";
import LoanDetails from "./Loandetails";

const Next = () => {
  const [user, setuser] = useState("");
  const [loanData, setloanData] = useState([]);
  return (
    <>
      <Nav />
      <div
        style={{ position: "absolute", top: "10%", left: "25%", width: "80%" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            value={user}
            onChange={(e) => {
              setuser(e.target.value);
            }}
            className="form-control"
            placeholder="search user"
            style={{ width: "50%" }}
          />
          <input
            type="submit"
            className="btn btn-danger"
            onClick={() => {
              axios
                .post("http://localhost:5000/viewuser", { uid: user })
                .then((res) => {
                  setloanData(res.data);
                });
            }}
          />
        </div>
        {loanData.length !== 0 && <LoanDetails loanData={loanData} />}
      </div>
    </>
  );
};

export default Next;
