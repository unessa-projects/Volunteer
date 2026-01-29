import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaRegAddressCard,
  FaCity,
  FaGlobeAsia,
  FaHashtag,
  FaIdCard,
  FaBirthdayCake,
} from "react-icons/fa";

const countryOptions = [
  { code: "+91", flag: "https://flagcdn.com/w40/in.png" },
  { code: "+1", flag: "https://flagcdn.com/w40/us.png" },
  { code: "+44", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "+971", flag: "https://flagcdn.com/w40/ae.png" },
];

const FormFields = ({ formData, onChange, submitted }) => {
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  const isNameInvalid = formData.name.trim() === "";
  const isEmailInvalid = !validateEmail(formData.email);
  const isPhoneInvalid = !validatePhone(formData.phone);

  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

 // Prefill reference name from localSt 

useEffect(() => {
  // ❗ If already set, do nothing
  if (formData.referenceName) return;

  const params = new URLSearchParams(window.location.search);
  const refFromUrl = params.get("ref");

  if (refFromUrl) {
    console.log("✅ REF FROM URL:", refFromUrl);
    onChange("referenceName", refFromUrl);
    return;
  }

  const storedUser = localStorage.getItem("googleUser");
  if (!storedUser) return;

  const { email } = JSON.parse(storedUser);

  fetch(`http://localhost:5000/api/users/get-user/${email}`)
    .then(res => res.json())
    .then(data => {
      if (data.username) {
        console.log("✅ REF FROM USER:", data.username);
        onChange("referenceName", data.username);
      }
    });
}, [formData.referenceName, onChange]);

``

  return (
    <div className="space-y-4 text-sm">
      {/* Name Field */}
      <div className="relative">
        <input
          type="text"
          placeholder="Name *"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          className={`w-full border-b py-2 pr-10 outline-none ${
            submitted && isNameInvalid
              ? "border-red-500 placeholder:text-red-500"
              : "border-gray-300"
          }`}
        />
        <FaUser
          className={`absolute right-2 top-5 transform -translate-y-1/2 ${
            submitted && isNameInvalid ? "text-red-500" : "text-gray-400"
          }`}
        />
        {submitted && isNameInvalid && (
          <p className="text-xs text-red-500 mt-1">Field Required</p>
        )}
      </div>

      {/* Email Field */}
      <div className="relative">
        <input
          type="email"
          placeholder="Email ID *"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          className={`w-full border-b py-2 pr-8 outline-none ${
            submitted && isEmailInvalid
              ? "border-red-500 placeholder:text-red-500"
              : "border-gray-300"
          }`}
        />
        <FaEnvelope
          className={`absolute right-2 top-5 transform -translate-y-1/2 ${
            submitted && isEmailInvalid ? "text-red-500" : "text-gray-400"
          }`}
        />
        {submitted && isEmailInvalid && (
          <p className="text-xs text-red-500 mt-1">Invalid Email</p>
        )}
      </div>

      {/* Reference Name Field (Prefilled) */}
      <div className="relative">
        <input
          type="text"
          placeholder="Reference Name"
          value={formData.referenceName || ""}
          onChange={(e) => onChange("referenceName", e.target.value)}
          className="w-full border-b py-2 pr-8 outline-none border-gray-300"
        />
        <FaUser className="absolute right-2 top-2 text-gray-400" />
      </div>

      {/* Phone Field */}
      <div className="relative">
        <div
          className={`flex items-center border-b ${
            submitted && isPhoneInvalid ? "border-red-500" : "border-gray-300"
          }`}
        >
          {/* Country Code Selector */}
          <div
            className="relative flex items-center gap-1 px-2 py-2 cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <img src={selectedCountry.flag} alt="flag" className="w-5 h-4" />
            <span className="text-sm text-gray-700">{selectedCountry.code}</span>
            <span className="text-[8px]">▼</span>
            {dropdownOpen && (
              <div className="absolute z-10 top-full left-0 w-32 bg-white border shadow rounded mt-1">
                {countryOptions.map((opt) => (
                  <div
                    key={opt.flag}
                    className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedCountry(opt);
                      setDropdownOpen(false);
                    }}
                  >
                    <img src={opt.flag} alt={opt.code} className="w-5 h-4" />
                    <span className="text-sm">{opt.code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Phone Number Input */}
          <input
            type="tel"
            placeholder="Your Mobile Number *"
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className={`w-full border-b py-2 pr-8 outline-none ${
              submitted && isPhoneInvalid
                ? "border-red-500 placeholder:text-red-500"
                : "border-gray-300"
            }`}
          />
          <FaPhoneAlt
            className={`absolute right-2 top-5 transform -translate-y-1/2 ${
              submitted && isPhoneInvalid ? "text-red-500" : "text-gray-400"
            }`}
          />
        </div>
        {submitted && isPhoneInvalid && (
          <p className="text-xs text-red-500 mt-1">Please enter a valid number</p>
        )}
      </div>

      {/* Tax Exemption Checkbox */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          checked={formData.taxExemption}
          onChange={(e) => onChange("taxExemption", e.target.checked)}
          className="accent-red-500"
        />
        <label className="text-gray-600 text-xs">
          Do you want to receive tax exemption?
        </label>
      </div>

      {/* Address Field */}
      <div className="relative">
        <input
          type="text"
          placeholder="Address *"
          value={formData.address}
          onChange={(e) => onChange("address", e.target.value)}
          className="w-full border-b py-2 pr-8 outline-none border-gray-300"
        />
        <FaMapMarkerAlt className="absolute right-2 top-2 text-gray-400" />
      </div>

      {/* Extra Fields for Tax Exemption */}
      {formData.taxExemption && (
        <div className="space-y-4 mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Address Line 1"
              value={formData.addressLine1 || ""}
              onChange={(e) => onChange("addressLine1", e.target.value)}
              className="w-full border-b py-2 pr-8 outline-none border-gray-300"
            />
            <FaRegAddressCard className="absolute right-2 top-2 text-gray-400" />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Address Line 2"
              value={formData.addressLine2 || ""}
              onChange={(e) => onChange("addressLine2", e.target.value)}
              className="w-full border-b py-2 pr-8 outline-none border-gray-300"
            />
            <FaRegAddressCard className="absolute right-2 top-2 text-gray-400" />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="City"
              value={formData.city || ""}
              onChange={(e) => onChange("city", e.target.value)}
              className="w-full border-b py-2 pr-8 outline-none border-gray-300"
            />
            <FaCity className="absolute right-2 top-2 text-gray-400" />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="State"
              value={formData.state || ""}
              onChange={(e) => onChange("state", e.target.value)}
              className="w-full border-b py-2 pr-8 outline-none border-gray-300"
            />
            <FaGlobeAsia className="absolute right-2 top-2 text-gray-400" />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Pin Code"
              value={formData.pinCode || ""}
              onChange={(e) => onChange("pinCode", e.target.value)}
              className="w-full border-b py-2 pr-8 outline-none border-gray-300"
            />
            <FaHashtag className="absolute right-2 top-2 text-gray-400" />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="PAN Card"
              value={formData.panCard || ""}
              onChange={(e) => onChange("panCard", e.target.value)}
              className="w-full border-b py-2 pr-8 outline-none border-gray-300"
            />
            <FaIdCard className="absolute right-2 top-2 text-gray-400" />
          </div>
          <div className="relative mt-6 group">
            <input
              id="dob-input"
              type="date"
              value={formData.dob || ""}
              onChange={(e) => onChange("dob", e.target.value)}
              className="peer w-full border-b py-2 pr-8 outline-none border-gray-300"
            />
            <label
              htmlFor="dob-input"
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 
                   peer-focus:top-0 peer-focus:text-xs peer-focus:text-gray-500 
                   peer-valid:top-0 peer-valid:text-xs peer-valid:text-gray-500"
            >
              Date of Birth
            </label>
            <FaBirthdayCake className="absolute right-2 top-2 text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormFields;

