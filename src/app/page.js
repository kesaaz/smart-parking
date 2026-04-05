"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [parkings, setParkings] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [search, setSearch] = useState("");
  console.log("ALL PARKINGS:", parkings);

  // 🔐 AUTH LISTENER (single clean one)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // 📡 REAL-TIME PARKING DATA
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "parking_locations"),
      async (snapshot) => {
        const parkingData = [];

        for (let docSnap of snapshot.docs) {
          const parking = { id: docSnap.id, ...docSnap.data() };

          const slotsSnapshot = await getDocs(
            collection(db, "parking_locations", docSnap.id, "slots")
          );

          // 🔥 AUTO RELEASE LOGIC
          parking.slots = await Promise.all(
            slotsSnapshot.docs.map(async (slot) => {
              const data = slot.data();

              if (data.status === "reserved" && data.expiry) {
                if (Date.now() > data.expiry) {
                  const slotRef = doc(
                    db,
                    "parking_locations",
                    docSnap.id,
                    "slots",
                    slot.id
                  );

                  await updateDoc(slotRef, {
                    status: "Empty",
                    expiry: null,
                    userId: null
                  });

                  return {
                    id: slot.id,
                    status: "Empty"
                  };
                }
              }

              return {
                id: slot.id,
                ...data
              };
            })
          );

          parkingData.push(parking);
        }

        setParkings(parkingData);
      }
    );

    return () => unsubscribe();
  }, []);

  // 🚗 BOOK SLOT
  const bookSlot = async (parkingId, slotId) => {
    if (!user) {
      alert("Please login first!");
      return;
    }

    const slotRef = doc(db, "parking_locations", parkingId, "slots", slotId);

    const expiryTime = Date.now() + 5 * 60 * 1000;

    await updateDoc(slotRef, {
      status: "reserved",
      expiry: expiryTime,
      userId: user.uid
    });
  };

  // 🔓 LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const getAlternativeParking = (currentParking) => {
  const availableParkings = parkings.filter((p) => {
    if (p.id === currentParking.id) return false;

    return p.slots?.some((slot) => slot.status === "Empty");
  });

  if (availableParkings.length === 0) return null;

  let nearest = null;
  let minDistance = Infinity;

  availableParkings.forEach((p) => {
    const distance = calculateDistance(
      currentParking.lat,
      currentParking.lng,
      p.lat,
      p.lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = p;
    }
  });

  return nearest;
};
/////LOCATION NOT AVAILABLE MESSAGE
      const filteredParkings =
  search.trim() === ""
    ? parkings
    : parkings.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
      {/* 🔝 Find Closest Parking */}
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
      return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-gray-100">

      {/* 🔝 NAVBAR */}
      <div className="bg-white px-8 py-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between mb-8">

  {/* LEFT - LOGO */}
  <h1 className="text-2xl font-semibold text-blue-600 tracking-tight">
    🚗 Smart Parking
  </h1>

  {/* CENTER - SEARCH */}
  <div className="flex-1 flex justify-center px-10">
    <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500 transition">

      <span className="text-gray-400 mr-2">🔍</span>

      <input
        type="text"
        placeholder="Search locations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-transparent w-full outline-none text-gray-900"
      />

      {search && (
        <button
          onClick={() => setSearch("")}
          className="text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>
      )}
    </div>
  </div>

  {/* RIGHT - USER */}
  <div className="flex items-center gap-4">
    <span className="text-sm text-gray-900">
      {user?.email}
    </span>

    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition"
    >
      Logout
    </button>
  </div>
</div>

      {/* 📊 DASHBOARD TITLE */}
      <h2 className="text-5xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
        Smart Parking Dashboard
      </h2>
      {/* Not Available” UI */}
      {search && filteredParkings.length === 0 && (
        <div className="text-xl text-center text-gray-600 mt-6">
          ❌ Location not available yet
        </div>
      )}
      {/* 🚗 PARKING GRID */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredParkings.map((p) => (          <div
            key={p.id}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 transition duration-300"
          >
            <div className="flex justify-between items-center mb-3">
            <h2 className="text-3xl font-semibold text-gray-900">
              {p.name || "Unnamed Location"}
            </h2>

            <button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`
                )
              }
              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              📍 Navigate
            </button>
          </div>
            <p className="text-sm text-gray-500 mb-3">
              Available:{" "}
              <span className="font-semibold text-green-600">
                {p.slots?.filter((s) => s.status === "Empty").length}
              </span>
              <span className="text-gray-400">
                {" "} / {p.slots?.length}
              </span>
            </p>
            
            {/* SLOT GRID */}
            <div className="grid grid-cols-2 gap-3">
              {p.slots?.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-4 rounded-xl text-center text-white font-medium transform hover:scale-105 transition duration-200 ${
                    slot.status === "Empty"
                    ? "bg-blue-500"
                    : slot.status === "reserved"
                    ? "bg-gray-400"
                    : "bg-red-500"
                  }`}
                >
                  <p className="text-lg font-semibold">{slot.id}</p>
                  <p className="text-base opacity-90">{slot.status}</p>

                  {slot.status === "Empty" && user && (
                    <button
                      onClick={() => bookSlot(p.id, slot.id)}
                      className="mt-2 bg-white text-blue-700 px-3 py-1 text-sm rounded font-semibold hover:bg-gray-200 transition"
                    >
                      Book
                    </button>
                  )}

                  {slot.userId === user?.uid && slot.status !== "Empty" && (
                    <p className="text-xs mt-2 bg-white text-blue-700 px-2 py-1 rounded inline-block font-semibold">
                      Yours
                    </p>
                  )}
                </div>
              ))}
                {!p.slots?.some((slot) => slot.status === "Empty") && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-900">
                  ❌ No slots available

                  {getAlternativeParking(p) && (
                    <div className="mt-2">
                      👉 Try:{" "}
                      <span className="font-semibold text-blue-600">
                        {getAlternativeParking(p).name}
                      </span>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}