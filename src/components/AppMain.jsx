import React, { useState, useEffect } from "react";
// import OrderTable from "../pages/OrderTable"; // ✅ import your component

const AppMain = ({ activePage }) => {
  const [orders, setOrders] = useState([]);
  const [filterOption, setFilterOption] = useState("all");

  // Simulate fetching orders (you can replace with actual API later)
  useEffect(() => {
    // Replace this with your real API call
    const dummyOrders = [
      {
        orderId: "ORD123",
        tableNumber: 5,
        customerName: "John Doe",
        status: "PLACED",
        paymentMode: "Cash",
        totalAmount: 500,
        invoiceNumber: "INV123",
        createdAt: new Date().toISOString(),
      },
    ];
    setOrders(dummyOrders);
  }, []);

  const handleStatusUpdate = (orderId, newStatus) => {
    // implement update logic
  };

  const handleViewOrder = (order) => {
    console.log("View order clicked:", order);
  };

  const handlePrintOrder = (order) => {
    console.log("Print order clicked:", order);
  };

  return (
    <main className="flex-1 p-4">
      {/* {activePage === "orders" && (
        <OrderTable
          orders={orders}
          filterOption={filterOption}
          setFilterOption={setFilterOption}
          onStatusUpdate={handleStatusUpdate}
          onViewOrder={handleViewOrder}
          onPrintOrder={handlePrintOrder}
        />
      )} */}

      {activePage === "table" && <h2 className="text-2xl font-semibold">Table Page</h2>}
      {activePage === "menu" && <h2 className="text-2xl font-semibold">Menu Page</h2>}
    </main>
  );
};

export default AppMain;
