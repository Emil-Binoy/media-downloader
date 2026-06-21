import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:8000/api';
const API_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

export const getMediaInfo = async (url) => {
  try {
    const response = await axios.get(`${API_URL}/media-info`, {
      params: { url }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'An error occurred while fetching media info';
  }
};

export const downloadMedia = async (url, type, quality, clientId, downloadId) => {
  try {
    // For downloads, we need to handle blob response
    const response = await axios.post(`${API_URL}/download`, {
      url,
      type,
      quality,
      clientId,
      downloadId
    }, {
      responseType: 'blob'
    });
    
    // Extract filename from content-disposition header if available
    let filename = type === 'audio' ? 'download.mp3' : 'download.mp4';
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch.length === 2) {
        filename = filenameMatch[1];
      }
    }

    // Create a download link and trigger it
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
    
    return true;
  } catch (error) {
    if (error.response && error.response.data instanceof Blob) {
      // Parse blob error
      const text = await error.response.data.text();
      try {
        const json = JSON.parse(text);
        throw json.error;
      } catch (e) {
        throw 'Download failed';
      }
    }
    throw error.response?.data?.error || 'An error occurred while downloading';
  }
};
