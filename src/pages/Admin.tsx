import { useEffect, useState, useRef, Fragment } from 'react';
import { supabase } from '../lib/supabase';
import { Download, Trash2, Eye, EyeOff, CheckCircle, Edit3, Save, X, Plus, LogOut, User, Shield, History, Upload, Menu, Home, MessageSquare, Users, Settings, BarChart3, BookOpen, Car, Globe, Palette, Briefcase, Building, ChevronDown, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

/**
 * Interface for registration data
 * Represents user registration submissions
 */
interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  service: string;
  message: string;
  created_at: string;
}

/**
 * Interface for user messages
 * Represents contact form submissions
 */
interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

/**
 * Admin Dashboard Component
 * Centralized management interface for registrations, messages, and user data
 * Provides CRUD operations for registrations, messages, and users
 * Features export capabilities and real-time data visualization
 */
export default function Admin() {
  // Authentication context
  const { user, signOut } = useAuth();
  
  // State management for different data types
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Registration>>({ 
    full_name: '', 
    email: '', 
    phone: '', 
    country: '', 
    service: '', 
    message: '' 
  });
  
  // State for tab navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'registrations' | 'messages' | 'users'>('dashboard');

  
  // Export dropdown state
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{show: boolean, id: string | null, type: string | null}>({show: false, id: null, type: null});
  

  
  // Access translations and current language
  const { translations, language } = useLanguage();
  
  // Available services for registration forms
  const availableServices = [
    'MANÉ Immigration',
    'Auto-École Mane d\'Afrique',
    'Mane Multi-Linguistique',
    'Mane Innovation',
    'Mane Graphic Design'
  ];

  /**
   * Effect hook to fetch initial data when component mounts
   * Loads registrations, messages, and content items
   */
  useEffect(() => {
    fetchRegistrations();
    fetchMessages();
    fetchUsers();

  }, []);



  /**
   * Function to fetch users from database
   */
  const fetchUsers = async () => {
    if (!user || user.role !== 'admin') return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        console.warn('Users table not found');
        return;
      }
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  /**
   * Function to fetch user messages from database
   * Orders messages by creation date (newest first)
   */
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  /**
   * Function to fetch user registrations from database
   * Orders registrations by submission date (newest first)
   */
  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setIsLoading(false);
    }
  };





  /**
   * Function to initialize content table with sample data
   * Creates default content items for all website sections
   */


  /**
   * Function to toggle row expansion in data tables
   * Shows/hides additional details for registrations and messages
   */
  const toggleRowExpansion = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  /**
   * Function to handle edit button clicks for registrations
   * Populates edit form with existing registration data
   */
  const handleEdit = (id: string) => {
    const registration = registrations.find(r => r.id === id);
    if (registration) {
      setEditingId(id);
      setEditForm(registration);
    }
  };

  /**
   * Function to save edited registration data
   * Updates database record and refreshes local state
   */
  const saveEdit = async () => {
    if (!editingId) return;

    try {
      // Check if the editingId belongs to a registration or message
      const isRegistration = registrations.some(r => r.id === editingId);
      
      if (isRegistration) {
        const { error } = await supabase
          .from('registrations')
          .update(editForm)
          .eq('id', editingId);

        if (error) throw error;
        await fetchRegistrations();
      } else {
        // This is a message edit
        const { error } = await supabase
          .from('messages')
          .update({
            name: editForm.full_name,
            email: editForm.email,
            phone: editForm.phone,
            subject: editForm.service || 'Message Update', // Using service field temporarily
            message: editForm.message
          })
          .eq('id', editingId);

        if (error) throw error;
        await fetchMessages();
      }

      setEditingId(null);
      setEditForm({ full_name: '', email: '', phone: '', country: '', service: '', message: '' });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  /**
   * Function to delete a registration record
   * Removes record from database and updates local state
   */
  const deleteRegistration = async (id: string) => {
    setDeleteConfirmation({show: true, id, type: 'registration'});
  };
  
  const confirmDeleteRegistration = async () => {
    const id = deleteConfirmation.id;
    if (id) {
      try {
        const { error } = await supabase
          .from('registrations')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        await fetchRegistrations();
        alert('Registration deleted successfully');
      } catch (error) {
        console.error('Error deleting registration:', error);
        alert('Error deleting registration: ' + (error as Error).message);
      } finally {
        setDeleteConfirmation({show: false, id: null, type: null});
      }
    }
  };

  /**
   * Function to delete a message record
   * Removes record from database and updates local state
   */
  const deleteMessage = async (id: string) => {
    setDeleteConfirmation({show: true, id, type: 'message'});
  };
  
  const confirmDeleteMessage = async () => {
    const id = deleteConfirmation.id;
    if (id) {
      try {
        const { error } = await supabase
          .from('messages')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        await fetchMessages();
        alert('Message deleted successfully');
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Error deleting message: ' + (error as Error).message);
      } finally {
        setDeleteConfirmation({show: false, id: null, type: null});
      }
    }
  };

  /**
   * Function to export registration data as CSV
   * Generates downloadable file with all registration records
   */
  const exportToCSV = () => {
    // Create CSV header
    const headers = ['Name', 'Email', 'Phone', 'Country', 'Service', 'Message', 'Date'];
    const csvContent = [
      headers.join(','),
      ...registrations.map(reg => [
        `"${reg.full_name}"`,
        `"${reg.email}"`,
        `"${reg.phone}"`,
        `"${reg.country}"`,
        `"${reg.service}"`,
        `"${reg.message}"`,
        `"${new Date(reg.created_at).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    // Create downloadable file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `registrations-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = async () => {
    // Dynamically import xlsx library only when needed
    const { utils, writeFile } = await import('xlsx');
    
    const wsData = [
      ['Name', 'Email', 'Phone', 'Country', 'Service', 'Message', 'Date'],
      ...registrations.map(reg => [
        reg.full_name,
        reg.email,
        reg.phone,
        reg.country,
        reg.service,
        reg.message,
        new Date(reg.created_at).toLocaleDateString()
      ])
    ];
    
    const ws = utils.aoa_to_sheet(wsData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Registrations');
    
    writeFile(wb, `registrations-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = async () => {
    // Dynamically import jsPDF and jspdf-autotable only when needed
    const jsPDF = (await import('jspdf')).default;
    await import('jspdf-autotable');
    
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Registrations Report', 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Prepare data for the table
    const tableData = registrations.map(reg => [
      reg.full_name,
      reg.email,
      reg.phone,
      reg.country,
      reg.service,
      reg.message,
      new Date(reg.created_at).toLocaleDateString()
    ]);
    
    // Add the table to the PDF
    (doc as any).autoTable({
      head: [['Name', 'Email', 'Phone', 'Country', 'Service', 'Message', 'Date']],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [10, 61, 145], // #0A3D91
        textColor: [255, 255, 255],
        fontSize: 11
      }
    });
    
    doc.save(`registrations-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToDOC = async () => {
    // Dynamically import docx library only when needed
    const { Document, Packer, Paragraph, Table, TableRow, TableCell, HeadingLevel } = await import('docx');
    
    // Create a document with registration data
    const docData = [
      {
        text: 'Registrations Report',
        heading: HeadingLevel.HEADING_1,
      },
      {
        text: `Generated on: ${new Date().toLocaleString()}`,
        heading: HeadingLevel.HEADING_2,
      },
      // Create a table for the registrations
      new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph('Name')]
              }),
              new TableCell({
                children: [new Paragraph('Email')]
              }),
              new TableCell({
                children: [new Paragraph('Phone')]
              }),
              new TableCell({
                children: [new Paragraph('Country')]
              }),
              new TableCell({
                children: [new Paragraph('Service')]
              }),
              new TableCell({
                children: [new Paragraph('Message')]
              }),
              new TableCell({
                children: [new Paragraph('Date')]
              })
            ]
          }),
          ...registrations.map(reg => new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(reg.full_name)] }),
              new TableCell({ children: [new Paragraph(reg.email)] }),
              new TableCell({ children: [new Paragraph(reg.phone)] }),
              new TableCell({ children: [new Paragraph(reg.country)] }),
              new TableCell({ children: [new Paragraph(reg.service)] }),
              new TableCell({ children: [new Paragraph(reg.message)] }),
              new TableCell({ children: [new Paragraph(new Date(reg.created_at).toLocaleDateString())] })
            ]
          }))
        ]
      })
    ];
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: docData.map(item => {
          if (item instanceof Table) {
            return item;
          } else {
            return new Paragraph({
              text: item.text,
              heading: item.heading
            });
          }
        })
      }]
    });
    
    // Generate and download the document
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `registrations-${new Date().toISOString().split('T')[0]}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Function to handle content edit button clicks
   * Populates edit form with existing content data
   */










  /**
   * Function to handle tab navigation
   * Updates active tab state
   */
  const handleTabChange = (tab: 'dashboard' | 'registrations' | 'messages' | 'users') => {
    setActiveTab(tab);
  };





  /**
   * Function to delete a user
   * Removes user record from database
   */
  const deleteUser = async (id: string) => {
    setDeleteConfirmation({show: true, id, type: 'user'});
  };
  
  const confirmDeleteUser = async () => {
    const id = deleteConfirmation.id;
    if (id) {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        await fetchUsers();
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user: ' + (error as Error).message);
      } finally {
        setDeleteConfirmation({show: false, id: null, type: null});
      }
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mx-auto" style={{ borderColor: '#0A3D91' }}></div>
          <p className="mt-4 text-lg font-medium text-gray-700">{translations.adminRegistrations}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold" style={{ color: '#0A3D91' }}>Admin Panel</span>
          </div>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {/* Dashboard */}
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-100 text-blue-800 border-r-4 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              Dashboard
            </button>




            {/* Data Management */}
            <button
              onClick={() => handleTabChange('registrations')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 ${
                activeTab === 'registrations'
                  ? 'bg-blue-100 text-blue-800 border-r-4 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="h-5 w-5 mr-3" />
              {translations.adminRegistrations}
            </button>
            
            <button
              onClick={() => handleTabChange('messages')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 ${
                activeTab === 'messages'
                  ? 'bg-blue-100 text-blue-800 border-r-4 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              {translations.adminMessages}
            </button>
            
            <button
              onClick={() => handleTabChange('users')}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 ${
                activeTab === 'users'
                  ? 'bg-blue-100 text-blue-800 border-r-4 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              {translations.adminUsers}
            </button>
            

          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-20">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'registrations' && translations.adminRegistrations}
                {activeTab === 'messages' && translations.adminMessages}
                {activeTab === 'users' && translations.adminUsers}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {user?.full_name} • {user?.role}
              </div>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-1" />
                {translations.logout}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                      <p className="text-2xl font-semibold text-gray-900">{registrations.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Messages</p>
                      <p className="text-2xl font-semibold text-gray-900">{messages.length}</p>
                    </div>
                  </div>
                </div>
                


              </div>
              
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">New registration received</p>
                      <p className="text-sm text-gray-500">
                        {registrations.length > 0 
                          ? `From ${registrations[0]?.full_name || 'Unknown'} on ${new Date(registrations[0]?.created_at || '').toLocaleDateString()}` 
                          : 'No recent registrations'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">New message received</p>
                      <p className="text-sm text-gray-500">
                        {messages.length > 0 
                          ? `From ${messages[0]?.name || 'Unknown'} on ${new Date(messages[0]?.created_at || '').toLocaleDateString()}` 
                          : 'No recent messages'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}







          {/* Registrations Tab */}
          {activeTab === 'registrations' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold" style={{ color: '#0A3D91' }}>
                    {translations.adminRegistrations}
                  </h2>
                  <div className="relative">
                    <button
                      onClick={() => setShowExportDropdown(!showExportDropdown)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white"
                      style={{ backgroundColor: '#0A3D91' }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {translations.exportToCSV}
                      <svg className="-mr-1 ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {showExportDropdown && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1" role="menu">
                          <button
                            onClick={() => {
                              exportToCSV();
                              setShowExportDropdown(false);
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            Export as CSV
                          </button>
                          <button
                            onClick={() => {
                              exportToExcel();
                              setShowExportDropdown(false);
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            Export as Excel
                          </button>
                          <button
                            onClick={() => {
                              exportToPDF();
                              setShowExportDropdown(false);
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            Export as PDF
                          </button>
                          <button
                            onClick={() => {
                              exportToDOC();
                              setShowExportDropdown(false);
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            Export as DOC
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {registrations.map((registration) => (
                        <Fragment key={registration.id}>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{registration.full_name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {registration.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {registration.service}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(registration.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => toggleRowExpansion(registration.id)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                {expandedRows.has(registration.id) ? 'Hide' : 'View'}
                              </button>
                              <button
                                onClick={() => handleEdit(registration.id)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteRegistration(registration.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                          {expandedRows.has(registration.id) && (
                            <tr>
                              <td colSpan={5} className="px-6 py-4 bg-gray-50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Phone</p>
                                    <p className="text-sm text-gray-500">{registration.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Country</p>
                                    <p className="text-sm text-gray-500">{registration.country}</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <p className="text-sm font-medium text-gray-900">Message</p>
                                    <p className="text-sm text-gray-500">{registration.message}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {editingId && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Registration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          value={editForm.full_name || ''}
                          onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={editForm.email || ''}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          type="text"
                          value={editForm.phone || ''}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={saveEdit}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditForm({ full_name: '', email: '', phone: '', country: '', service: '', message: '' });
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-xl font-semibold" style={{ color: '#0A3D91' }}>
                  {translations.adminMessages}
                </h2>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {messages.map((message) => (
                        <Fragment key={message.id}>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{message.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {message.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {message.subject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(message.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => toggleRowExpansion(message.id)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                {expandedRows.has(message.id) ? 'Hide' : 'View'}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(message.id);
                                  setEditForm({
                                    full_name: message.name,
                                    email: message.email,
                                    phone: message.phone || '',
                                    country: '',
                                    service: '',
                                    message: message.message
                                  });
                                }}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteMessage(message.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                          {expandedRows.has(message.id) && (
                            <tr>
                              <td colSpan={5} className="px-6 py-4 bg-gray-50">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Message</p>
                                  <p className="text-sm text-gray-500">{message.message}</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-xl font-semibold" style={{ color: '#0A3D91' }}>
                  {translations.adminUsers}
                </h2>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((userItem) => (
                        <tr key={userItem.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {userItem.full_name || userItem.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {userItem.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {userItem.role || 'user'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {userItem.status || 'active'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteUser(userItem.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}




          {/* Delete Confirmation Modal */}
          {deleteConfirmation.show && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">
                  {deleteConfirmation.type === 'message' && 'Are you sure you want to delete this message? This action cannot be undone.'}
                  {deleteConfirmation.type === 'registration' && 'Are you sure you want to delete this registration? This action cannot be undone.'}
                  {deleteConfirmation.type === 'user' && 'Are you sure you want to delete this user? This action cannot be undone.'}
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmation({show: false, id: null, type: null})}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (deleteConfirmation.type === 'message') {
                        confirmDeleteMessage();
                      } else if (deleteConfirmation.type === 'registration') {
                        confirmDeleteRegistration();
                      } else if (deleteConfirmation.type === 'user') {
                        confirmDeleteUser();
                      }
                    }}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
