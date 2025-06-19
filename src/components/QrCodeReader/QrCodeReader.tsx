import React, { useRef } from "react";
import QrScanner from "qr-scanner";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface QrCodeReaderProps {
  setResult: (result: string) => void;
}
const QrCodeReader = ({ setResult }: QrCodeReaderProps) => {
  const { state } = useTheme();
  const mode = state?.theme;

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

  const buttonStyles = {
    backgroundColor: THEME_COLORS[mode].PRIMARY,
    color: THEME_COLORS[mode].TEXT_ON_PRIMARY,
  };

  const resultStyles = {
    color: THEME_COLORS[mode].TEXT,
    backgroundColor: THEME_COLORS[mode].BACKGROUND_SECONDARY,
    borderColor: THEME_COLORS[mode].BORDER,
  };

  return (
    <div>
      <div className="filter-form-holder flex-column mt-10 flex-wrap justify-center">
        <div className="search-buttons pl-2">
          <button
            onClick={() => {
              handleScanFileBtn();
            }}
            className="mr-2 inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-tight shadow-md transition duration-150 ease-in-out hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={buttonStyles}
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
        {scannedQrFile && (
          <div
            className="mt-4 p-4 rounded-lg border transition-colors duration-200"
            style={resultStyles}
          >
            <h4 className="font-medium">Scanned Code Result:</h4>
            <p className="mt-2 break-all">{scannedQrFile}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrCodeReader;
