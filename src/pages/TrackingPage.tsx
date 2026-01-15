import React from "react";
import DeliveryTracking from "../components/DeliveryTracking";

const TrackingPage: React.FC = () => {
  const futureDate = new Date();
  futureDate.setMinutes(futureDate.getMinutes() + 30);

  return (
    <div className="min-h-screen bg-gray-50">
      <DeliveryTracking
        delivery={{
          id: "DEL-2024-001",
          orderId: "ORD-2024-001",
          status: "delivering",
          deliveryPerson: {
            id: "DRV-001",
            name: "Paul Koffi",
            phone: "+229 97 00 00 01",
            email: "paul.koffi@email.com",
            avatar: "/logo.png",
            rating: 4.8,
            vehicle: {
              type: "moto",
              brand: "Yamaha",
              model: "MT-07",
              color: "Noir",
              plateNumber: "BJ-1234-AB",
            },
            isOnline: true,
            totalDeliveries: 150,
            joinedAt: new Date("2023-01-15"),
            status: "active",
          },
          estimatedArrival: futureDate,
          currentLocation: {
            lat: 6.4964,
            lng: 2.629,
          },
          startedAt: new Date(),
        }}
      />
    </div>
  );
};

export default TrackingPage;
