// app/Admin/dashboard/contactus/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export default function AdminContactUsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contact');
        if (!response.ok) throw new Error('Failed to fetch contacts');
        const data = await response.json();
        setContacts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Error loading contacts');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const toggleMessage = (id: string) => {
    setExpandedMessage(expandedMessage === id ? null : id);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      new: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800'
    };
    
    const statusText = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`}>
        {statusText}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Contact Form Submissions</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all contact form submissions received through the website.
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Phone
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {contacts.length > 0 ? (
                    contacts.map((contact) => (
                      <tr key={contact._id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {contact.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-900">
                            {contact.email}
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {contact.phone || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {getStatusBadge(contact.status)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(contact.createdAt).toLocaleString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => toggleMessage(contact._id)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            {expandedMessage === contact._id ? 'Hide Message' : 'View Message'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No contact form submissions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {expandedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  Message from {contacts.find(c => c._id === expandedMessage)?.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setExpandedMessage(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {contacts.find(c => c._id === expandedMessage)?.message}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setExpandedMessage(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}