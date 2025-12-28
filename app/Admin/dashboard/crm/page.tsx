"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface CRMEntry {
  _id?: string;
  name: string;
  email: string;
  date: string;
  time: string;
  phone: string;
  message: string; 
  callType: 'incoming' | 'outgoing';
    followUp: 'yes' | 'no';  // Add this line

  status: 'pending' | 'contacted' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export default function CRMPage() {
  const [formData, setFormData] = useState<Omit<CRMEntry, '_id' | 'createdAt' | 'updatedAt'>>({ 
    name: '',
    email: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    phone: '',
    message: '',
    callType: 'incoming',
    followUp: 'no',
    status: 'pending'
  });
  const [entries, setEntries] = useState<CRMEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  // Fetch all entries
  const fetchEntries = async () => {
    try {
      console.log('Fetching entries...');
      const response = await fetch('/api/crm');
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      const { data } = await response.json();
      
      console.log('Raw API response data:', data); // Debug log
      
      // Transform the data to match our frontend format
      const formattedData = data.map((entry: any) => {
        const formattedEntry = {
          ...entry,
          date: entry.date ? new Date(entry.date).toISOString().split('T')[0] : '',
          callStatus: entry.callStatus || 'not_available'
        };
        
        console.log('Formatted entry:', formattedEntry); // Debug log
        return formattedEntry;
      });
      
      setEntries(formattedData);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const url = editingId ? `/api/crm?id=${editingId}` : '/api/crm';
      const method = editingId ? 'PUT' : 'POST';
      
      // Prepare the data to be sent
      const submissionData = {
        ...formData,
        // Ensure required fields have proper values
        status: formData.status || 'pending',
        // Ensure date is properly formatted for the API
        date: formData.date || new Date().toISOString().split('T')[0]
      };
      
      console.log('Submitting data:', submissionData); // Debug log
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to save entry');
      }
      
      // Reset form and refresh entries
      const resetForm = () => {
        setFormData({
          name: '',
          email: '',
          date: format(new Date(), 'yyyy-MM-dd'),
          time: format(new Date(), 'HH:mm'),
          phone: '',
          message: '',
          callType: 'incoming',
          followUp: 'no',
          status: 'pending'
        });
        setEditingId(null);
      };
      
      resetForm();
      await fetchEntries();
      
      // Show success message
      const savedData = (responseData.data || responseData) as CRMEntry;
      alert(`Entry saved successfully!`);
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (entry: CRMEntry) => {
    setFormData({
      name: entry.name,
      email: entry.email,
      date: entry.date || format(new Date(), 'yyyy-MM-dd'),
      time: entry.time || format(new Date(), 'HH:mm'),
      phone: entry.phone,
      message: entry.message,
      callType: entry.callType || 'incoming',
      followUp: entry.followUp || 'no',
      status: entry.status
    });
    setEditingId(entry._id || null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      const response = await fetch(`/api/crm/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete entry');
      }
      
      await fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete entry');
    }
  };

  const handleFollowUpClick = (id: string) => {
    setSelectedEntryId(id);
    
  };

  const handleFollowUpConfirm = async (confirmed: boolean) => {
    if (!selectedEntryId) return;
    
    try {
      const response = await fetch(`/api/crm/${selectedEntryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followUpConfirmed: confirmed,
          followUpConfirmedAt: confirmed ? new Date() : null
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update follow-up status');
      }
      
      await fetchEntries();
      alert(`Follow-up marked as ${confirmed ? 'confirmed' : 'not needed'}`);
    } catch (error) {
      console.error('Error updating follow-up status:', error);
      alert(error instanceof Error ? error.message : 'Failed to update follow-up status');
    } finally {
      
      setSelectedEntryId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">CRM Management</h1>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Entry' : 'Add New Entry'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label className="block text-gray-700 mb-2">
              Call Type
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="callType"
                  value="incoming"
                  checked={formData.callType === 'incoming'}
                  onChange={() => setFormData({...formData, callType: 'incoming'})}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Incoming</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="callType"
                  value="outgoing"
                  checked={formData.callType === 'outgoing'}
                  onChange={() => setFormData({...formData, callType: 'outgoing'})}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Outgoing</span>
              </label>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-2">
            <label className="block text-gray-700 mb-2">
              Follow Up Required
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="followUp"
                  value="yes"
                  checked={formData.followUp === 'yes'}
                  onChange={() => setFormData({...formData, followUp: 'yes'})}
                  className="h-4 w-4 text-green-600"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="followUp"
                  value="no"
                  checked={formData.followUp === 'no'}
                  onChange={() => setFormData({...formData, followUp: 'no'})}
                  className="h-4 w-4 text-red-600"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="message">
            subject
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        {/* <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Follow Up Required
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="followUp"
                value="yes"
                checked={formData.followUp === 'yes'}
                onChange={() => setFormData({...formData, followUp: 'yes'})}
                className="h-4 w-4 text-green-600"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="followUp"
                value="no"
                checked={formData.followUp === 'no'}
                onChange={() => setFormData({...formData, followUp: 'no'})}
                className="h-4 w-4 text-red-600"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div> */}
        
        <div className="flex justify-end space-x-2">
          {editingId && (
            <button
  type="button"
  onClick={() => {
    setFormData({ 
      name: '',
      email: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      phone: '',
      message: '',
      callType: 'incoming',
      status: 'pending',
      followUp: 'no'  // Added required field
    });
    setEditingId(null);
  }}
  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
>
  Cancel
</button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : editingId ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
      
      {/* Entries Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">CRM Entries</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Call Type
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              subject
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Follow Up
              </th>
              <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {entry.date && (
                      <>
                        <div className="font-medium">{format(new Date(entry.date), 'MMM dd, yyyy')}</div>
                        <div className="text-xs text-gray-500">{entry.time}</div>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entry.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {entry.phone || '-'}
                  </td>
                
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      entry.callType === 'incoming' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {entry.callType ? (entry.callType.charAt(0).toUpperCase() + entry.callType.slice(1)) : 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                    {entry.message || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      entry.followUp === 'yes' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {entry.followUp ? entry.followUp.toUpperCase() : 'NO'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      entry.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : entry.status === 'contacted' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {entry.status ? (entry.status.charAt(0).toUpperCase() + entry.status.slice(1)) : 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => entry._id && handleDelete(entry._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}