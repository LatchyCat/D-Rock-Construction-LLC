// File: api/controllers/HomeController.js

const HomeController = {
  getHomeData: function(req, res) {
    console.log('getHomeData function called');
    try {
      const homeData = {
        companyName: 'D-Rock Construction LLC',
        firstName: 'Wanderson',
        lastName: 'Rocha',
        phoneNumber: '843-302-2743',
        email: 'D-ROCKCONSTRUCTION@hotmail.com',
        hoursOfOperation: '8:00am to 5:30pm EST',
        fieldOfWork: 'Charleston County',
        specialties: 'Customized Exterior Trim',
        employees: 'Subcontractors are hired in advance per project',
        quotes: 'Free',
        yearStarted: 'Aug 2008',
        pricesPerSpecialtyJobs: 'Contact us for details'
      };
      console.log('Sending home data:', homeData);
      res.json(homeData);
    } catch (error) {
      console.error('Error in getHomeData:', error);
      res.status(500).json({ error: 'Error fetching home data' });
    }
  }
};

module.exports = HomeController;
