import { useState } from "react";
import FileUpload from "./FileUpload";
import Nav from "./Nav";

const Checkuser = () => {
  const [x, setx] = useState(0);
  const [details, setdetails] = useState("");
  const [user, setuser] = useState([]);
  const [user1, setuser1] = useState([]);
  const [d, setd] = useState(""); // Extra payment value

  const checking = () => {
    if (x === 0) {
      return (
        <div style={{ position: "absolute", top: 0, width: "100%" }}>
          <h1 style={{ textAlign: "center" }}>Upload user file</h1>
          <FileUpload d={"first"} setx={setx} r={1} setdetails={setdetails} />
        </div>
      );
    } else if (x === 1) {
      return (
        <div style={{ position: "absolute", top: 0, width: "100%" }}>
          <h1 style={{ textAlign: "center" }}>Upload Loan details</h1>
          <FileUpload d={"second"} setx={setx} r={2} setdetails={setdetails} />
        </div>
      );
    } else if (x === 2) {
      const calculateUpdatedEMI = (plan, extraPayment) => {
        const tenure = plan[0]; // Months
        const emi = plan[1]; // EMI
        const totalInterest = plan[2]; // Total interest
        const totalPayment = plan[3]; // Total payment

        let remainingTenure = tenure;
        let adjustedInterest = totalInterest;
        let adjustedPayment = totalPayment;

        // Apply the extra yearly payment towards the loan
        if (extraPayment && extraPayment > 0) {
          const yearlyEMI = emi * 12; // EMI for the year
          const totalExtraPayment = extraPayment; // Extra payment

          adjustedInterest =
            totalInterest - totalExtraPayment * (remainingTenure / 12); // Reduce interest
          adjustedPayment = totalPayment - totalExtraPayment; // Adjust total payment
          remainingTenure -= Math.floor(totalExtraPayment / yearlyEMI); // Adjust tenure
        }

        return {
          remainingTenure,
          adjustedInterest,
          adjustedPayment,
        };
      };

      const handleExtraPayment = () => {
        if (!d || d <= 0) return user;

        const updatedUserPlan = calculateUpdatedEMI(user, d);
        setuser1([
          user[0], // Keep original tenure
          user[1], // Keep original EMI
          updatedUserPlan.adjustedInterest.toFixed(2), // Updated interest
          updatedUserPlan.adjustedPayment.toFixed(2), // Updated total payment
        ]);
        setd("");
      };

      return (
        <div
          style={{ position: "absolute", top: 20, width: "90%", left: "9%" }}
        >
          {details.eligibility_status === "Eligible" ? (
            <div className="alert alert-success text-center" role="alert">
              <h1>
                Eligibility -{" "}
                <span style={{ color: "#28a745" }}>
                  {details.eligibility_status}
                </span>
              </h1>
              <h1>
                Loan Amount:{" "}
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#28a745",
                  }}
                >
                  {" "}
                  {details.loanamount} INR
                </span>
              </h1>

              <table className="table table-hover table-striped table-bordered mt-4 rounded">
                <thead className="thead-dark">
                  <tr>
                    <th>Tenure (Months)</th>
                    <th>EMI (INR)</th>
                    <th>Total Interest (INR)</th>
                    <th>Total Payment (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {details.plans.map((d, index) => {
                    return (
                      <tr key={index}>
                        <td>{d[0]}</td>
                        <td>{d[1]}</td>
                        <td>{d[2]}</td>
                        <td>{d[3]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <select
                onChange={(e) => {
                  var selectedPlan = details.plans.filter((d) => {
                    return d[0] === parseInt(e.target.value);
                  });
                  setuser(selectedPlan[0]);
                }}
              >
                <option>Select period</option>
                {details.plans.map((d, index) => {
                  return <option key={index}>{d[0]}</option>;
                })}
              </select>
              <p>
                Emi - {user[1]} Total Interest Paid - {user[2]} Total Amount
                Paid - {user[3]}
              </p>
              <p>
                Emi - {user1[1]} Total Interest Paid - {user1[2]} Total Amount
                Paid - {user1[3]}{" "}
              </p>
              <p>Interest saved Paid {user1[2] - user[2]}</p>
              <input
                type="number"
                placeholder="Enter the amount for year"
                value={d}
                onChange={(e) => {
                  var n = parseInt(e.target.value);
                  setd(n);
                }}
              />
              <button
                className="btn btn-primary mt-2"
                onClick={handleExtraPayment}
              >
                Recalculate
              </button>
            </div>
          ) : (
            <div className="alert alert-danger text-center" role="alert">
              <h1>Eligibility - {details.eligibility_status}</h1>
              <h3>
                Unfortunately, you are not eligible for a loan at this time.
              </h3>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <>
      <Nav />
      {checking()}
    </>
  );
};

export default Checkuser;
