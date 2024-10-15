import React, { useState } from 'react';
import axios from 'axios';
import BrasilMode from '../components/BrasilMode';
import SpanishMode from '../components/SpanishMode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ServicesView = () => {
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    requestType: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const content = {
    en: {
      title: "Our Services",
      subtitle: "Expert Exterior Trim Solutions",
      quote: '"Built to Last"',
      description: "At D-Rock Construction LLC, we specialize in delivering top-quality exterior trim services. Our expert team, led by Wanderson Rocha, ensures that every project is completed with precision and durability.",
      services: [
        { name: "Decks", description: "Custom-designed decks to enhance your outdoor living space." },
        { name: "Stairs", description: "Sturdy and stylish stairs that complement your home's architecture." },
        { name: "Handrails", description: "Safe and elegant handrails for added support and aesthetic appeal." },
        { name: "Screen Porches", description: "Enjoy the outdoors without the bugs with our custom screen porches." },
        { name: "Siding", description: "High-quality siding installation to protect and beautify your home." }
      ],
      contact: "Contact us",
      phoneLabel: "Phone",
      formTitle: "Schedule Callback or Quote",
      namePlaceholder: "Your Name",
      emailPlaceholder: "Your Email",
      phonePlaceholder: "Your Phone Number",
      requestTypePlaceholder: "Select Request Type",
      messagePlaceholder: "Your Message",
      submitButton: "Submit",
      callbackOption: "Schedule a Call Back",
      quoteOption: "Request a Quote"
    },
    pt: {
      title: "Nossos Serviços",
      subtitle: "Soluções Especializadas em Acabamento Exterior",
      quote: '"Construído para Durar"',
      description: "Na D-Rock Construction LLC, nos especializamos em fornecer serviços de acabamento exterior de alta qualidade. Nossa equipe de especialistas, liderada por Wanderson Rocha, garante que cada projeto seja concluído com precisão e durabilidade.",
      services: [
        { name: "Decks", description: "Decks personalizados para melhorar seu espaço ao ar livre." },
        { name: "Escadas", description: "Escadas robustas e elegantes que complementam a arquitetura da sua casa." },
        { name: "Corrimãos", description: "Corrimãos seguros e elegantes para maior suporte e apelo estético." },
        { name: "Varandas com Tela", description: "Aproveite o ar livre sem insetos com nossas varandas teladas personalizadas." },
        { name: "Revestimento", description: "Instalação de revestimento de alta qualidade para proteger e embelezar sua casa." }
      ],
      contact: "Entre em contato",
      phoneLabel: "Telefone",
      formTitle: "Entre em Contato",
      namePlaceholder: "Seu Nome",
      emailPlaceholder: "Seu Email",
      phonePlaceholder: "Seu Número de Telefone",
      requestTypePlaceholder: "Selecione o Tipo de Solicitação",
      messagePlaceholder: "Sua Mensagem",
      submitButton: "Enviar",
      callbackOption: "Agendar uma Ligação",
      quoteOption: "Solicitar um Orçamento"
    },
    es: {
      title: "Nuestros Servicios",
      subtitle: "Soluciones Expertas en Acabados Exteriores",
      quote: '"Construido para Durar"',
      description: "En D-Rock Construction LLC, nos especializamos en ofrecer servicios de acabado exterior de alta calidad. Nuestro equipo de expertos, dirigido por Wanderson Rocha, garantiza que cada proyecto se complete con precisión y durabilidad.",
      services: [
        { name: "Terrazas", description: "Terrazas diseñadas a medida para mejorar su espacio al aire libre." },
        { name: "Escaleras", description: "Escaleras robustas y elegantes que complementan la arquitectura de su hogar." },
        { name: "Barandillas", description: "Barandillas seguras y elegantes para mayor soporte y atractivo estético." },
        { name: "Porches con Mosquitero", description: "Disfrute del aire libre sin insectos con nuestros porches con mosquitero personalizados." },
        { name: "Revestimiento", description: "Instalación de revestimiento de alta calidad para proteger y embellecer su hogar." }
      ],
      contact: "Contáctenos",
      phoneLabel: "Teléfono",
      formTitle: "Contáctenos",
      namePlaceholder: "Su Nombre",
      emailPlaceholder: "Su Correo Electrónico",
      phonePlaceholder: "Su Número de Teléfono",
      requestTypePlaceholder: "Seleccione el Tipo de Solicitud",
      messagePlaceholder: "Su Mensaje",
      submitButton: "Enviar",
      callbackOption: "Programar una Llamada",
      quoteOption: "Solicitar un Presupuesto"
    }
  };

  const {
    title, subtitle, quote, description, services, contact, phoneLabel,
    formTitle, namePlaceholder, emailPlaceholder, phonePlaceholder,
    requestTypePlaceholder, messagePlaceholder, submitButton,
    callbackOption, quoteOption
  } = content[language];

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
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-blue-800">{title}</h1>
          <div className="flex space-x-4">
            <BrasilMode language={language} setLanguage={setLanguage} />
            <SpanishMode language={language} setLanguage={setLanguage} />
          </div>
        </div>

        <h2 className="text-3xl text-center mb-8 text-blue-700">{subtitle}</h2>
        <p className="text-2xl italic text-center mb-8 text-gray-600">"{quote}" - Wanderson Rocha</p>
        <p className="text-lg mb-12 text-gray-700 max-w-3xl mx-auto">{description}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-700">{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mb-16">
          <h3 className="text-3xl font-semibold mb-4 text-blue-800">{contact}</h3>
          <p className="text-xl">
            <strong className="text-blue-700">{phoneLabel}:</strong>{' '}
            <a href="tel:843-302-2743" className="text-blue-600 hover:underline">843-302-2743</a>
          </p>
        </div>

        <Card className="w-full max-w-lg mx-auto bg-white shadow-xl">
          <CardHeader className="bg-blue-700 text-white">
            <CardTitle className="text-2xl">{formTitle}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="name"
                placeholder={namePlaceholder}
                value={formData.name}
                onChange={handleChange}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Input
                type="email"
                name="email"
                placeholder={emailPlaceholder}
                value={formData.email}
                onChange={handleChange}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Input
                type="tel"
                name="phone"
                placeholder={phonePlaceholder}
                value={formData.phone}
                onChange={handleChange}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Select name="requestType" onValueChange={handleSelectChange} required>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder={requestTypePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="callback">{callbackOption}</SelectItem>
                  <SelectItem value="quote">{quoteOption}</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                name="message"
                placeholder={messagePlaceholder}
                value={formData.message}
                onChange={handleChange}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {submitButton}
              </Button>
            </form>
            {submitStatus === 'submitting' && (
              <p className="mt-4 text-center text-blue-600">Submitting...</p>
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
      </div>
    </div>
  );
};

export default ServicesView;
