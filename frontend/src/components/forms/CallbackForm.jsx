import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '/Users/latchy/d-rock-construction/frontend/src/api/api.js';

const CallbackForm = ({ onClose, conversationId }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('Submitting...');
    try {
      const response = await api.post('/api/submit-callback', { formData });
      console.log('Callback request submitted successfully:', response.data);
      setSubmitStatus('Callback request submitted successfully!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting callback request:', error.response || error);
      setSubmitStatus('Error submitting callback request. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Request a Callback</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="tel"
            name="phone"
            placeholder="Your Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <Input
            type="email" // Email input
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="date" // Added date input
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="preferredTime"
            placeholder="Preferred Callback Time"
            value={formData.preferredTime}
            onChange={handleChange}
            required
          />
          <Button type="submit" className="w-full">Submit Callback Request</Button>
        </form>
        {submitStatus && <p className="mt-4 text-center">{submitStatus}</p>}
      </CardContent>
    </Card>
  );
};

export default CallbackForm;
