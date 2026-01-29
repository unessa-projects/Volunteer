import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import AmountSelector from './AmountSelector';
import FormFields from './FormFields';
import axios from 'axios';
import { IoIosArrowBack } from 'react-icons/io';

const Form = () => {
  const [amount, setAmount] = useState(2500);
  const [customAmount, setCustomAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const paymentHandledRef = useRef(false); // 🔒 IMPORTANT

  const [searchParams] = useSearchParams();
  const refName = searchParams.get("ref");

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    anonymous: false,
    referenceName: refName || '',
  });

  const baseAmount = Number(customAmount) || amount;

  // Load Razorpay once
  useEffect(() => {
    if (window.Razorpay) return;

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (isPaying) return; // 🔒 stop double clicks
    setSubmitted(true);

    const isInvalid =
      formData.name.trim() === '' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
      !/^[6-9]\d{9}$/.test(formData.phone);

    if (isInvalid) return;

    try {
      setIsPaying(true);

      const res = await axios.post('http://localhost:5000/api/create-order', {
        ...formData,
        amount: baseAmount,
      });

      const { orderId, amount, currency, key } = res.data;

      const options = {
        key,
        amount,
        currency,
        order_id: orderId,
        name: formData.anonymous ? 'Anonymous Donor' : formData.name,

        handler: async function (response) {
          // 🔒 ensure handler runs ONCE
          if (paymentHandledRef.current) return;
          paymentHandledRef.current = true;

          try {
            await axios.post('http://localhost:5000/api/process-payment', {
              name: formData.name,
              referenceName: formData.referenceName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              amount: baseAmount,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              upiId: response.vpa || ''
            });

            setShowThankYou(true);

            setTimeout(() => {
              window.location.replace(
                "https://unessafoundation.org/donor-profile-form/"
              );
            }, 1500);

          } catch (err) {
            console.error('❌ Payment processing failed:', err);
            alert('Payment failed. Please contact support.');
            setIsPaying(false);
            paymentHandledRef.current = false;
          }
        },

        prefill: {
          ...(formData.anonymous ? {} : {
            name: formData.name,
            email: formData.email,
          }),
          contact: formData.phone,
        },

        notes: {
          ...(formData.anonymous ? {} : { address: formData.address }),
        },

        theme: {
          color: '#00B5AD',
        },

        modal: {
          ondismiss: () => {
            setIsPaying(false);
            paymentHandledRef.current = false;
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error('❌ Order creation failed:', err);
      alert('Failed to start payment. Please try again.');
      setIsPaying(false);
    }
  };

  useEffect(() => {
  const urlRef = searchParams.get("ref");

  if (urlRef) {
    setFormData(prev => ({
      ...prev,
      referenceName: urlRef,
    }));
  }
}, [searchParams]);

  return (
    <div className="relative min-h-screen w-full">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src="https://unessafoundation.org/donate/"
          className="w-full h-full border-none blur-md"
          title="Donation Background"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-20 flex justify-center items-center min-h-screen px-4 py-10">
        <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-6">

          {/* Header */}
          <div className="relative flex items-center mb-4 border-b pb-3">
            <button
              className="absolute left-0 text-[#00B5AD] text-xl"
              onClick={() => setShowConfirmation(true)}
            >
              <IoIosArrowBack />
            </button>

            <h2 className="mx-auto text-[#00B5AD] font-semibold">
              Choose a contribution amount
            </h2>
          </div>

          <p className="text-center text-sm text-gray-500 mb-4">
            Most contributors give around{' '}
            <span className="text-[#00B5AD] font-semibold">₹2500</span>
          </p>

          <AmountSelector
            presetAmounts={[1000, 2500, 4000]}
            amount={amount}
            setAmount={setAmount}
            customAmount={customAmount}
            setCustomAmount={setCustomAmount}
          />

          <FormFields
            formData={formData}
            onChange={handleFormChange}
            submitted={submitted}
          />

          {showThankYou && (
            <div className="p-3 mt-4 text-center text-green-700 font-semibold bg-green-100 rounded-md">
              ✅ Payment successful. Redirecting...
            </div>
          )}

          <button
            type="button"
            disabled={isPaying}
            onClick={handleSubmit}
            className={`w-full py-3 mt-4 rounded-full font-semibold transition
              ${isPaying
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#00B5AD] text-white hover:bg-[#009C96]'}`}
          >
            {isPaying ? 'Processing…' : `Proceed To Contribute ₹${baseAmount}`}
          </button>

          <p className="text-xs text-center text-gray-400 mt-4">
            By continuing, you agree to our{' '}
            <a
              href="https://unessafoundation.org/terms-and-conditions/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00B5AD] underline"
            >
              Terms and conditions
            </a>
          </p>
        </div>
      </div>

      {/* Exit Confirmation */}
      {showConfirmation && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <p className="mb-6">
              <strong>Please don’t go yet!</strong><br />
              With just ₹300, you can help a child’s education.
            </p>
            <div className="flex flex-col gap-3">
              <button
                className="bg-[#00B5AD] text-white py-2 rounded-lg"
                onClick={() => setShowConfirmation(false)}
              >
                Yes, I will help
              </button>
              <button
                className="text-gray-500 py-2 rounded-lg hover:bg-gray-200"
                onClick={() =>
                  window.location.replace("https://unessafoundation.org/donate/")
                }
              >
                Sorry, not today
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Form;
