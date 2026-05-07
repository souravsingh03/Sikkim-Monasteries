import React, { useState } from 'react';
import { submitDonation } from './services/api';
import { useAuth } from './context/AuthContext';
import {
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle,
  Banknote,
  Heart,
  Home,
  ChevronLeft,
  Mountain,
  Leaf,
  Users,
} from 'lucide-react';

// Main App component
export default function DonatePage() {
  const { user } = useAuth();
  const [step, setStep] = useState('form');
  const [donationError, setDonationError] = useState('');
  const [donationLoading, setDonationLoading] = useState(false);
  const [amount, setAmount] = useState(500);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('General Fund');
  const [paymentMethod, setPaymentMethod] = useState('');

  const renderForm = () => (
    <div className="w-full p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-blue-100 dark:border-slate-700 text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Make a Difference
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">
          Your donation goes directly to the heart of the monasteries.
        </p>
      </div>

      {/* Donation Amount */}
      <div className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">
            Enter Amount (INR)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="500"
            className="w-full rounded-2xl px-4 py-2 text-lg text-center bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Donation Purpose */}
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
            Choose a Donation Purpose
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {['General Fund', 'Monastery Preservation', 'Community Aid'].map((p) => (
              <button
                key={p}
                onClick={() => setPurpose(p)}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300
                  ${purpose === p
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 transform scale-105'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-400'
                }`}
              >
                {p === 'General Fund' && <Heart className="h-6 w-6 mb-2" />}
                {p === 'Monastery Preservation' && <Mountain className="h-6 w-6 mb-2" />}
                {p === 'Community Aid' && <Banknote className="h-6 w-6 mb-2" />}
                <span className="text-sm font-medium">{p}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Donor Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
            Your Information
          </h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Full Name"
            className="w-full rounded-2xl px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email Address"
            className="w-full rounded-2xl px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
            Select Payment Method
          </h3>
          <div className="flex flex-col gap-3">
            {['Card', 'Paytm / UPI', 'Net Banking'].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex items-center gap-2 rounded-2xl justify-center py-3 border-2 transition-all duration-300
                  ${paymentMethod === method
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 transform scale-105'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-400'
                }`}
              >
                {method === 'Card' && <CreditCard className="h-5 w-5" />}
                {method === 'Paytm / UPI' && <Smartphone className="h-5 w-5" />}
                {method === 'Net Banking' && <Wallet className="h-5 w-5" />}
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Proceed Button */}
        <button
          onClick={() => {
            if (!amount || amount <= 0 || !name || !email || !purpose || !paymentMethod) {
              console.error('Please fill in all details to proceed.');
              return;
            }
            setStep('payment');
          }}
          className="w-full rounded-2xl py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:opacity-90 transition-all duration-300 shadow-md"
        >
          Proceed to Pay ₹{amount}
        </button>
      </div>

      <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-6">
        100% secure payments • You’ll receive a confirmation email
      </p>
    </div>
  );

  const renderPaymentPage = () => (
    <div className="w-full p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-blue-100 dark:border-slate-700 text-center">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setStep('form')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition">
          <ChevronLeft className="h-6 w-6 text-slate-500 dark:text-slate-400" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Payment Details
        </h2>
        <div></div>
      </div>

      <div className="space-y-4 text-center mb-6">
        <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-950 rounded-xl">
          <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">Amount:</p>
          <p className="text-lg font-bold text-blue-800 dark:text-blue-300">₹{amount}</p>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          <span className="font-semibold">Purpose:</span> {purpose}
        </p>
        <p className="text-slate-600 dark:text-slate-400">
          <span className="font-semibold">Name:</span> {name}
        </p>
        <p className="text-slate-600 dark:text-slate-400">
          <span className="font-semibold">Email:</span> {email}
        </p>
        <p className="text-slate-600 dark:text-slate-400">
          <span className="font-semibold">Payment Method:</span> {paymentMethod}
        </p>
      </div>

      {/* Payment Form (Simulated) */}
      <div className="mb-6">
        {paymentMethod === 'Paytm / UPI' && (
          <div className="flex flex-col items-center">
            <p className="text-center font-medium text-lg text-slate-700 dark:text-slate-300 mb-4">Scan to pay with UPI</p>
            {/* Using a placeholder for the QR code */}
            <img src="/images/QR_paytem.jpeg" alt="UPI QR Code" className="w-48 h-48 rounded-lg shadow-md mb-4" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Open your UPI app (Paytm, GPay, PhonePe, etc.) and scan the QR code to complete the payment.
            </p>
          </div>
        )}
        {paymentMethod === 'Card' && (
          <div className="space-y-4">
            <input type="text" placeholder="Card Number" className="w-full rounded-xl px-4 py-3 bg-slate-100 dark:bg-slate-700" />
            <div className="flex gap-4">
              <input type="text" placeholder="MM/YY" className="w-1/2 rounded-xl px-4 py-3 bg-slate-100 dark:bg-slate-700" />
              <input type="text" placeholder="CVV" className="w-1/2 rounded-xl px-4 py-3 bg-slate-100 dark:bg-slate-700" />
            </div>
            <input type="text" placeholder="Cardholder Name" className="w-full rounded-xl px-4 py-3 bg-slate-100 dark:bg-slate-700" />
          </div>
        )}
        {(paymentMethod === 'Net Banking' || paymentMethod === 'Card') && (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Click 'Pay Now' to be redirected to the secure payment gateway.
          </p>
        )}
      </div>

      {donationError && (
        <p className="text-sm text-red-500 text-center mb-2">{donationError}</p>
      )}
      <button
        disabled={donationLoading}
        onClick={async () => {
          setDonationError('');
          setDonationLoading(true);
          try {
            await submitDonation({ name, email, amount: Number(amount), purpose, paymentMethod });
            setStep('thankyou');
          } catch (err) {
            setDonationError(err.message || 'Payment failed. Please try again.');
          } finally {
            setDonationLoading(false);
          }
        }}
        className="w-full rounded-2xl py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:opacity-90 transition-all duration-300 shadow-md disabled:opacity-60"
      >
        {donationLoading ? 'Processing...' : `Pay ₹${amount}`}
      </button>
    </div>
  );

  const renderThankYou = () => (
    <div className="w-full p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-blue-100 dark:border-slate-700 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6 animate-pulse" />
      <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
        Donation Successful!
      </h2>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Thank you, <span className="font-semibold">{name}</span>, for your generous contribution.
      </p>
      <div className="text-center space-y-2 mb-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
        <p className="font-medium text-slate-700 dark:text-slate-300">
          Amount: <span className="font-bold">₹{amount}</span>
        </p>
        <p className="font-medium text-slate-700 dark:text-slate-300">
          Purpose: <span>{purpose}</span>
        </p>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        A confirmation email and receipt have been sent to <span className="font-medium">{email}</span>.
      </p>
      <button
        onClick={() => {
          setStep('form');
          setAmount(500);
          setName('');
          setEmail('');
          setPurpose('General Fund');
          setPaymentMethod('');
        }}
        className="flex items-center justify-center gap-2 w-full rounded-2xl py-3 font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition"
      >
        <Home className="h-4 w-4" />
        Donate Again
      </button>
    </div>
  );

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 font-sans flex items-center justify-center">
      <div className="max-w-xl mx-auto py-12">
        <div className="flex flex-col gap-8 items-start">
          <div className="w-full p-8 bg-blue-50 dark:bg-blue-950 rounded-3xl shadow-inner border border-blue-100 dark:border-blue-800">
            <h3 className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4 text-center">
              What Your Donation Supports
            </h3>
            <ul className="space-y-6 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <Leaf className="w-6 h-6 text-blue-500 dark:text-blue-300 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    Monastery Conservation
                  </h4>
                  <p className="text-sm">
                    Funding for the repair and restoration of ancient structures, artifacts, and sacred murals.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-6 h-6 text-blue-500 dark:text-blue-300 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    Community Empowerment
                  </h4>
                  <p className="text-sm">
                    Support for monastic education, healthcare, and sustainable livelihood projects for the local community.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Home className="w-6 h-6 text-blue-500 dark:text-blue-300 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                    Day-to-day Operations
                  </h4>
                  <p className="text-sm">
                    Contributions to cover daily necessities, food, and utilities for the monks and residents.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          {step === 'form' && renderForm()}
        </div>
        {step === 'payment' && renderPaymentPage()}
        {step === 'thankyou' && renderThankYou()}
      </div>
    </div>
  );
}
