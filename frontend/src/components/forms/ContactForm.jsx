import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requestType: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prevData => ({
      ...prevData,
      requestType: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');

    try {
      // Replace '/api/contact' with your actual API endpoint
      await axios.post('/api/contact', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', requestType: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-700 text-center">Contact Wanderson Rocha</CardTitle>
        <CardDescription className="text-center">Schedule a call back or request a quote</CardDescription>
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
            <Label htmlFor="requestType">Request Type</Label>
            <Select id="requestType" name="requestType" onValueChange={handleSelectChange} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Request Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="callback">Schedule a Call Back</SelectItem>
                <SelectItem value="quote">Request a Quote</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Submit
          </Button>
        </form>
        {submitStatus === 'submitting' && (
          <p className="mt-4 text-center text-blue-600">Submitting your message...</p>
        )}
        {submitStatus === 'success' && (
          <div className="mt-4 flex items-center justify-center text-green-600">
            <CheckCircle className="mr-2" />
            <p>Your message has been sent successfully!</p>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mt-4 flex items-center justify-center text-red-600">
            <AlertCircle className="mr-2" />
            <p>An error occurred. Please try again later.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactForm;
