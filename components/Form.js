"use client";
import React, { useState, useRef, useEffect } from "react";
import copy from "copy-to-clipboard";
import { QRCodeSVG } from "qrcode.react";

export default function Contact() {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [languages, setLanguages] = useState([""]);
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [contacts, setContacts] = useState([{ name: "", phone: "" }]);
  const qrRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Helper functions for languages repeater
  const addLanguage = () => {
    setLanguages([...languages, ""]);
  };

  const removeLanguage = (index) => {
    if (languages.length > 1) {
      setLanguages(languages.filter((_, i) => i !== index));
    }
  };

  const updateLanguage = (index, value) => {
    const updated = [...languages];
    updated[index] = value;
    setLanguages(updated);
  };

  // Helper functions for contacts repeater
  const addContact = () => {
    setContacts([...contacts, { name: "", phone: "" }]);
  };

  const removeContact = (index) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index));
    }
  };

  const updateContact = (index, field, value) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    setContacts(updated);
  };

  const downloadQRCode = () => {
    if (qrRef.current) {
      const svg = qrRef.current.querySelector("svg");
      if (svg) {
        // Convert SVG to canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const svgUrl = URL.createObjectURL(svgBlob);

        img.onload = () => {
          const scale = 4;
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          // Scale the context to make the image bigger
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0);

          const link = document.createElement("a");
          link.download = "emergency-info-qr.png";
          link.href = canvas.toDataURL();
          link.click();

          URL.revokeObjectURL(svgUrl);
        };

        img.src = svgUrl;
      }
    }
  };

  const generateURL = () => {
    const data = {
      name,
      birthdate,
      languages: languages.filter((l) => l.trim() !== ""),
      medicalInfo: {
        allergies,
        medications,
        bloodType,
        notes: medicalNotes,
      },
      contacts: contacts.filter(
        (c) => c.name.trim() !== "" || c.phone.trim() !== ""
      ),
    };

    const encoded = encodeURIComponent(btoa(JSON.stringify(data)));

    return `${window.location.origin}${window.location.pathname}?data=${encoded}`;
  };

  const onClickGenerate = (e) => {
    e.preventDefault();
    const url = generateURL();
    copy(url);
    alert("URL copied to clipboard!");
  };

  return (
    <div className="font-sans p-5 bg-gray-100 min-h-screen flex justify-center">
      <main className="max-w-lg w-full bg-white p-6 rounded-lg shadow space-y-6">
        <h1 className="font-bold text-center text-red-600">
          Emergency Information Page Generator
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
          <div className="space-y-2">
            <label className="block text-sm font-medium">Languages</label>
            {languages.map((language, index) => (
              <div key={index} className="flex gap-2">
                <input
                  className="flex-1 p-2 border border-gray-400 rounded"
                  value={language}
                  onChange={(e) => updateLanguage(index, e.target.value)}
                  placeholder="Language"
                />
                {languages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addLanguage}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Add Language
            </button>
          </div>
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
          <div className="space-y-2">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="space-y-2 p-3 border border-gray-300 rounded"
              >
                <div className="grid grid-cols-1 gap-2">
                  <input
                    className="p-2 border border-gray-400 rounded"
                    value={contact.name}
                    onChange={(e) =>
                      updateContact(index, "name", e.target.value)
                    }
                    placeholder="Contact Name"
                  />
                  <input
                    className="p-2 border border-gray-400 rounded"
                    value={contact.phone}
                    onChange={(e) =>
                      updateContact(index, "phone", e.target.value)
                    }
                    placeholder="Phone Number"
                  />
                </div>
                {contacts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addContact}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Add Contact
            </button>
          </div>
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
          <div className="flex flex-col gap-3 mt-6">
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
              onClick={onClickGenerate}
            >
              Copy to Clipboard
            </button>
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
              onClick={downloadQRCode}
            >
              Download QR Code
            </button>
          </div>
        </section>

        {isClient && (
          <div
            style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
          >
            <div ref={qrRef}>
              <QRCodeSVG
                value={generateURL()}
                size={200}
                level="M"
                includeMargin={true}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
