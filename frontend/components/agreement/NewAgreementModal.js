import React, { useState } from 'react';

const NewAgreementModal = ({ modalOpen, setModalOpen, createAgreement }) => {
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [tenantPubKey, setTenantPubKey] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [lateFee, setLateFee] = useState('');

  if (!modalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const agreementData = {
      endDate,
      monthlyPrice,
      dueDate,
      lateFee,
    };
    createAgreement(agreementData); 
    setModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <form className="bg-white p-6 rounded-lg" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Create New Agreement</h2>
        <div className="mb-4">
          <label htmlFor="tenantPubKey" className="block mb-2">Tenant Public Key</label>
          <input type="number" id="tenantPubKey" value={tenantPubKey} onChange={(e) => setTenantPubKey(e.target.value)} className="p-2 border rounded-lg w-full"/>
        </div> 
        <div className="mb-4">
          <label htmlFor="startDate" className="block mb-2">Start Date</label>
          <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded-lg w-full"/>
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block mb-2">End Date</label>
          <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded-lg w-full"/>
        </div>
        <div className="mb-4">
          <label htmlFor="monthlyPrice" className="block mb-2">Monthly Price ($)</label>
          <input type="number" id="monthlyPrice" value={monthlyPrice} onChange={(e) => setMonthlyPrice(e.target.value)} className="p-2 border rounded-lg w-full"/>
        </div>
        <div className="mb-4">
          <label htmlFor="dueDate" className="block mb-2">Due Date (Monthly)</label>
          <input type="number" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="p-2 border rounded-lg w-full"/>
        </div>
        <div className="mb-4">
          <label htmlFor="lateFee" className="block mb-2">Late Fee ($)</label>
          <input type="number" id="lateFee" value={lateFee} onChange={(e) => setLateFee(e.target.value)} className="p-2 border rounded-lg w-full"/>
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Create</button>
        </div>
      </form>
    </div>
  );
};

export default NewAgreementModal;
