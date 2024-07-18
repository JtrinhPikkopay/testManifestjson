import React, { useState } from "react";
import Scanner from "../../components/ScanditScanner/Scanner";

const Scan = () => {
  // state
  const [result, setResult] = useState("");

  const handleScanComplete = (data) => {
    setResult(data);
  };

  return (
    <div>
      <h4 className="mb-4 text-2xl font-bold text-center text-gray-500">
        Scan barcode
      </h4>
      {result ? (
        <p>
          Scanned result: <span className="font-semibold">{result}</span>
        </p>
      ) : (
        <div className="flex justify-center">
          <Scanner onScanComplete={handleScanComplete} />
        </div>
      )}
    </div>
  );
};

export default Scan;
