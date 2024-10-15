import React, { useState, useEffect } from 'react';
import { getHomeData } from '../api/services';
import ChatComponent from '../components/ChatComponent';
import ContactForm from '../components/forms/ContactForm';

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
        const response = await getHomeData();
        setHomeData(response.data);
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch home data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-center py-10 text-red-600 bg-red-100 rounded-lg">{error}</div>;


  return (
    <div className="home-view bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-8 text-center text-blue-800">{homeData?.companyName || 'D-Rock Construction LLC'}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-semibold mb-6 text-blue-700">About Us</h2>
            <div className="space-y-4">
              <p><span className="font-semibold">Owner:</span> {homeData?.firstName} {homeData?.lastName}</p>
              <p><span className="font-semibold">Year Started:</span> {homeData?.yearStarted}</p>
              <p><span className="font-semibold">Field of Work:</span> {homeData?.fieldOfWork}</p>
              <p><span className="font-semibold">Employees:</span> {homeData?.employees}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-semibold mb-6 text-blue-700">Our Services</h2>
            <div className="space-y-4">
              <p><span className="font-semibold">Specialties:</span> {homeData?.specialties}</p>
              <p><span className="font-semibold">Hours of Operation:</span> {homeData?.hoursOfOperation}</p>
              <p><span className="font-semibold">Quotes:</span> {homeData?.quotes}</p>
              <p><span className="font-semibold">Prices for Specialty Jobs:</span> {homeData?.pricesPerSpecialtyJobs}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => setShowChat(prev => !prev)}
          >
            {showChat ? 'Hide Chat' : 'Chat with Us'}
          </button>
        </div>

        {showChat && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <ChatComponent />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;
