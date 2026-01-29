import React, { useEffect, useState } from "react";
import axios from "axios";
import ImpactCalculator from "./ImpactCalculator";
import { motion } from "framer-motion";
import { io as ioClient } from "socket.io-client";

/* =======================
   Impact Form CTA
======================= */
const ImpactFormCTA = ({ variants }) => (
  <motion.div
    variants={variants}
    className="mt-6 bg-[#06444F] border border-[#ECA90E]/30 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg w-full"
  >
    <div>
      <h3 className="text-lg font-semibold text-white">
        Impact Summary Incomplete?
      </h3>
      <p className="text-sm text-gray-200 mt-1 max-w-xl">
        If some of your donations are missing impact details, please complete
        this short form so we can accurately measure and showcase your
        contribution.
      </p>
    </div>

    <a
      href="https://docs.google.com/forms/d/1g11uQ2aF3megKNM9uJ4O8omMuSSvOY73fkvinCIxFC8/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center px-6 py-3 bg-[#ECA90E] hover:bg-[#D6990D] text-white font-semibold rounded-lg transition-colors duration-200 whitespace-nowrap"
    >
      Fill Impact Form
    </a>
  </motion.div>
);

function Donation() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [username, setUsername] = useState(null);

  /* =======================
     Fetch Donations
  ======================= */
  const fetchPayments = async (uname) => {
    try {
      const donationRes = await axios.get(
        "http://localhost:5000/api/donations",
        { params: { username: uname } }
      );

      setPayments(donationRes.data);

      const total = donationRes.data.reduce(
        (sum, p) => sum + p.amount,
        0
      );
      setTotalAmount(total);
    } catch (err) {
      console.error("Error fetching donations:", err);
    }
  };

  /* =======================
     Initial Load
  ======================= */
  useEffect(() => {
    const init = async () => {
      try {
        const storedUser = localStorage.getItem("googleUser");
        if (!storedUser) return;

        const { email } = JSON.parse(storedUser);
        const userRes = await axios.get(
          `http://localhost:5000/api/users/get-user/${email}`
        );

        const uname = userRes.data.username;
        setUsername(uname);

        await fetchPayments(uname);
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  /* =======================
     Socket Updates
  ======================= */
  useEffect(() => {
    if (!username) return;

    const socket = ioClient("http://localhost:5000");

    socket.on("paymentSuccess", (data) => {
      if (data.username === username) {
        fetchPayments(username);
      }
    });

    return () => socket.disconnect();
  }, [username]);

  /* =======================
     Animations
  ======================= */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  /* =======================
     UI
  ======================= */
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 md:p-6 bg-[#043238] min-h-screen"
    >
      <ImpactCalculator amountFromServer={totalAmount} />

      <motion.h2
        variants={itemVariants}
        className="text-2xl md:text-3xl font-bold text-white my-6"
      >
        Donation Records
      </motion.h2>

      {loading ? (
        /* Loading */
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-12 w-12 border-2 border-[#ECA90E] rounded-full border-t-transparent" />
        </div>
      ) : payments.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center gap-6 py-12">
  {/* Previous simple empty UI */}
  <p className="text-white text-center text-base">
    No donations found.
  </p>

  {/* Impact Form BELOW text */}
  <ImpactFormCTA variants={itemVariants} />
</div>
      ) : (
        /* Donations Exist */
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-[#ECA90E] text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Phone</th>
                </tr>
              </thead>
              <tbody className="bg-[#06444F]">
                {payments.map((p) => (
                  <tr key={p._id} className="border-b border-[#043238]">
                    <td className="px-6 py-4 text-white">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-white">
                      ₹{p.amount}
                    </td>
                    <td className="px-6 py-4 text-white">{p.name}</td>
                    <td className="px-6 py-4 text-white">{p.email}</td>
                    <td className="px-6 py-4 text-white">{p.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <motion.div
            className="md:hidden space-y-4"
            variants={containerVariants}
          >
            {payments.map((payment) => (
              <motion.div
                key={payment._id}
                variants={itemVariants}
                className="bg-[#06444F] rounded-lg p-4 shadow-md border border-[#ECA90E]/20 text-white"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#ECA90E]">Date</p>
                    <p>
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#ECA90E]">Amount</p>
                    <p className="font-medium">₹{payment.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#ECA90E]">Name</p>
                    <p>{payment.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#ECA90E]">Email</p>
                    <p className="truncate">{payment.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-[#ECA90E]">Phone</p>
                    <p>{payment.phone}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Impact Form AFTER records */}
          <ImpactFormCTA variants={itemVariants} />
        </>
      )}
    </motion.div>
  );
}

export default Donation;
