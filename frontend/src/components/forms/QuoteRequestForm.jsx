import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '/Users/latchy/d-rock-construction/frontend/src/api/api.js';

const QuoteRequestForm = ({ onClose, conversationId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    otherProjectType: '',
    projectDescription: '',
    estimatedBudget: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectChange = (name) => (value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus('Submitting...');
    try {
      console.log('Submitting quote request:', formData);
      const response = await api.post('/api/submit-quote', { formData });
      console.log('Quote request response:', response.data);
      setSubmitStatus('Your quote request has been submitted successfully!');
      setTimeout(() => onClose(), 3000);
    } catch (error) {
      console.error('Error submitting quote request:', error.response || error);
      setSubmitStatus('An error occurred. Please try again later.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Request a Quote</CardTitle>
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
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
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
          <Select name="projectType" onValueChange={handleSelectChange('projectType')} required>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Project Type" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-lg border border-gray-200">
              <SelectItem value="decks">Decks</SelectItem>
              <SelectItem value="stairs">Stairs</SelectItem>
              <SelectItem value="handrails">Handrails</SelectItem>
              <SelectItem value="screen-porches">Screen Porches</SelectItem>
              <SelectItem value="siding">Siding</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {formData.projectType === 'other' && (
            <Input
              type="text"
              name="otherProjectType"
              placeholder="Please specify your project type"
              value={formData.otherProjectType}
              onChange={handleChange}
              required
            />
          )}
          <Textarea
            name="projectDescription"
            placeholder="Project Description"
            value={formData.projectDescription}
            onChange={handleChange}
            required
          />
          <Select name="estimatedBudget" onValueChange={handleSelectChange('estimatedBudget')} required>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Estimated Budget" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-lg border border-gray-200">
              <SelectItem value="0-10000">$0 - $10,000</SelectItem>
              <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
              <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
              <SelectItem value="50000+">$50,000+</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full">Submit Quote Request</Button>
        </form>
        {submitStatus && <p className="mt-4 text-center">{submitStatus}</p>}
      </CardContent>
    </Card>
  );
};

export default QuoteRequestForm;
