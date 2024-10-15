import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { ChatProvider } from './components/ChatProvider'; 
import HomeView from './views/HomeView';
import ServicesView from './views/ServicesView';
import ReviewsView from './views/ReviewsView';
import ContactView from './views/ContactView';


function App() {
  return (
    <ChatProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/services" element={<ServicesView />} />
            <Route path="/reviews" element={<ReviewsView />} />
            <Route path="/contact" element={<ContactView />} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </Router>
    </ChatProvider>
  );
}

export default App;
