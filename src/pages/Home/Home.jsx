import React, { useState } from "react";
import Scanner from "../../components/ScanditScanner/Scanner";
import { Alert } from "@mui/material";
import axios from "axios";

const Home = () => {
  // state
  const [result, setResult] = useState("");
  const [alert, setAlert] = useState("");

  const handleScanComplete = async (value) => {
    try {
      setAlert("");
      const data = { name: value };
      setResult(value);

      await axios.post("/api/v1/manifest", data).then((res) => res.data);
      setAlert("Manifest updated");
    } catch (error) {
      setAlert(error.message);
    }
  };

  return (
    <div>
      <h4 className="mb-4 text-2xl font-bold text-center text-gray-500">
        Scan barcode
      </h4>
      <div className="flex justify-center">
        <Scanner onScanComplete={handleScanComplete} scanAgain />
      </div>
      <div>{alert && <Alert severity="success">{alert}</Alert>}</div>
      {result && (
        <>
          <p className="mt-4">
            Scanned result: <span className="font-semibold">{result}</span>
          </p>
        </>
      )}
    </div>
  );
};

export default Home;
