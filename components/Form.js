"use client";
import React, { useState } from "react";
import copy from "copy-to-clipboard";

export default function Contact() {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [languages, setLanguages] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [contacts, setContacts] = useState("");
  const [trustedName, setTrustedName] = useState("");
  const [trustedPhone, setTrustedPhone] = useState("");
  const [trustedRelation, setTrustedRelation] = useState("");
  const [trustedNotes, setTrustedNotes] = useState("");

  const generateURL = () => {
    const data = {
      name,
      birthdate,
      languages: languages.split(",").map((l) => l.trim()),
      medicalInfo: {
        allergies,
        medications,
        bloodType,
        notes: medicalNotes,
      },
      contacts: contacts.split(",").map((c) => {
        const match = c.match(/(.*)\s+\((.*)\)/);
        if (match) {
          return { name: match[1].trim(), phone: match[2].trim() };
        }
        return { name: c.trim(), phone: "" };
      }),
      trustedPerson: {
        name: trustedName,
        phone: trustedPhone,
        relation: trustedRelation,
        notes: trustedNotes,
      },
    };

    const encoded = encodeURIComponent(btoa(JSON.stringify(data)));

    // Only access window on client-side
    if (typeof window !== "undefined") {
      return `${window.location.href}/?data=${encoded}`;
    } else {
      // Fallback if somehow server-side
      return `/?data=${encoded}`;
    }
  };

  const onClickGenerate = (e) => {
    e.preventDefault();
    const url = generateURL();
    copy(url);
    alert("URL copied to clipboard!");
  };

  return (
    <div className="font-sans p-5 bg-gray-100 min-h-screen flex justify-center">
      <main className="max-w-xl w-full bg-white p-6 rounded-lg shadow space-y-6">
        <h1 className="font-bold text-center text-red-600">
          ICE Page Generator
        </h1>

        {/* Personal Info */}
        <section className="space-y-2">
          <h2 className="font-bold">Personal Information</h2>
          <input
            className="w-full p-2 border border-gray-400 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
          />
          <input
            className="w-full p-2 border border-gray-400 rounded"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
          <input
            className="w-full p-2 border border-gray-400 rounded"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            placeholder="Languages (comma separated)"
          />
        </section>

        {/* Medical Info */}
        <section className="space-y-2">
          <h2 className="font-bold">Medical Information</h2>
          <input
            className="w-full p-2 border border-gray-400 rounded"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="Allergies"
          />
          <input
            className="w-full p-2 border border-gray-400 rounded"
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
            placeholder="Medications"
          />
          <input
            className="w-full p-2 border border-gray-400 rounded"
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            placeholder="Blood Type"
          />
          <textarea
            className="w-full p-2 border border-gray-400 rounded"
            value={medicalNotes}
            onChange={(e) => setMedicalNotes(e.target.value)}
            placeholder="Medical Notes"
          />
        </section>

        {/* Emergency Contacts */}
        <section className="space-y-2">
          <h2 className="font-bold">Emergency Contacts</h2>
          <textarea
            className="w-full p-2 border border-gray-400 rounded"
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
            placeholder="Format: Name (+Phone), separate multiple with commas"
          />
        </section>

        {/* Trusted Person */}
        <section className="space-y-2">
          <h2 className="font-bold">Trusted Document Person</h2>
          <input
            className="w-full p-2 border border-gray-400 rounded"
            value={trustedName}
            onChange={(e) => setTrustedName(e.target.value)}
            placeholder="Full Name"
          />
          <input
            className="w-full p-2 border border-gray-400 rounded"
            value={trustedPhone}
            onChange={(e) => setTrustedPhone(e.target.value)}
            placeholder="Phone"
          />
          <input
            className="w-full p-2 border border-gray-400 rounded"
            value={trustedRelation}
            onChange={(e) => setTrustedRelation(e.target.value)}
            placeholder="Relation"
          />
          <textarea
            className="w-full p-2 border border-gray-400 rounded"
            value={trustedNotes}
            onChange={(e) => setTrustedNotes(e.target.value)}
            placeholder="Notes"
          />
        </section>

        {/* Generated URL */}
        <section className="">
          <h2 className="font-bold">Your Shareable ICE URL</h2>
          <input
            type="text"
            readOnly
            value={generateURL()}
            className="w-full p-2 border border-gray-400 rounded text-sm"
          />
          <button
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={onClickGenerate}
          >
            Copy to Clipboard
          </button>
        </section>
      </main>
    </div>
  );
}
