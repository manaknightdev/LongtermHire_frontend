import { SetStateAction, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface InteractiveMapProps {
  cards: any[];
}

const InteractiveMap = ({ cards }: InteractiveMapProps) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );

  const handleMarkerClick = (index: SetStateAction<number | null>) => {
    setSelectedCardIndex(index);
  };

  const mapContainerStyle = {
    width: "60%",
    height: "700px",
  };

  const defaultCenter = { lat: 0, lng: 0 }; // Update with your desired center
  // AIzaSyDeZ9Lr2B3mPGfzQBMbqcS9gGugI2F-bSM
  // AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg
  // https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDeZ9Lr2B3mPGfzQBMbqcS9gGugI2F-bSM
  return (
    <div className="flex items-center">
      <div className="card-list p-5 w-[50%] space-y-2">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card border border-gray-600 px-2 py-4 max-w-lg ${selectedCardIndex === index ? "selected" : ""}`}
          >
            <h3 className="text-center mb-2">Card {index + 1}</h3>
            <div className="flex justify-between items-center p-4">
              <p>Price: ${card.price}</p>
              <p>Latitude: {card.latitude}</p>
              <p>Longitude: {card.longitude}</p>
            </div>
          </div>
        ))}
      </div>
      <LoadScript googleMapsApiKey="AIzaSyDeZ9Lr2B3mPGfzQBMbqcS9gGugI2F-bSM">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={10} // Adjust the initial zoom level
        >
          {cards.map((card, index) => (
            <Marker
              key={index}
              position={{ lat: card.latitude, lng: card.longitude }}
              onClick={() => handleMarkerClick(index)}
              label={card.price.toString()} // Display price as marker label
              // Add more properties for customization (e.g., icon)
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default InteractiveMap;
