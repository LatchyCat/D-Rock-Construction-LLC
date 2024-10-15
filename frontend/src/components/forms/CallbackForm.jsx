import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import api from 'frontend/src/api/api.js';

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
    setSubmitStatus('submitting');
    try {
      const response = await api.post('/api/submit-callback', { formData });
      console.log('Callback request submitted successfully:', response.data);
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting callback request:', error.response || error);
      setSubmitStatus('error');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-700">Request a Callback</CardTitle>
        <CardDescription>Fill in the details and we'll get back to you soon.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredDate">Preferred Date</Label>
            <Input
              id="preferredDate"
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredTime">Preferred Time</Label>
            <Input
              id="preferredTime"
              type="time"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Submit Callback Request
          </Button>
        </form>
        {submitStatus === 'submitting' && (
          <p className="mt-4 text-center text-blue-600">Submitting your request...</p>
        )}
        {submitStatus === 'success' && (
          <div className="mt-4 flex items-center justify-center text-green-600">
            <CheckCircle className="mr-2" />
            <p>Callback request submitted successfully!</p>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mt-4 flex items-center justify-center text-red-600">
            <AlertCircle className="mr-2" />
            <p>Error submitting request. Please try again.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CallbackForm;
