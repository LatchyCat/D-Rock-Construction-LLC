import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { AlertCircle, CheckCircle, Upload } from 'lucide-react';

// Configure axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,  // Remove the '/api' from here
    withCredentials: true
});

// Axios request interceptor for logging
api.interceptors.request.use(request => {
  console.log('Starting Request', request)
  return request
})

// Axios response interceptor for logging
api.interceptors.response.use(response => {
  console.log('Response:', response)
  return response
}, error => {
  console.log('Response Error:', error)
  return Promise.reject(error)
})

const categories = [
    { name: "Decks", description: "Custom-designed decks to enhance your outdoor living space." },
    { name: "Stairs", description: "Sturdy and stylish stairs that complement your home's architecture." },
    { name: "Handrails", description: "Safe and elegant handrails for added support and aesthetic appeal." },
    { name: "Screen Porches", description: "Enjoy the outdoors without the bugs with our custom screen porches." },
    { name: "Siding", description: "High-quality siding installation to protect and beautify your home." }
  ];


  const ReviewsView = () => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({
      title: '',
      description: '',
      category: '',
    });
    const [media, setMedia] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [submitStatus, setSubmitStatus] = useState('');

    useEffect(() => {
      const fetchReviews = async () => {
        setIsLoading(true);
        try {
          const response = await api.get('/api/reviews');
          if (Array.isArray(response.data)) {
            setReviews(response.data);
          } else {
            setError('Received unexpected data format from server');
          }
        } catch (error) {
          setError('Failed to fetch reviews. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchReviews();
    }, []);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewReview(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (value) => {
      setNewReview(prev => ({ ...prev, category: value }));
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.type.startsWith('video/')) {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = function() {
            window.URL.revokeObjectURL(video.src);
            if (this.duration > 20) {
              setError('Videos cannot be longer than 20 seconds');
              setMedia(null);
            } else {
              setError(null);
              setMedia(file);
            }
          }
          video.src = URL.createObjectURL(file);
        } else if (file.type.startsWith('image/')) {
          setError(null);
          setMedia(file);
        } else {
          setError('Invalid file type. Only images and videos are allowed.');
          setMedia(null);
        }
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitStatus('submitting');
      const formData = new FormData();
      formData.append('title', newReview.title);
      formData.append('description', newReview.description);
      formData.append('category', newReview.category);
      if (media) {
        formData.append('media', media);
      }

      try {
        const response = await axios.post('/api/reviews', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setReviews(prev => [response.data, ...prev]);
        setNewReview({ title: '', description: '', category: '' });
        setMedia(null);
        setError(null);
        setSubmitStatus('success');
      } catch (error) {
        console.error('Error creating review:', error);
        setError(error.response?.data?.error || 'Failed to create review. Please try again later.');
        setSubmitStatus('error');
      }
    };

    if (error) {
      return (
        <div className="container mx-auto p-4 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="container mx-auto p-4 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      );
    }


    return (
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Customer Reviews</h1>

          <Card className="mb-12 bg-white shadow-xl">
            <CardHeader className="bg-blue-700 text-white">
              <CardTitle className="text-2xl">Leave a Review</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="title"
                  placeholder="Review Title"
                  value={newReview.title}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Textarea
                  name="description"
                  placeholder="Review Description"
                  value={newReview.description}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Select onValueChange={handleCategoryChange} value={newReview.category}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    <span>Upload Media</span>
                  </label>
                  {media && <span className="text-sm text-gray-600">{media.name}</span>}
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Post Review
                </Button>
              </form>
              {submitStatus === 'submitting' && (
                <p className="mt-4 text-center text-blue-600">Submitting review...</p>
              )}
              {submitStatus === 'success' && (
                <div className="mt-4 flex items-center justify-center text-green-600">
                  <CheckCircle className="mr-2" />
                  <p>Your review has been posted successfully!</p>
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
            {reviews.length === 0 ? (
              <p className="text-center text-gray-600">No reviews available.</p>
            ) : (
              reviews.map((review) => (
                <Card key={review._id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-700">{review.title || 'No Title'}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {review.category || 'No Category'} -
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'No Date'}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{review.description || 'No Description'}</p>
                    {review.mediaUrl && (
                      review.mediaType === 'image' ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}${review.mediaUrl}`}
                          alt="Review media"
                          className="mt-4 max-w-full h-auto rounded-lg shadow-md"
                          onError={(e) => {
                            console.error('Image failed to load:', e);
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <video
                          src={`${import.meta.env.VITE_API_URL}${review.mediaUrl}`}
                          controls
                          className="mt-4 max-w-full h-auto rounded-lg shadow-md"
                          onError={(e) => {
                            console.error('Video failed to load:', e);
                            e.target.style.display = 'none';
                          }}
                        />
                      )
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  export default ReviewsView;
