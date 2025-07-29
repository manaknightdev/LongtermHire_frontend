# Chat Online Status & Discount System Implementation

## Overview

This document outlines the implementation of chat online status functionality and discount system integration in the LongtermHire frontend application.

## Chat Online Status Implementation

### Backend API Endpoints

The following new endpoints have been added to the chat API:

1. **Set User Online**
   - `POST /v1/api/longtermhire/chat/online`
   - Sets the current user's online status

2. **Set User Offline**
   - `POST /v1/api/longtermhire/chat/offline`
   - Sets the current user's offline status

3. **Send Heartbeat**
   - `POST /v1/api/longtermhire/chat/heartbeat`
   - Maintains online status (sent every 30 seconds)

4. **Check Admin Status**
   - `GET /v1/api/longtermhire/chat/admin-status`
   - Returns admin online status information

### Frontend Implementation

#### Updated Files:

- `src/services/chatApi.ts` - Added new API endpoints
- `src/hooks/useChat.ts` - Added online status management
- `src/hooks/useClientChat.ts` - Added online status management
- `src/client/ClientDashboard.tsx` - Added admin status indicators
- `src/components/Chat.tsx` - Added admin status indicators

#### Features:

- **Automatic Online Status**: Users are automatically marked as online when they open the application
- **Heartbeat System**: Sends heartbeat every 30 seconds to maintain online status
- **Tab/Browser Close Handling**: Only sets offline when tab is closed, browser is closed, or user logs out
- **Admin Status Checking**: Checks admin online status every minute
- **Visual Indicators**: Shows admin online/offline status in chat interfaces

#### Auto-Response Logic:

- Trigger: When a client (member role) sends a message
- Condition: No admin (super_admin role) is currently online
- Action: Automatically sends response: "Thank you for your message. Our team is currently offline, but we'll respond within 24 hours during business hours."
- Message Type: `auto_response`

## Discount System Implementation

### Backend Equipment API Response Structure

The equipment API now returns enhanced data with discount information:

```json
{
  "error": false,
  "data": {
    "equipment": [
      {
        "id": 9,
        "equipment_id": "E850",
        "equipment_name": "1212",
        "category_name": "Cranes",
        "base_price": 2,
        "discounted_price": 1.96,
        "discount_type": "percentage",
        "discount_value": 2.00,
        "availability": 1,
        "content": {
          "description": null,
          "banner_description": null,
          "image": null
        },
        "pricing_package": {
          "name": "Custom Discount",
          "description": "2% off all equipment"
        }
      }
    ],
    "grouped_equipment": {
      "Cranes": [...]
    },
    "total_count": 3
  },
  "message": "Equipment retrieved successfully"
}
```

### Discount Logic

#### Priority System:

1. **Custom Discount** (from `longtermhire_client` table)
2. **Pricing Package Discount** (from `longtermhire_pricing_package` table)
3. **No Discount** (fallback to base price)

#### Discount Types:

- `"percentage"`: Discount as percentage (e.g., 2.00 = 2%)
- `"fixed"`: Discount as fixed amount (e.g., 50.00 = $50 off)
- `null`: No discount applied

#### Calculation Examples:

**Percentage Discount:**

```javascript
// Client has 2% custom discount
base_price: 100
discount_type: "percentage"
discount_value: 2.00
discounted_price: 100 - (100 * 2 / 100) = 98
```

**Fixed Discount:**

```javascript
// Client has $50 fixed discount
base_price: 100
discount_type: "fixed"
discount_value: 50.00
discounted_price: 100 - 50 = 50
```

### Frontend Implementation

#### Updated Files:

- `src/client/ClientDashboard.tsx` - Enhanced equipment data processing

#### Features:

- **Automatic Discount Display**: Shows discounted prices when available
- **Discount Information**: Displays discount type, value, and pricing package details
- **Fallback Support**: Gracefully handles cases where no discount is applied
- **Price Calculation**: Automatically calculates final prices based on backend discount data

#### Equipment Data Processing:

```javascript
const getEquipmentData = () => {
  return equipment.reduce((acc, item) => {
    const displayPrice = item.discounted_price || item.base_price;
    const hasDiscount =
      item.discounted_price && item.discounted_price < item.base_price;

    acc[category].push({
      id: item.equipment_id || item.id,
      name: item.equipment_name,
      price: displayPrice ? `$${displayPrice}` : "Contact for pricing",
      base_price: item.base_price,
      discounted_price: item.discounted_price,
      discount_type: item.discount_type,
      discount_value: item.discount_value,
      has_discount: hasDiscount,
      pricing_package: item.pricing_package,
    });
  }, {});
};
```

## Usage Examples

### Using the Chat Hooks

#### Admin Dashboard:

```javascript
import { useChat } from "../hooks/useChat";

const { adminOnline, setOnline, setOffline, checkAdminStatus } = useChat();

// Automatically handles:
// - Online status on mount
// - Heartbeat every 30 seconds
// - Offline status on tab close
// - Admin status check every minute
```

#### Client Dashboard:

```javascript
import { useClientChat } from "../hooks/useClientChat";

const { adminOnline, setOnline, setOffline, checkAdminStatus } =
  useClientChat();

// Same functionality as useChat but for client dashboard
```

### Using the API Service

```javascript
import { chatApi } from "../services/chatApi";

// Set online status
await chatApi.setOnline();

// Set offline status
await chatApi.setOffline();

// Send heartbeat
await chatApi.sendHeartbeat();

// Check admin status
const adminStatus = await chatApi.getAdminStatus();
```

## Testing

The implementation includes comprehensive error handling and logging. All API calls are wrapped in try-catch blocks to ensure graceful degradation.

## Notes

- The online status system only sets offline on actual tab close, browser close, or logout (not on tab switching)
- Heartbeat intervals are automatically managed by the hooks
- Admin status is checked every minute to provide real-time updates
- The discount system prioritizes backend-provided discounts over frontend calculations
- All new features are backward compatible with existing functionality
