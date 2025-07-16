import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

ChartJS.register(ArcElement, Tooltip, Legend);

const LoanDetails = ({ loan, creditScore }) => (
  <div
    style={{
      width: "50%",
      padding: "20px",
      border: "2px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
    }}
  >
    <h3>Loan Details for {loan[1]}</h3>
    <p>
      <strong>Customer ID:</strong> {loan[0]}
    </p>
    <p>
      <strong>Income:</strong> {loan[2]}
    </p>
    <p>
      <strong>Average Monthly Expenditure:</strong> {loan[3]}
    </p>
    <p>
      <strong>Initial Credit Score:</strong> {loan[4]}
    </p>
    <p>
      <strong>Loan Amount:</strong> {loan[5]}
    </p>
    <p>
      <strong>Interest Rate (%):</strong> {loan[6]}
    </p>
    <p>
      <strong>Repayment Period (Months):</strong> {loan[7]}
    </p>
    <p>
      <strong>EMI Amount:</strong> {loan[8]}
    </p>
    <p>
      <strong>On-Time Payments:</strong> {loan[9]}
    </p>
    <p>
      <strong>Off-Time Payments:</strong> {loan[10]}
    </p>
    <p>
      <strong>Overall Credit Score:</strong>{" "}
      <span style={{ color: "#28a745", fontWeight: "bold" }}>
        {creditScore}
      </span>
    </p>
  </div>
);

const ProgressBar = ({ completedPeriod, totalPeriod }) => {
  const progress = (completedPeriod / totalPeriod) * 100;

  return (
    <div style={{ marginTop: "20px" }}>
      <h4>Repayment Progress</h4>
      <div
        style={{
          backgroundColor: "#e0e0e0",
          borderRadius: "10px",
          height: "30px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: "#4caf50",
            height: "100%",
            borderRadius: "10px",
            transition: "width 0.3s ease-in-out",
          }}
        ></div>
      </div>
      <p>
        {completedPeriod} out of {totalPeriod} months completed
      </p>
    </div>
  );
};

const PieChart = ({ onTimePayments, offTimePayments }) => {
  const data = {
    labels: ["On-Time Payments", "Off-Time Payments"],
    datasets: [
      {
        label: "# of Payments",
        data: [onTimePayments, offTimePayments],
        backgroundColor: ["#36a2eb", "#ff6384"],
        hoverBackgroundColor: ["#36a2eb", "#ff6384"],
      },
    ],
  };

  return (
    <div style={{ width: "100%" }}>
      <h4>Payment Breakdown</h4>
      <Pie data={data} />
    </div>
  );
};

const LoanDetailsComponent = ({ loanData }) => {
  const [selectedLoan, setSelectedLoan] = useState(null);

  const handleSelectLoan = (event) => {
    const loanNo = event.target.value;
    const selected = loanData.find((loan) => loan[1] === loanNo);
    setSelectedLoan(selected);
  };

  const calculateCreditScore = (loan) => {
    const onTimePayments = loan[9];
    const offTimePayments = loan[10];
    const totalPayments = onTimePayments + offTimePayments;
    if (totalPayments === 0) return loan[4];

    const scorePercentage = (onTimePayments / totalPayments) * 100;
    return Math.round((scorePercentage / 100) * loan[4]);
  };

  const calculateOverallCreditScore = (loans) => {
    if (loans.length === 0) return 0;

    const totalCreditScore = loans.reduce(
      (total, loan) => total + calculateCreditScore(loan),
      0
    );
    return Math.round(totalCreditScore / loans.length);
  };

  const calculateCompletedPeriod = (loan) => loan[9] + loan[10];

  const overallCreditScore = calculateOverallCreditScore(loanData);

  return (
    <div>
      <h2>Select a Loan Number</h2>

      <div>
        <select
          onChange={handleSelectLoan}
          className="form-select"
          style={{ maxWidth: "300px" }}
        >
          <option value="">-- Select Loan Number --</option>
          {loanData.map((loan) => (
            <option key={loan[1]} value={loan[1]}>
              {loan[1]}
            </option>
          ))}
        </select>
      </div>

      {/* Display overall credit score */}
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#007bff",
          }}
        >
          Overall Credit Score for All Loans: {overallCreditScore}
        </h3>
      </div>

      {selectedLoan && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "40px",
            width: "60%",
          }}
        >
          {/* Loan Details */}
          <LoanDetails
            loan={selectedLoan}
            creditScore={calculateCreditScore(selectedLoan)}
          />

          {/* Progress Bar & Pie Chart */}
          <div>
            <ProgressBar
              completedPeriod={calculateCompletedPeriod(selectedLoan)}
              totalPeriod={selectedLoan[7]}
            />
            <PieChart
              onTimePayments={selectedLoan[9]}
              offTimePayments={selectedLoan[10]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanDetailsComponent;
