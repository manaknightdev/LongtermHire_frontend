import React from "react";
import QRCode from "qrcode";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface QrCodeGeneratorProps {
  setResult: (result: string) => void;
}
const QrCodeGenerator = ({ setResult }: QrCodeGeneratorProps) => {
  const { state } = useTheme();
  const mode = state?.theme;

  const [textToGenerate, setTextToGenerate] = React.useState("");
  const [generatedQrcodeImageUrl, setGeneratedQrcodeImageUrl] =
    React.useState();

  async function generateQrCode(text: string) {
    try {
      const response = await QRCode.toDataURL(text, {
        color: {
          dark: THEME_COLORS[mode].TEXT,
          light: THEME_COLORS[mode].BACKGROUND,
        },
      });
      setGeneratedQrcodeImageUrl(response);
      if (setResult) {
        setResult(response);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const labelStyles = {
    color: THEME_COLORS[mode].TEXT,
  };

  const inputStyles = {
    backgroundColor: THEME_COLORS[mode].INPUT_BACKGROUND,
    borderColor: THEME_COLORS[mode].BORDER,
    color: THEME_COLORS[mode].TEXT,
  };

  const buttonStyles = {
    backgroundColor: THEME_COLORS[mode].PRIMARY,
    color: THEME_COLORS[mode].TEXT_ON_PRIMARY,
  };

  return (
    <>
      <div>
        <div className="filter-form-holder mt-10 flex flex-wrap items-center">
          <div className="mb-4 w-full pl-2 pr-2 md:w-1/2">
            <label
              className="mb-2 block text-sm font-bold transition-colors duration-200"
              style={labelStyles}
            >
              Link
            </label>
            <input
              type="text"
              placeholder="http://www.google.com"
              onChange={(e) => setTextToGenerate(e.target.value)}
              className="mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={inputStyles}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = THEME_COLORS[mode].PRIMARY;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${THEME_COLORS[mode].PRIMARY}40`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = THEME_COLORS[mode].BORDER;
                e.currentTarget.style.boxShadow = "";
              }}
            />
          </div>
          <div className="search-buttons pl-2">
            <button
              onClick={() => generateQrCode(textToGenerate)}
              className="mr-2 inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-tight shadow-md transition duration-150 ease-in-out hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={buttonStyles}
            >
              Generate QR code
            </button>
            {generatedQrcodeImageUrl && (
              <a href={generatedQrcodeImageUrl} download>
                <button
                  className="mr-2 inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-tight shadow-md transition duration-150 ease-in-out hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={buttonStyles}
                >
                  Download
                </button>
              </a>
            )}
          </div>
        </div>
        {generatedQrcodeImageUrl && (
          <div className="mt-4 flex justify-center">
            <img
              src={generatedQrcodeImageUrl}
              alt="Qr Code"
              width="300"
              height="300"
              className="rounded-lg shadow-lg border"
              style={{ borderColor: THEME_COLORS[mode].BORDER }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default QrCodeGenerator;
