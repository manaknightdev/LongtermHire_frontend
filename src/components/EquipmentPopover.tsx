// @ts-nocheck
import React, { useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
} from "@floating-ui/react";

const EquipmentPopover = ({
  isOpen,
  onClose,
  onApply,
  referenceElement,
  selectedEquipment = [],
  equipmentOptions = [],
  loading = false,
}) => {
  const [localSelected, setLocalSelected] = useState(selectedEquipment);

  const { refs, floatingStyles } = useFloating({
    elements: {
      reference: referenceElement,
    },
    open: isOpen,
    onOpenChange: onClose,
    middleware: [
      offset(8),
      flip({
        fallbackAxisSideDirection: "start",
        padding: 16,
      }),
      shift({ padding: 16 }),
      size({
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${Math.min(availableWidth, 360)}px`,
            maxHeight: `${Math.min(availableHeight, 500)}px`,
          });
        },
        padding: 16,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  // Group equipment by category from API data
  const equipmentCategories = equipmentOptions.reduce((acc, equipment) => {
    const category = equipment.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({
      id: equipment.id,
      name: equipment.name,
      available: equipment.available,
    });
    return acc;
  }, {});

  const handleEquipmentToggle = (equipmentId) => {
    setLocalSelected((prev) => {
      if (prev.includes(equipmentId)) {
        return prev.filter((item) => item !== equipmentId);
      } else {
        return [...prev, equipmentId];
      }
    });
  };

  const handleApply = () => {
    onApply(localSelected);
    onClose();
  };

  const handleCancel = () => {
    setLocalSelected(selectedEquipment);
    onClose();
  };

  // Close popover when clicking outside
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        refs.floating.current &&
        !refs.floating.current.contains(event.target) &&
        referenceElement &&
        !referenceElement.contains(event.target)
      ) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, referenceElement, refs.floating]);

  if (!isOpen) return null;

  return (
    <div
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        zIndex: 1000,
        backgroundColor: "#1F1F20",
        border: "1px solid #333333",
        borderRadius: "8px",
        padding: "20px",
        fontFamily: "Inter, sans-serif",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
        minWidth: "320px",
        maxWidth: "360px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{
            margin: 0,
            color: "#E5E5E5",
            fontSize: "18px",
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Select Equipment
        </h3>
      </div>

      {/* Equipment Categories */}
      <div
        style={{ marginBottom: "24px", maxHeight: "300px", overflowY: "auto" }}
      >
        {Object.entries(equipmentCategories).map(([category, items]) => (
          <div key={category} style={{ marginBottom: "20px" }}>
            <h4
              style={{
                margin: "0 0 12px 0",
                color: "#FDCE06",
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {category}
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {items.map((equipment) => (
                <label
                  key={equipment.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    padding: "8px 0",
                    transition: "all 0.2s ease",
                    opacity: equipment.available ? 1 : 0.6,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={localSelected.includes(equipment.id)}
                    onChange={() => handleEquipmentToggle(equipment.id)}
                    disabled={!equipment.available}
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: "#FDCE06",
                      cursor: equipment.available ? "pointer" : "not-allowed",
                    }}
                  />
                  <span
                    style={{
                      color: equipment.available ? "#E5E5E5" : "#9CA3AF",
                      fontSize: "14px",
                      fontFamily: "Inter, sans-serif",
                      userSelect: "none",
                    }}
                  >
                    {equipment.name}
                    {!equipment.available && " (Unavailable)"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          borderTop: "1px solid #333333",
          paddingTop: "16px",
        }}
      >
        <button
          onClick={handleCancel}
          style={{
            padding: "8px 16px",
            backgroundColor: "transparent",
            border: "1px solid #333333",
            borderRadius: "6px",
            color: "#E5E5E5",
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "Inter, sans-serif",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#333333";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          style={{
            padding: "8px 16px",
            backgroundColor: "#FDCE06",
            border: "none",
            borderRadius: "6px",
            color: "#1F1F20",
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "Inter, sans-serif",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#E5B800";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#FDCE06";
          }}
        >
          Apply ({localSelected.length})
        </button>
      </div>
    </div>
  );
};

export default EquipmentPopover;
