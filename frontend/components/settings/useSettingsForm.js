import { useState } from 'react';

const useSettingsForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here, maybe send to an API or something similar
    console.log('Form Data:', formData);
  };

  return {
    formData,
    handleChange,
    handleSubmit
  };
};

export default useSettingsForm;
