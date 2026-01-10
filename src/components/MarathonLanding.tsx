"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  Camera,
  CreditCard,
  PersonStanding,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { toast } from "sonner";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Register GSAP plugin
gsap.registerPlugin(useGSAP);

const initialFormData = {
  applicantName: "John Doe",
  fathersName: "Robert Doe",
  gender: "Male",
  age: "25",
  mobile: "9876543210",
  emergencyContactNumber: "9123456789",
  emergencyContactName: "Jane Doe",
  villageTown: "Green Valley",
  postOffice: "Central PO",
  policeStation: "Main Station",
  district: "North District",
  // Documents
  passportPhoto: null as File | null,
  aadhaarCard: null as File | null,
};

export default function MarathonLanding() {
  const [formData, setFormData] = useState(initialFormData);

  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-derived category for logic
  const [runCategory, setRunCategory] = useState("");

  useEffect(() => {
    if (formData.gender === "Male") {
      setRunCategory("6 KM Run");
    } else if (formData.gender === "Female") {
      setRunCategory("4 KM Run");
    } else {
      setRunCategory("");
    }
  }, [formData.gender]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderSelect = (gender: string) => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "passportPhoto" | "aadhaarCard"
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!declarationChecked) return;

    setIsSubmitting(true);

    try {
      // Exclude file objects from JSON payload as they won't serialize correctly
      // and requirements said "let images not save for now"
      const { passportPhoto, aadhaarCard, ...payload } = formData;

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success(
        "Thank you for participating! Your registration is complete."
      );
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      toast.error(
        "Something went wrong. Please check your inputs and try again."
      );
    }
  };

  // Animations
  useGSAP(() => {
    gsap.from(".animate-in", {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out",
    });
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-12">
      {/* Navbar / Header Logo Area */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0 relative overflow-hidden">
            {/* Placeholder for WBP Logo */}
            <img
              src="https://wbp.gov.in/wbp/assets/images/wbp_logo.png"
              alt="WBP"
              className="w-full h-full object-contain p-1"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <span className="absolute inset-0 flex items-center justify-center opacity-0">
              WBP
            </span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Run for Dignity
            </h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">
              Purba Bardhaman Police District
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Info Section (Hero + Details) */}
        <div className="grid md:grid-cols-3 gap-6 animate-in">
          {/* Banner */}
          <div className="md:col-span-2 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl shadow-lg p-8 text-white flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-4">Join the Run</h2>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Calendar size={18} /> 18 Jan 2026
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Clock size={18} /> 7:00 AM
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <MapPin size={18} /> Katwa Stadium
              </div>
            </div>
          </div>

          {/* Quick Info / Helpline */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-green-600" /> 90462 54945
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-green-600" /> 03453-255023
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-red-500 font-bold mb-1">
                Application Deadline
              </p>
              <p className="text-lg font-bold text-gray-800">
                14 Jan 2026, 6:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Main Application Form */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden animate-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-green-700 p-4 text-white flex items-center justify-center gap-2">
            <PersonStanding className="w-6 h-6" />
            <h2 className="text-xl font-bold tracking-wide">
              Participant Registration
            </h2>
          </div>

          {isSuccess ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Application Submitted!
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Your registration for Run for Dignity has been received
                successfully. Please carry your ID proof on the event day.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({
                    applicantName: "",
                    fathersName: "",
                    gender: "",
                    age: "",
                    mobile: "",
                    emergencyContactNumber: "",
                    emergencyContactName: "",
                    villageTown: "",
                    postOffice: "",
                    policeStation: "",
                    district: "",
                    passportPhoto: null,
                    aadhaarCard: null,
                  });
                  setRunCategory("");
                  setDeclarationChecked(false);
                }}
                className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-10">
              {/* Personal Details Section */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-orange-400 rounded-full"></div>
                  <h3 className="text-orange-500 font-bold text-lg">
                    Personal Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Name */}
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Applicant Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="applicantName"
                      required
                      value={formData.applicantName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition bg-white"
                    />
                  </div>

                  {/* Father's Name */}
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Father's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fathersName"
                      required
                      value={formData.fathersName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition bg-white"
                    />
                  </div>

                  {/* Gender Selection */}
                  <div className="col-span-2 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleGenderSelect("Male")}
                        className={cn(
                          "py-3 px-4 border rounded-lg flex items-center justify-center gap-2 transition-all font-medium",
                          formData.gender === "Male"
                            ? "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        )}
                      >
                        {formData.gender === "Male" && (
                          <CheckCircle2 size={16} />
                        )}{" "}
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGenderSelect("Female")}
                        className={cn(
                          "py-3 px-4 border rounded-lg flex items-center justify-center gap-2 transition-all font-medium",
                          formData.gender === "Female"
                            ? "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        )}
                      >
                        {formData.gender === "Female" && (
                          <CheckCircle2 size={16} />
                        )}{" "}
                        Female
                      </button>
                    </div>
                    {runCategory && (
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        Selected Category: {runCategory}
                      </p>
                    )}
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      required
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition bg-white"
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition bg-white"
                    />
                  </div>

                  {/* Emergency Contact Number */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Emergency Contact Number{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="emergencyContactNumber"
                      required
                      value={formData.emergencyContactNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition bg-white"
                    />
                  </div>

                  {/* Emergency Contact Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Emergency Contact Person Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      required
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-orange-400 rounded-full"></div>
                  <h3 className="text-orange-500 font-bold text-lg">Address</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Village/Town */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Village/Town <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="villageTown"
                      required
                      value={formData.villageTown}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition bg-white"
                    />
                  </div>

                  {/* Post Office */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Post Office <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="postOffice"
                      required
                      value={formData.postOffice}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition bg-white"
                    />
                  </div>

                  {/* Police Station */}
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Police Station <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="policeStation"
                      placeholder="Enter Police Station name"
                      required
                      value={formData.policeStation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition bg-white"
                    />
                  </div>

                  {/* District */}
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      District <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="district"
                      required
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-orange-400 rounded-full"></div>
                  <h3 className="text-orange-500 font-bold text-lg">
                    Documents
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Passport Photo */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition cursor-pointer relative group bg-white">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "passportPhoto")}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Camera size={24} className="text-gray-500" />
                    </div>
                    <h4 className="font-bold text-gray-800">
                      Passport Photo <span className="text-red-500">*</span>
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {formData.passportPhoto
                        ? formData.passportPhoto.name
                        : "Click to upload"}
                    </p>
                  </div>

                  {/* Aadhaar Card */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition cursor-pointer relative group bg-white">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(e, "aadhaarCard")}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <CreditCard size={24} className="text-gray-500" />
                    </div>
                    <h4 className="font-bold text-gray-800">
                      Aadhaar Card <span className="text-red-500">*</span>
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {formData.aadhaarCard
                        ? formData.aadhaarCard.name
                        : "Click to upload"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Declaration & Submit */}
              <div className="pt-6 border-t border-gray-100">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-center mt-1">
                    <input
                      type="checkbox"
                      required
                      checked={declarationChecked}
                      onChange={(e) => setDeclarationChecked(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-green-500 checked:bg-green-500 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                    />
                    <CheckCircle2
                      className="pointer-events-none absolute h-3.5 w-3.5 left-0.5 mt-0.5 text-white opacity-0 peer-checked:opacity-100"
                      strokeWidth={3}
                    />
                  </div>
                  <span className="text-xs md:text-sm text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                    I hereby declare that I am physically fit to participate in
                    the run. I will participate at my own risk and will follow
                    all instructions issued by the organizers, police, and
                    volunteers. I understand that the organizers are not
                    responsible for any injury, loss, or accident during the
                    event.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting || !declarationChecked}
                  className="w-full bg-[#AFB42B] hover:bg-[#9E9D24] text-white font-bold text-lg py-5 rounded-xl shadow-lg hover:shadow-xl transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-8 uppercase tracking-wide"
                  style={{
                    background:
                      "linear-gradient(90deg, #E6BE8A 0%, #A4B270 100%)",
                  }} // Attempting to match that specific gradient in screenshot (Tan to Greenish)
                >
                  {isSubmitting
                    ? "Submitting Application..."
                    : "Submit Application"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
