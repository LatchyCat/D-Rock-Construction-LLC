import React from 'react';
import { useState } from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { TextArea } from "../components/ui/TextArea";
import { Button } from '../components/ui/Button';
import ChatComponent from '../components/ChatComponent';

const ContactView = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setSubmitStatus('success');
    }, 1500);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };


  return (
    <div className="bg-gray-100 min-h-screen py-12 relative">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-12 text-blue-800">Contact D-Rock Construction</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white shadow-xl">
            <CardHeader className="bg-blue-700 text-white">
              <CardTitle className="text-2xl">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <TextArea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Send Message
                </Button>
              </form>
              {submitStatus === 'submitting' && (
                <p className="mt-4 text-center text-blue-600">Sending message...</p>
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

          <div className="space-y-6">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="flex items-center text-gray-700">
                  <Phone className="mr-3 text-blue-600" />
                  <a href="tel:843-302-2743" className="hover:text-blue-600 transition-colors duration-300">(843)-302-2743</a>
                </p>
                <p className="flex items-center text-gray-700">
                  <Mail className="mr-3 text-blue-600" />
                  <a href="mailto:D-RockConstructionllc1@gmail.com" className="hover:text-blue-600 transition-colors duration-300">D-RockConstructionllc1@gmail.com</a>
                </p>
                <p className="flex items-center text-gray-700">
                  <MapPin className="mr-3 text-blue-600" /> Charleston, South Carolina
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-6 justify-center">
                  <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors duration-300"><Facebook size={28} /></a>
                  <a href="#" className="text-pink-600 hover:text-pink-800 transition-colors duration-300"><Instagram size={28} /></a>
                  <a href="#" className="text-blue-400 hover:text-blue-600 transition-colors duration-300"><Twitter size={28} /></a>
                  <a href="#" className="text-blue-700 hover:text-blue-900 transition-colors duration-300"><Linkedin size={28} /></a>
                  <a href="#" className="text-red-600 hover:text-red-800 transition-colors duration-300"><Youtube size={28} /></a>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-gray-700"><span className="font-semibold">Monday - Friday:</span> 8:00 AM - 6:00 PM</p>
                <p className="text-gray-700"><span className="font-semibold">Saturday:</span> 9:00 AM - 2:00 PM</p>
                <p className="text-gray-700"><span className="font-semibold">Sunday:</span> Closed</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chatbot Toggle Button */}
        <Button
          className="fixed bottom-6 right-6 rounded-full p-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          onClick={toggleChat}
        >
          <MessageCircle size={24} />
        </Button>

        {/* Chatbot Component */}
        {isChatOpen && (
          <div className="fixed bottom-24 right-6 w-80 h-96 bg-white shadow-2xl rounded-lg overflow-hidden">
            <Card className="h-full">
              <CardHeader className="bg-blue-700 text-white">
                <CardTitle className="flex justify-between items-center">
                  D-Rock Bot
                  <Button size="sm" variant="ghost" onClick={toggleChat} className="text-white hover:text-blue-200">
                    &times;
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)] overflow-y-auto">
                <ChatComponent />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactView;
