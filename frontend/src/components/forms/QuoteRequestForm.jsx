import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';
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
    setSubmitStatus('submitting');
    try {
      const response = await api.post('/api/submit-quote', { formData, conversationId });
      console.log('Quote request response:', response.data);
      setSubmitStatus('success');
      setTimeout(() => onClose(), 3000);
    } catch (error) {
      console.error('Error submitting quote request:', error.response || error);
      setSubmitStatus('error');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-700">Request a Quote</CardTitle>
        <CardDescription>Fill out the form below to get a quote for your project.</CardDescription>
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
            <Label htmlFor="projectType">Project Type</Label>
            <Select name="projectType" onValueChange={handleSelectChange('projectType')} required>
              <SelectTrigger id="projectType" className="w-full bg-white">
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
          </div>
          {formData.projectType === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="otherProjectType">Specify Project Type</Label>
              <Input
                id="otherProjectType"
                type="text"
                name="otherProjectType"
                placeholder="Please specify your project type"
                value={formData.otherProjectType}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="projectDescription">Project Description</Label>
            <Textarea
              id="projectDescription"
              name="projectDescription"
              placeholder="Please describe your project in detail"
              value={formData.projectDescription}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimatedBudget">Estimated Budget</Label>
            <Select name="estimatedBudget" onValueChange={handleSelectChange('estimatedBudget')} required>
              <SelectTrigger id="estimatedBudget" className="w-full bg-white">
                <SelectValue placeholder="Select Estimated Budget" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg border border-gray-200">
                <SelectItem value="0-10000">$0 - $10,000</SelectItem>
                <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                <SelectItem value="50000+">$50,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Submit Quote Request
          </Button>
        </form>
        {submitStatus === 'submitting' && (
          <p className="mt-4 text-center text-blue-600">Submitting your request...</p>
        )}
        {submitStatus === 'success' && (
          <div className="mt-4 flex items-center justify-center text-green-600">
            <CheckCircle className="mr-2" />
            <p>Your quote request has been submitted successfully!</p>
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

export default QuoteRequestForm;
