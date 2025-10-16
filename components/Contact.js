"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Contact() {
  const [userData, setUserData] = useState(null);

  // Utility to calculate age
  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age >= 0 ? age : 0;
  };

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encodedData = params.get("data");
      if (encodedData) {
        const jsonStr = atob(decodeURIComponent(encodedData));
        const parsedData = JSON.parse(jsonStr);
        setUserData(parsedData);
      }
    } catch (err) {
      setUserData(false);
      console.error("Failed to parse URL data:", err);
    }
  }, []);

  // Show loading / fallback if no data
  if (userData === false) {
    return (
      <div className="font-sans flex justify-center p-5 bg-gray-100 min-h-screen">
        <main className="max-w-xl w-full flex flex-col gap-4 text-center">
          <p className="text-gray-700">No emergency data found in URL.</p>
        </main>
      </div>
    );
  }

  if (userData === null) return null;

  const { name, birthdate, languages, medicalInfo, contacts, trustedPerson } =
    userData;

  return (
    <div className="font-sans flex flex-col items-center p-5 bg-gray-100 min-h-screen gap-8">
      <main className="max-w-xl w-full flex flex-col gap-4">
        {/* Header */}
        <div className="p-5 bg-red-600 text-white font-bold rounded-lg text-center">
          <h1>Emergency Information Page</h1>
        </div>

        {/* Personal Info */}
        <div className="p-5 bg-white text-black rounded-lg shadow">
          <h2 className="font-bold mb-2">Personal Information</h2>
          <p>Full Name: {name}</p>
          <p>Birthdate: {birthdate}</p>
          <p>Age: {calculateAge(new Date(birthdate))}</p>
          <p>Languages: {languages.join(", ")}</p>
        </div>

        {/* Medical Info */}
        <div className="p-5 bg-white text-black rounded-lg shadow">
          <h2 className="font-bold mb-2">Medical Information</h2>
          <p>Allergies: {medicalInfo.allergies}</p>
          <p>Medications: {medicalInfo.medications}</p>
          <p>Blood Type: {medicalInfo.bloodType}</p>
          <p>Notes: {medicalInfo.notes}</p>
        </div>

        {/* Emergency Contacts */}
        {contacts.length > 0 && contacts.some((c) => c.name) && (
          <div className="p-5 bg-white text-black rounded-lg shadow">
            <h2 className="font-bold mb-2">Emergency Contacts</h2>
            <ul className="flex flex-col gap-1">
              {contacts.map((contact, index) => (
                <li key={index}>
                  {contact.name} —{" "}
                  <Link
                    href={`tel:${contact.phone}`}
                    className="text-blue-600 underline"
                  >
                    {contact.phone}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Trusted Person / Legal */}
        <div className="p-5 bg-white text-black rounded-lg shadow">
          <h2 className="font-bold mb-2">Trusted Document Person</h2>
          <p>Full Name: {trustedPerson.name}</p>
          <p>Phone: {trustedPerson.phone}</p>
          <p>Relation: {trustedPerson.relation}</p>
          <p>Notes: {trustedPerson.notes}</p>
        </div>

        {/* Emergency Call Button */}
        <div className="text-center">
          <Link
            href="tel:112"
            className="inline-block w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700"
          >
            Call Emergency 112
          </Link>
        </div>
      </main>

      <footer className="p-5 text-center max-w-xl w-full">
        <p className="text-gray-400 text-sm">
          generate your own{" "}
          <Link href="/" className="text-blue-600 underline">
            here
          </Link>
        </p>
      </footer>
    </div>
  );
}
