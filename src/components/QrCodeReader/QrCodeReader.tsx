import React, { useRef } from "react";
import QrScanner from "qr-scanner";

interface QrCodeReaderProps {
  setResult: (result: string) => void;
}
const QrCodeReader = ({ setResult }: QrCodeReaderProps) => {
  const [scannedQrFile, setScannedQrFile] = React.useState("");
  const fileRef = useRef(null) as any;

  function handleScanFileBtn() {
    fileRef.current.click();
  }

  async function handleChangeScanFileBtn(e: any) {
    const file = e.target.files[0];
    try {
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true,
      });
      setScannedQrFile(result.data);
      if (setResult) {
        setResult(result.data);
      }
    } catch (err: any) {
      setScannedQrFile(err);
    }
  }

  return (
    <div>
      <div className="filter-form-holder flex-column mt-10 flex-wrap justify-center">
        <div className="search-buttons pl-2">
          <button
            onClick={() => {
              handleScanFileBtn();
            }}
            className="mr-2 inline-block rounded bg-blue-600 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
          >
            <span>Scan QR Code</span>
            <input
              type="file"
              ref={fileRef}
              onChange={handleChangeScanFileBtn}
              accept=".png, .jpg, .jpeg"
              className="hidden opacity-0"
            />
          </button>
        </div>
        <h4>Scanned Code Result: {scannedQrFile && scannedQrFile}</h4>
      </div>
    </div>
  );
};

export default QrCodeReader;
