// src/api/chatbot.js
import axios from 'axios';

const API_URL = '/api'; // Assuming your frontend is served by the same server

export const sendMessage = async (message, conversationType, customFields, conversationId) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, {
      message,
      conversationType,
      customFields,
      conversationId
    });
    return {
      message: response.data.message,
      conversationId: response.data.conversationId,
      stage: response.data.stage,
      sentiment: response.data.sentiment,
      entities: response.data.entities,
      intent: response.data.intent, // New field for recognized intent
      confidenceScore: response.data.confidenceScore // New field for intent confidence score
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getProactiveEngagement = async (userId, pageVisited, timeSpent) => {
  try {
    const response = await axios.post(`${API_URL}/proactive-engagement`, {
      userId,
      pageVisited,
      timeSpent
    });
    return {
      message: response.data.message,
      shouldEngage: response.data.shouldEngage, // New field to indicate if engagement should occur
      engagementReason: response.data.engagementReason // New field to explain why engagement was triggered
    };
  } catch (error) {
    console.error('Error getting proactive engagement:', error);
    throw error;
  }
};

export const getFAQAnswer = async (question) => {
  try {
    const response = await axios.post(`${API_URL}/faq`, { question });
    return {
      answer: response.data.answer,
      confidence: response.data.confidence, // New field for answer confidence
      relatedQuestions: response.data.relatedQuestions // New field for suggesting related questions
    };
  } catch (error) {
    console.error('Error getting FAQ answer:', error);
    throw error;
  }
};

export const getConversation = async (conversationId) => {
  try {
    const response = await axios.get(`${API_URL}/conversation/${conversationId}`);
    return {
      ...response.data,
      analysis: response.data.analysis // New field for conversation analysis
    };
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw error;
  }
};

export const trainModel = async (trainingData) => {
  try {
    const response = await axios.post(`${API_URL}/train`, { trainingData });
    return {
      success: response.data.success,
      modelPerformance: response.data.modelPerformance // New field for model training results
    };
  } catch (error) {
    console.error('Error training model:', error);
    throw error;
  }
};

export const getModelPerformance = async () => {
  try {
    const response = await axios.get(`${API_URL}/model-performance`);
    return response.data; // Returns various metrics about the model's performance
  } catch (error) {
    console.error('Error getting model performance:', error);
    throw error;
  }
};
