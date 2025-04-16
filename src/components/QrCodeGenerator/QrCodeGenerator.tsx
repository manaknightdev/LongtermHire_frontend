import React from "react";
import QRCode from "qrcode";

interface QrCodeGeneratorProps {
  setResult: (result: string) => void;
}
const QrCodeGenerator = ({ setResult }: QrCodeGeneratorProps) => {
  const [textToGenerate, setTextToGenerate] = React.useState("");
  const [generatedQrcodeImageUrl, setGeneratedQrcodeImageUrl] =
    React.useState();

  async function generateQrCode(text: string) {
    try {
      const response = await QRCode.toDataURL(text);
      setGeneratedQrcodeImageUrl(response);
      if (setResult) {
        setResult(response);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div>
        <div className="filter-form-holder mt-10 flex flex-wrap items-center">
          <div className="mb-4 w-full pl-2 pr-2 md:w-1/2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Link
            </label>
            <input
              type="text"
              placeholder="http://www.google.com"
              onChange={(e) => setTextToGenerate(e.target.value)}
              className="focus:shadow-outline mb-3 w-full  appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            />
          </div>
          <div className="search-buttons pl-2">
            <button
              onClick={() => generateQrCode(textToGenerate)}
              className="mr-2 inline-block rounded bg-blue-600 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
            >
              Generate QR code
            </button>
            {generatedQrcodeImageUrl && (
              <a href={generatedQrcodeImageUrl} download>
                <button className="mr-2 inline-block rounded bg-blue-600 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg">
                  Download
                </button>
              </a>
            )}
          </div>
        </div>
        {generatedQrcodeImageUrl && (
          <img
            src={generatedQrcodeImageUrl}
            alt="Qr Code"
            width="300"
            height="300"
          />
        )}
      </div>
    </>
  );
};

export default QrCodeGenerator;
