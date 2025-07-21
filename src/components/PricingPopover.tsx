// @ts-nocheck
import React from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
} from "@floating-ui/react";

const PricingPopover = ({
  isOpen,
  onClose,
  onSelect,
  onCustomPackageClick,
  referenceElement,
  equipmentOptions = [],
  pricingPackages = [],
  loading = false,
}) => {
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
            maxWidth: `${Math.min(availableWidth, 320)}px`,
            maxHeight: `${Math.min(availableHeight, 400)}px`,
          });
        },
        padding: 16,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  // Use real pricing packages from API
  const packages = pricingPackages.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    price:
      pkg.discount_type === 0
        ? `${pkg.discount_value}% off`
        : `$${pkg.discount_value} off`,
    description: pkg.description,
  }));

  const handlePackageSelect = (packageItem) => {
    onSelect(packageItem.id);
  };

  const handleCustomPackageClick = () => {
    console.log("Custom package clicked");
    onCustomPackageClick(); // Call the parent handler
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
        padding: "16px",
        fontFamily: "Inter, sans-serif",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
        minWidth: "280px",
        maxWidth: "320px",
      }}
    >
      {/* Set Pricing Section */}
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            color: "#9CA3AF",
            fontSize: "14px",
            fontWeight: 500,
            marginBottom: "8px",
          }}
        >
          Set Pricing
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => handlePackageSelect(pkg)}
              style={{
                background: "none",
                border: "none",
                color: "#E5E5E5",
                fontSize: "14px",
                fontWeight: 400,
                padding: "8px 12px",
                textAlign: "left",
                cursor: "pointer",
                borderRadius: "4px",
                transition: "background-color 0.2s ease",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#333333")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              {pkg.name} - {pkg.price}
            </button>
          ))}
          <button
            onClick={handleCustomPackageClick}
            style={{
              background: "none",
              border: "none",
              color: "#FDCE06",
              fontSize: "14px",
              fontWeight: 400,
              padding: "8px 12px",
              textAlign: "left",
              cursor: "pointer",
              borderRadius: "4px",
              transition: "background-color 0.2s ease",
              fontFamily: "Inter, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#333333")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            <span style={{ fontSize: "16px" }}>+</span>
            Custom Package
          </button>
        </div>
      </div>
    </div>
  );
};
export default PricingPopover;
