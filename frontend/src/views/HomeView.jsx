import React, { useState, useEffect } from 'react';
import { getHomeData } from '../api/services';
import ChatComponent from '@/components/ChatComponent';
import ContactForm from '../components/forms/ContactForm'

const HomeView = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    console.log('showChat state:', showChat);
  }, [showChat])

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        console.log('Fetching home data...');
        const response = await getHomeData();
        console.log('Home data response:', response);
        setHomeData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching home data:', err);
        console.log('Error details:', {
          message: err.message,
          response: err.response,
          request: err.request,
          config: err.config
        });
        setError(`Failed to fetch home data: ${err.message}. ${err.response?.data?.error || ''}`);
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="home-view container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{homeData?.companyName || 'D-Rock Construction LLC'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">About Us</h2>
          <p><strong>Owner:</strong> {homeData?.firstName} {homeData?.lastName}</p>
          <p><strong>Year Started:</strong> {homeData?.yearStarted}</p>
          <p><strong>Field of Work:</strong> {homeData?.fieldOfWork}</p>
          <p><strong>Employees:</strong> {homeData?.employees}</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
          <p><strong>Specialties:</strong> {homeData?.specialties}</p>
          <p><strong>Hours of Operation:</strong> {homeData?.hoursOfOperation}</p>
          <p><strong>Quotes:</strong> {homeData?.quotes}</p>
          <p><strong>Prices for Specialty Jobs:</strong> {homeData?.pricesPerSpecialtyJobs}</p>
        </div>
      </div>

      <div className="mt-8">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            console.log('Button clicked, toggling showChat');
            setShowChat(prev => !prev);
          }}
        >
          {showChat ? 'Hide Chat' : 'Show Chat'}
        </button>
      </div>

      {showChat && (
        <div className="mt-4">
          <ChatComponent />
        </div>
      )}
    </div>
  );
};

export default HomeView;
