import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Download, Trash2, Eye, EyeOff, CheckCircle, Edit3, Save, X, Plus, LogOut, User, Shield, History, Upload } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

/**
 * Interface for content management items
 * Defines the structure for editable content in the CMS
 */
interface ContentItem {
  id: string;
  section: string;
  key: string;
  englishText: string;
  frenchText: string;
  imageUrl?: string | null;
}

/**
 * Interface for content versions
 * Tracks changes to content items for rollback capability
 */
interface ContentVersion {
  id: string;
  contentItemId: string;
  version: number;
  englishText: string;
  frenchText: string;
  imageUrl?: string | null;
  createdBy: string;
  createdAt: string;
}

/**
 * Interface for editable content (without ID)
 * Used for form inputs when editing content
 */
interface EditableContent extends Omit<ContentItem, 'id'> {
  imageUrl?: string | null;
}

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
 * Centralized management interface for all website content and user data
 * Provides CRUD operations for registrations, messages, and content items
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
  
  // State for tab navigation and content management
  const [activeTab, setActiveTab] = useState<'registrations' | 'content' | 'messages' | 'immigration' | 'driving-school' | 'languages' | 'innovation' | 'graphic-design' | 'content-versions' | 'users'>('registrations');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contentVersions, setContentVersions] = useState<ContentVersion[]>([]);
  const [contentEditingId, setContentEditingId] = useState<string | null>(null);
  const [contentEditForm, setContentEditForm] = useState<EditableContent>({ 
    section: '', 
    key: '', 
    englishText: '', 
    frenchText: '',
    imageUrl: null 
  });
  const [selectedContentItemId, setSelectedContentItemId] = useState<string | null>(null);
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    fetchContentItems();
    fetchContentVersions();
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
   * Function to fetch content items from database
   * Initializes content table if it doesn't exist
   */
  const fetchContentItems = async () => {
    try {
      // Fetch content items from Supabase
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('section', { ascending: true });

      if (error) {
        // If table doesn't exist, create it with sample data
        console.warn('Content table not found, creating with sample data');
        await initializeContentTable();
        return;
      }

      setContentItems(data || []);
    } catch (error) {
      console.error('Error fetching content items:', error);
    }
  };

  /**
   * Function to fetch content versions from database
   * Used for rollback functionality
   */
  const fetchContentVersions = async () => {
    try {
      const { data, error } = await supabase
        .from('content_versions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Content versions table not found');
        return;
      }

      setContentVersions(data || []);
    } catch (error) {
      console.error('Error fetching content versions:', error);
    }
  };

  /**
   * Function to upload image to Supabase storage
   * @param file - The file to upload
   * @returns Promise<string> - The public URL of the uploaded image
   */
  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        throw error;
      }
      
      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Function to initialize content table with sample data
   * Creates default content items for all website sections
   */
  const initializeContentTable = async () => {
    try {
      // Sample content data for initialization
      const sampleContent = [
        // Home page content
        { section: 'home-hero', key: 'title', englishText: 'Welcome to MANÉ GROUP', frenchText: 'Bienvenue chez MANÉ GROUP' },
        { section: 'home-hero', key: 'subtitle', englishText: 'Your trusted partner for immigration, education, and technology services', frenchText: 'Votre partenaire de confiance pour les services d\'immigration, d\'éducation et de technologie' },
        { section: 'home-hero', key: 'cta-button', englishText: 'Explore Our Services', frenchText: 'Explorer Nos Services' },
        
        // About page content
        { section: 'about-hero', key: 'title', englishText: 'About MANÉ GROUP', frenchText: 'À Propos de MANÉ GROUP' },
        { section: 'about-mission', key: 'title', englishText: 'Our Mission', frenchText: 'Notre Mission' },
        { section: 'about-mission', key: 'description', englishText: 'To empower individuals and businesses through innovative solutions and exceptional service', frenchText: 'Autonomiser les individus et les entreprises grâce à des solutions innovantes et un service exceptionnel' },
        
        // Services content
        { section: 'services-hero', key: 'title', englishText: 'Our Services', frenchText: 'Nos Services' },
        { section: 'services-immigration', key: 'title', englishText: 'Immigration Services', frenchText: 'Services d\'Immigration' },
        { section: 'services-driving', key: 'title', englishText: 'Driving School', frenchText: 'Auto-École' },
        { section: 'services-languages', key: 'title', englishText: 'Language Training', frenchText: 'Formation Linguistique' },
        { section: 'services-innovation', key: 'title', englishText: 'Innovation Hub', frenchText: 'Centre d\'Innovation' },
        { section: 'services-design', key: 'title', englishText: 'Graphic Design', frenchText: 'Design Graphique' },
        
        // Contact page content
        { section: 'contact-hero', key: 'title', englishText: 'Contact Us', frenchText: 'Contactez-Nous' },
        { section: 'contact-hero', key: 'subtitle', englishText: 'We\'re here to help you achieve your goals', frenchText: 'Nous sommes ici pour vous aider à atteindre vos objectifs' },
        { section: 'contact', key: 'map', englishText: '', frenchText: '', imageUrl: null },
                { section: 'contact', key: 'address', englishText: '123 Business Street, City, Country', frenchText: '123 Rue des Affaires, Ville, Pays', imageUrl: null }
      ];

      // Insert sample content into database
      const { error } = await supabase
        .from('content')
        .insert(sampleContent);

      if (error) throw error;

      // Refresh content items after initialization
      await fetchContentItems();
    } catch (error) {
      console.error('Error initializing content table:', error);
    }
  };

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
      const { error } = await supabase
        .from('registrations')
        .update(editForm)
        .eq('id', editingId);

      if (error) throw error;

      setEditingId(null);
      setEditForm({ full_name: '', email: '', phone: '', country: '', service: '', message: '' });
      await fetchRegistrations();
    } catch (error) {
      console.error('Error saving registration:', error);
    }
  };

  /**
   * Function to delete a registration record
   * Removes record from database and updates local state
   */
  const deleteRegistration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchRegistrations();
    } catch (error) {
      console.error('Error deleting registration:', error);
    }
  };

  /**
   * Function to delete a message record
   * Removes record from database and updates local state
   */
  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
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

  /**
   * Function to handle content edit button clicks
   * Populates edit form with existing content data
   */
  const handleContentEdit = (id: string) => {
    const content = contentItems.find(c => c.id === id);
    if (content) {
      setContentEditingId(id);
      setContentEditForm({
        section: content.section,
        key: content.key,
        englishText: content.englishText,
        frenchText: content.frenchText,
        imageUrl: content.imageUrl || null
      });
    }
  };

  /**
   * Function to save edited content data
   * Updates database record and refreshes local state
   */
  const saveContentEdit = async () => {
    if (!contentEditingId) return;

    try {
      // Handle file upload if a file is selected
      let imageUrl = contentEditForm.imageUrl || null;
      if (selectedFile) {
        try {
          imageUrl = await uploadImage(selectedFile);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          alert('Failed to upload image. Please try again.');
          return;
        }
      }

      // Create version before updating
      const existingContent = contentItems.find(c => c.id === contentEditingId);
      if (existingContent) {
        await supabase.from('content_versions').insert([{
          contentItemId: contentEditingId,
          version: Date.now(),
          englishText: existingContent.englishText,
          frenchText: existingContent.frenchText,
          imageUrl: existingContent.imageUrl,
          createdBy: user?.id || 'unknown'
        }]);
      }

      // Update content
      const { error } = await supabase
        .from('content')
        .update({
          section: contentEditForm.section,
          key: contentEditForm.key,
          englishText: contentEditForm.englishText,
          frenchText: contentEditForm.frenchText,
          imageUrl: imageUrl
        })
        .eq('id', contentEditingId);

      if (error) throw error;

      setContentEditingId(null);
      setContentEditForm({ section: '', key: '', englishText: '', frenchText: '', imageUrl: null });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await fetchContentItems();
      await fetchContentVersions();
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  /**
   * Function to delete a content item
   * Removes record from database and updates local state
   */
  const deleteContentItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchContentItems();
    } catch (error) {
      console.error('Error deleting content item:', error);
    }
  };

  /**
   * Function to add new content item
   * Inserts new record into database and refreshes local state
   */
  const addContentItem = async () => {
    try {
      // Handle file upload if a file is selected
      let imageUrl = contentEditForm.imageUrl || null;
      if (selectedFile) {
        try {
          imageUrl = await uploadImage(selectedFile);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          alert('Failed to upload image. Please try again.');
          return;
        }
      }

      const { error } = await supabase
        .from('content')
        .insert([{
          section: contentEditForm.section,
          key: contentEditForm.key,
          englishText: contentEditForm.englishText,
          frenchText: contentEditForm.frenchText,
          imageUrl: imageUrl,
          createdBy: user?.id
        }]);

      if (error) throw error;

      setContentEditForm({ section: '', key: '', englishText: '', frenchText: '', imageUrl: null });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await fetchContentItems();
    } catch (error) {
      console.error('Error adding content item:', error);
    }
  };

  /**
   * Function to view versions of a content item
   * Sets the selected content item for version history display
   */
  const viewVersions = (contentItemId: string) => {
    setSelectedContentItemId(contentItemId);
    setActiveTab('content-versions');
  };

  /**
   * Function to restore a content version
   * Reverts content item to a previous version
   */
  const restoreVersion = async (version: ContentVersion) => {
    try {
      // Create new version before restoring
      const existingContent = contentItems.find(c => c.id === version.contentItemId);
      if (existingContent) {
        await supabase.from('content_versions').insert([{
          contentItemId: version.contentItemId,
          version: Date.now(),
          englishText: existingContent.englishText,
          frenchText: existingContent.frenchText,
          imageUrl: existingContent.imageUrl,
          createdBy: user?.id || 'unknown'
        }]);
      }

      // Restore the selected version
      const { error } = await supabase
        .from('content')
        .update({
          englishText: version.englishText,
          frenchText: version.frenchText,
          imageUrl: version.imageUrl || null
        })
        .eq('id', version.contentItemId);

      if (error) throw error;

      await fetchContentItems();
      await fetchContentVersions();
    } catch (error) {
      console.error('Error restoring version:', error);
    }
  };

  /**
   * Function to delete a user
   * Removes user record from database
   */
  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with logout button */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#0A3D91' }}>
                {translations.adminDashboard}
              </h1>
              <p className="text-sm text-gray-500">
                {user?.full_name} • {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-all duration-300"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {translations.logout}
          </button>
        </div>
      </header>

      {/* Main content area */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tab navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab('registrations')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === 'registrations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="h-4 w-4 inline mr-2" />
                {translations.adminRegistrations}
              </button>
            
            <button
              onClick={() => setActiveTab('messages')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Shield className="h-4 w-4 inline mr-2" />
              {translations.adminMessages}
            </button>
            
            <button
              onClick={() => setActiveTab('content')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Edit3 className="h-4 w-4 inline mr-2" />
              {translations.adminContentManagement}
            </button>
            
            <button
              onClick={() => setActiveTab('content-versions')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content-versions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <History className="h-4 w-4 inline mr-2" />
              {translations.adminContentVersions}
            </button>
            
            <button
              onClick={() => setActiveTab('users')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User className="h-4 w-4 inline mr-2" />
              {translations.adminUsers}
            </button>
            
            <button
              onClick={() => setActiveTab('immigration')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'immigration'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {translations.immigrationTitle}
            </button>
            
            <button
              onClick={() => setActiveTab('driving-school')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'driving-school'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {translations.drivingSchoolTitle}
            </button>
            
            <button
              onClick={() => setActiveTab('languages')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'languages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {translations.languagesTitle}
            </button>
            
            <button
              onClick={() => setActiveTab('innovation')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'innovation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {translations.innovationTitle}
            </button>
            
            <button
              onClick={() => setActiveTab('graphic-design')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'graphic-design'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {translations.graphicDesignTitle}
            </button>
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Registrations tab */}
        {activeTab === 'registrations' && (
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold" style={{ color: '#0A3D91' }}>
                {translations.adminRegistrations}
              </h2>
              <button
                onClick={exportToCSV}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white"
                style={{ backgroundColor: '#0A3D91' }}
              >
                <Download className="h-4 w-4 mr-2" />
                {translations.exportToCSV}
              </button>
            </div>
              
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminName}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminService}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminDate}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminActions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((registration) => (
                    <tr key={registration.id}>
                      {editingId === registration.id ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={editForm.full_name || ''}
                              onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                              className="w-full px-2 py-1 border rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={editForm.service || ''}
                              onChange={(e) => setEditForm({...editForm, service: e.target.value})}
                              className="w-full px-2 py-1 border rounded"
                            >
                              {availableServices.map(service => (
                                <option key={service} value={service}>{service}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(registration.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={saveEdit}
                              className="text-green-600 hover:text-green-900 mr-2"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{registration.full_name}</div>
                            <div className="text-sm text-gray-500">{registration.email}</div>
                            {expandedRows.has(registration.id) && (
                              <div className="mt-2 text-sm text-gray-500">
                                <p><strong>{language === 'en' ? 'Phone:' : 'Téléphone:'}</strong> {registration.phone}</p>
                                <p><strong>{language === 'en' ? 'Country:' : 'Pays:'}</strong> {registration.country}</p>
                                {registration.message && (
                                  <p><strong>{language === 'en' ? 'Message:' : 'Message:'}</strong> {registration.message}</p>
                                )}
                              </div>
                            )}
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
                              className="text-blue-600 hover:text-blue-900 mr-2"
                            >
                              {expandedRows.has(registration.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleEdit(registration.id)}
                              className="text-indigo-600 hover:text-indigo-900 mr-2"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteRegistration(registration.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Messages tab */}
        {activeTab === 'messages' && (
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold mb-6" style={{ color: '#0A3D91' }}>
              {translations.adminMessages}
            </h2>
              
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminFrom}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminSubject}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminDate}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminActions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {messages.map((message) => (
                    <tr key={message.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{message.name}</div>
                        <div className="text-sm text-gray-500">{message.email}</div>
                        {expandedRows.has(message.id) && (
                          <div className="mt-2 text-sm text-gray-500">
                            <p><strong>{language === 'en' ? 'Phone:' : 'Téléphone:'}</strong> {message.phone}</p>
                            <p><strong>{language === 'en' ? 'Message:' : 'Message:'}</strong> {message.message}</p>
                          </div>
                        )}
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
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          {expandedRows.has(message.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Content Management tab */}
        {activeTab === 'content' && (
          <div className="px-4 py-5 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#0A3D91' }}>
                  {translations.adminContentManagement}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {language === 'en' 
                    ? 'Manage website content in both English and French' 
                    : 'Gérer le contenu du site web en anglais et en français'}
                </p>
              </div>
              <button
                onClick={addContentItem}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: '#0A3D91' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {translations.adminAddContent}
              </button>
            </div>
              
            {/* Add/Edit form */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md border border-blue-100">
              <h3 className="text-xl font-semibold mb-6" style={{ color: '#0A3D91' }}>
                {contentEditingId ? translations.adminEditContent : translations.adminAddContent}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.adminSection}
                  </label>
                  <input
                    type="text"
                    value={contentEditForm.section}
                    onChange={(e) => setContentEditForm({...contentEditForm, section: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder={translations.adminSectionPlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.adminKey}
                  </label>
                  <input
                    type="text"
                    value={contentEditForm.key}
                    onChange={(e) => setContentEditForm({...contentEditForm, key: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder={translations.adminKeyPlaceholder}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.adminEnglishText}
                  </label>
                  <textarea
                    value={contentEditForm.englishText}
                    onChange={(e) => setContentEditForm({...contentEditForm, englishText: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder={translations.adminEnglishTextPlaceholder}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.adminFrenchText}
                  </label>
                  <textarea
                    value={contentEditForm.frenchText}
                    onChange={(e) => setContentEditForm({...contentEditForm, frenchText: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder={translations.adminFrenchTextPlaceholder}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.adminImageUrl} ({translations.adminOptional})
                  </label>
                  <input
                    type="text"
                    value={contentEditForm.imageUrl || ''}
                    onChange={(e) => setContentEditForm({...contentEditForm, imageUrl: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder={translations.adminImageUrlPlaceholder}
                  />
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminOrUploadImage} ({translations.adminOptional})
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      accept="image/*"
                    />
                    {uploading && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{uploadProgress}% {translations.adminUploading}</p>
                      </div>
                    )}
                    {selectedFile && (
                      <div className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded">
                        <span className="text-sm text-gray-700 truncate">{selectedFile.name}</span>
                        <button 
                          onClick={() => {
                            setSelectedFile(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={async () => {
                        if (selectedFile) {
                          try {
                            const url = await uploadImage(selectedFile);
                            setContentEditForm({...contentEditForm, imageUrl: url});
                            setSelectedFile(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          } catch (error) {
                            console.error('Upload failed:', error);
                          }
                        }
                      }}
                      disabled={!selectedFile || uploading}
                      className={`mt-2 px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-all duration-300 ${!selectedFile || uploading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'}`}
                    >
                      {uploading ? translations.adminUploading : translations.adminOrUploadImage}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                {contentEditingId && (
                  <button
                    onClick={() => {
                      setContentEditingId(null);
                      setContentEditForm({ section: '', key: '', englishText: '', frenchText: '', imageUrl: null });
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                  >
                    {translations.cancel}
                  </button>
                )}
                <button
                  onClick={contentEditingId ? saveContentEdit : addContentItem}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm transition-all duration-300 hover:shadow-lg"
                  style={{ backgroundColor: '#0A3D91' }}
                >
                  {contentEditingId ? translations.save : translations.add}
                </button>
              </div>
            </div>
              
            {/* Content items table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminSection}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminKey}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminEnglishText}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminFrenchText}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminActions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contentItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.section}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.key}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {item.englishText}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {item.frenchText}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => viewVersions(item.id)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          <History className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleContentEdit(item.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteContentItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Content Versions tab */}
        {activeTab === 'content-versions' && (
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold mb-6" style={{ color: '#0A3D91' }}>
              {translations.adminContentVersions}
            </h2>
              
            {selectedContentItemId ? (
              <>
                <div className="mb-4">
                  <button
                    onClick={() => setSelectedContentItemId(null)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ← {translations.back}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminVersion}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminEnglishText}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminFrenchText}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminDate}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminActions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contentVersions
                        .filter(version => version.contentItemId === selectedContentItemId)
                        .map((version) => (
                          <tr key={version.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {version.version}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              {version.englishText}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              {version.frenchText}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(version.createdAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => restoreVersion(version)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="text-gray-500">{translations.adminSelectContentItemToViewVersions}</p>
            )}
          </div>
        )}

        {/* Users tab */}
        {activeTab === 'users' && (
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold mb-6" style={{ color: '#0A3D91' }}>
              {translations.adminUsers}
            </h2>
              
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminName}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminEmail}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminRole}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {translations.adminActions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((usr) => (
                    <tr key={usr.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{usr.full_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {usr.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          usr.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : usr.role === 'editor'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteUser(usr.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={usr.role === 'viewer'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Immigration Service Specific Content Management */}
        {activeTab === 'immigration' && (
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold mb-6" style={{ color: '#0A3D91' }}>
              {translations.adminImmigration}
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{translations.adminContentManagement}</h3>
              <p className="text-sm text-gray-500 mb-6">
                {language === 'en' 
                  ? 'Manage content specific to the Immigration service.' 
                  : 'Gérer le contenu spécifique au service d\'Immigration.'}
              </p>
              
              {/* Filter content items for immigration service */}
              {contentItems.filter(item => 
                item.section.includes('immigration') || 
                item.section.includes('Immigration')
              ).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminSection}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminKey}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'en' ? 'English Text' : 'Texte Anglais'}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'en' ? 'French Text' : 'Texte Français'}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminActions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contentItems.filter(item => 
                        item.section.includes('immigration') || 
                        item.section.includes('Immigration')
                      ).map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.section}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.key}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {item.englishText}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {item.frenchText}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setContentEditingId(item.id);
                                setContentEditForm({
                                  section: item.section,
                                  key: item.key,
                                  englishText: item.englishText,
                                  frenchText: item.frenchText,
                                  imageUrl: item.imageUrl || ''
                                });
                              }}
                              className="text-indigo-600 hover:text-indigo-900 mr-2"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteContentItem(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {language === 'en' 
                      ? 'No content items found for Immigration service.' 
                      : 'Aucun élément de contenu trouvé pour le service d\'Immigration.'}
                  </p>
                  <button
                    onClick={() => {
                      setContentEditingId(null);
                      setContentEditForm({ 
                        section: 'immigration', 
                        key: '', 
                        englishText: '', 
                        frenchText: '',
                        imageUrl: '' 
                      });
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-all duration-300 hover:shadow-lg"
                    style={{ backgroundColor: '#0A3D91' }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {translations.adminAddContent}
                  </button>
                </div>
              )}
              
              {/* Add/Edit form for immigration content */}
              <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-blue-100">
                <h3 className="text-xl font-semibold mb-6" style={{ color: '#0A3D91' }}>
                  {contentEditingId ? translations.adminEditContent : translations.adminAddContent}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminSection}
                    </label>
                    <input
                      type="text"
                      value={contentEditForm.section}
                      onChange={(e) => setContentEditForm({...contentEditForm, section: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminSectionPlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminKey}
                    </label>
                    <input
                      type="text"
                      value={contentEditForm.key}
                      onChange={(e) => setContentEditForm({...contentEditForm, key: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminKeyPlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminEnglishText}
                    </label>
                    <textarea
                      value={contentEditForm.englishText}
                      onChange={(e) => setContentEditForm({...contentEditForm, englishText: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminEnglishTextPlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminFrenchText}
                    </label>
                    <textarea
                      value={contentEditForm.frenchText}
                      onChange={(e) => setContentEditForm({...contentEditForm, frenchText: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminFrenchTextPlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminImageUrl} ({translations.adminOptional})
                    </label>
                    <input
                      type="text"
                      value={contentEditForm.imageUrl || ''}
                      onChange={(e) => setContentEditForm({...contentEditForm, imageUrl: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminImageUrlPlaceholder}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  {contentEditingId && (
                    <button
                      onClick={() => {
                        setContentEditingId(null);
                        setContentEditForm({ section: 'immigration', key: '', englishText: '', frenchText: '', imageUrl: '' });
                      }}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                    >
                      {translations.cancel}
                    </button>
                  )}
                  <button
                    onClick={contentEditingId ? saveContentEdit : addContentItem}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm transition-all duration-300 hover:shadow-lg"
                    style={{ backgroundColor: '#0A3D91' }}
                  >
                    {contentEditingId ? translations.save : translations.add}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Driving School Service Specific Content Management */}
        {activeTab === 'driving-school' && (
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold mb-6" style={{ color: '#0A3D91' }}>
              {translations.adminDrivingSchool}
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{translations.adminContentManagement}</h3>
              <p className="text-sm text-gray-500 mb-6">
                {language === 'en' 
                  ? 'Manage content specific to the Driving School service.' 
                  : 'Gérer le contenu spécifique au service d\'Auto-École.'}
              </p>
              
              {/* Filter content items for driving school service */}
              {contentItems.filter(item => 
                item.section.includes('driving') || 
                item.section.includes('Driving') ||
                item.section.includes('school') ||
                item.section.includes('School')
              ).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminSection}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminKey}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'en' ? 'English Text' : 'Texte Anglais'}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'en' ? 'French Text' : 'Texte Français'}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminActions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contentItems.filter(item => 
                        item.section.includes('driving') || 
                        item.section.includes('Driving') ||
                        item.section.includes('school') ||
                        item.section.includes('School')
                      ).map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.section}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.key}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {item.englishText}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {item.frenchText}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setContentEditingId(item.id);
                                setContentEditForm({
                                  section: item.section,
                                  key: item.key,
                                  englishText: item.englishText,
                                  frenchText: item.frenchText,
                                  imageUrl: item.imageUrl || ''
                                });
                              }}
                              className="text-indigo-600 hover:text-indigo-900 mr-2"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteContentItem(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {language === 'en' 
                      ? 'No content items found for Driving School service.' 
                      : 'Aucun élément de contenu trouvé pour le service d\'Auto-École.'}
                  </p>
                  <button
                    onClick={() => {
                      setContentEditingId(null);
                      setContentEditForm({ 
                        section: 'driving-school', 
                        key: '', 
                        englishText: '', 
                        frenchText: '',
                        imageUrl: '' 
                      });
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-all duration-300 hover:shadow-lg"
                    style={{ backgroundColor: '#0A3D91' }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {translations.adminAddContent}
                  </button>
                </div>
              )}
              
              {/* Add/Edit form for driving school content */}
              <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-blue-100">
                <h3 className="text-xl font-semibold mb-6" style={{ color: '#0A3D91' }}>
                  {contentEditingId ? translations.adminEditContent : translations.adminAddContent}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminSection}
                    </label>
                    <input
                      type="text"
                      value={contentEditForm.section}
                      onChange={(e) => setContentEditForm({...contentEditForm, section: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminSectionPlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminKey}
                    </label>
                    <input
                      type="text"
                      value={contentEditForm.key}
                      onChange={(e) => setContentEditForm({...contentEditForm, key: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminKeyPlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminEnglishText}
                    </label>
                    <textarea
                      value={contentEditForm.englishText}
                      onChange={(e) => setContentEditForm({...contentEditForm, englishText: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminEnglishTextPlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminFrenchText}
                    </label>
                    <textarea
                      value={contentEditForm.frenchText}
                      onChange={(e) => setContentEditForm({...contentEditForm, frenchText: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminFrenchTextPlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminImageUrl} ({translations.adminOptional})
                    </label>
                    <input
                      type="text"
                      value={contentEditForm.imageUrl || ''}
                      onChange={(e) => setContentEditForm({...contentEditForm, imageUrl: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminImageUrlPlaceholder}
                    />
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.adminOrUploadImage} ({translations.adminOptional})
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        accept="image/*"
                      />
                      {uploading && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{uploadProgress}% {translations.adminUploading}</p>
                        </div>
                      )}
                      {selectedFile && (
                        <div className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded">
                          <span className="text-sm text-gray-700 truncate">{selectedFile.name}</span>
                          <button 
                            onClick={() => {
                              setSelectedFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <button
                        onClick={async () => {
                          if (selectedFile) {
                            try {
                              const url = await uploadImage(selectedFile);
                              setContentEditForm({...contentEditForm, imageUrl: url});
                              setSelectedFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            } catch (error) {
                              console.error('Upload failed:', error);
                            }
                          }
                        }}
                        disabled={!selectedFile || uploading}
                        className={`mt-2 px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-all duration-300 ${!selectedFile || uploading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'}`}
                      >
                        {uploading ? translations.adminUploading : translations.adminOrUploadImage}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  {contentEditingId && (
                    <button
                      onClick={() => {
                        setContentEditingId(null);
                        setContentEditForm({ section: 'driving-school', key: '', englishText: '', frenchText: '', imageUrl: '' });
                      }}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                    >
                      {translations.cancel}
                    </button>
                  )}
                  <button
                    onClick={contentEditingId ? saveContentEdit : addContentItem}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm transition-all duration-300 hover:shadow-lg"
                    style={{ backgroundColor: '#0A3D91' }}
                  >
                    {contentEditingId ? translations.save : translations.add}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Languages Service Specific Content Management */}
        {activeTab === 'languages' && (
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold mb-6" style={{ color: '#0A3D91' }}>
              {translations.adminLanguages}
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{translations.adminContentManagement}</h3>
              <p className="text-sm text-gray-500 mb-6">
                {language === 'en' 
                  ? 'Manage content specific to the Languages service.' 
                  : 'Gérer le contenu spécifique au service de Langues.'}
              </p>
              
              {/* Filter content items for languages service */}
              {contentItems.filter(item => 
                item.section.includes('language') || 
                item.section.includes('Language') ||
                item.section.includes('languages') ||
                item.section.includes('Languages')
              ).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminSection}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminKey}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'en' ? 'English Text' : 'Texte Anglais'}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'en' ? 'French Text' : 'Texte Français'}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminActions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contentItems.filter(item => 
                        item.section.includes('language') || 
                        item.section.includes('Language') ||
                        item.section.includes('languages') ||
                        item.section.includes('Languages')
                      ).map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.section}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.key}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {item.englishText}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {item.frenchText}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setContentEditingId(item.id);
                                setContentEditForm({
                                  section: item.section,
                                  key: item.key,
                                  englishText: item.englishText,
                                  frenchText: item.frenchText,
                                  imageUrl: item.imageUrl || ''
                                });
                              }}
                              className="text-indigo-600 hover:text-indigo-900 mr-2"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteContentItem(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {language === 'en' 
                      ? 'No content items found for Languages service.' 
                      : 'Aucun élément de contenu trouvé pour le service de Langues.'}
                  </p>
                  <button
                    onClick={() => {
                      setContentEditingId(null);
                      setContentEditForm({ 
                        section: 'languages', 
                        key: '', 
                        englishText: '', 
                        frenchText: '',
                        imageUrl: '' 
                      });
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-all duration-300 hover:shadow-lg"
                    style={{ backgroundColor: '#0A3D91' }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {translations.adminAddContent}
                  </button>
                </div>
              )}
              
              {/* Add/Edit form for languages content */}
              <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-blue-100">
                <h3 className="text-xl font-semibold mb-6" style={{ color: '#0A3D91' }}>
                  {contentEditingId ? translations.adminEditContent : translations.adminAddContent}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminSection}
                    </label>
                    <input
                      type="text"
                      value={contentEditForm.section}
                      onChange={(e) => setContentEditForm({...contentEditForm, section: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminSectionPlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminKey}
                    </label>
                    <input
                      type="text"
                      value={contentEditForm.key}
                      onChange={(e) => setContentEditForm({...contentEditForm, key: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminKeyPlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminEnglishText}
                    </label>
                    <textarea
                      value={contentEditForm.englishText}
                      onChange={(e) => setContentEditForm({...contentEditForm, englishText: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminEnglishTextPlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminFrenchText}
                    </label>
                    <textarea
                      value={contentEditForm.frenchText}
                      onChange={(e) => setContentEditForm({...contentEditForm, frenchText: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminFrenchTextPlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminImageUrl} ({translations.adminOptional})
                    </label>
                    <input
                      type="text"
                      value={contentEditForm.imageUrl || ''}
                      onChange={(e) => setContentEditForm({...contentEditForm, imageUrl: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminImageUrlPlaceholder}
                    />
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.adminOrUploadImage} ({translations.adminOptional})
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        accept="image/*"
                      />
                      {uploading && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{uploadProgress}% {translations.adminUploading}</p>
                        </div>
                      )}
                      {selectedFile && (
                        <div className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded">
                          <span className="text-sm text-gray-700 truncate">{selectedFile.name}</span>
                          <button 
                            onClick={() => {
                              setSelectedFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <button
                        onClick={async () => {
                          if (selectedFile) {
                            try {
                              const url = await uploadImage(selectedFile);
                              setContentEditForm({...contentEditForm, imageUrl: url});
                              setSelectedFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            } catch (error) {
                              console.error('Upload failed:', error);
                            }
                          }
                        }}
                        disabled={!selectedFile || uploading}
                        className={`mt-2 px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-all duration-300 ${!selectedFile || uploading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'}`}
                      >
                        {uploading ? translations.adminUploading : translations.adminOrUploadImage}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  {contentEditingId && (
                    <button
                      onClick={() => {
                        setContentEditingId(null);
                        setContentEditForm({ section: 'languages', key: '', englishText: '', frenchText: '', imageUrl: '' });
                      }}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                    >
                      {translations.cancel}
                    </button>
                  )}
                  <button
                    onClick={contentEditingId ? saveContentEdit : addContentItem}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm transition-all duration-300 hover:shadow-lg"
                    style={{ backgroundColor: '#0A3D91' }}
                  >
                    {contentEditingId ? translations.save : translations.add}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Innovation Service Specific Content Management */}
        {activeTab === 'innovation' && (
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold mb-6" style={{ color: '#0A3D91' }}>
              {translations.adminInnovation}
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{translations.adminContentManagement}</h3>
              <p className="text-sm text-gray-500 mb-6">
                {language === 'en' 
                  ? 'Manage content specific to the Innovation service.' 
                  : 'Gérer le contenu spécifique au service d\'Innovation.'}
              </p>
              
              {/* Filter content items for innovation service */}
              {contentItems.filter(item => 
                item.section.includes('innovation') || 
                item.section.includes('Innovation')
              ).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminSection}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminKey}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'en' ? 'English Text' : 'Texte Anglais'}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'en' ? 'French Text' : 'Texte Français'}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminActions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contentItems.filter(item => 
                        item.section.includes('innovation') || 
                        item.section.includes('Innovation')
                      ).map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.section}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.key}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {item.englishText}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {item.frenchText}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setContentEditingId(item.id);
                                setContentEditForm({
                                  section: item.section,
                                  key: item.key,
                                  englishText: item.englishText,
                                  frenchText: item.frenchText,
                                  imageUrl: item.imageUrl || ''
                                });
                              }}
                              className="text-indigo-600 hover:text-indigo-900 mr-2"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteContentItem(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {language === 'en' 
                      ? 'No content items found for Innovation service.' 
                      : 'Aucun élément de contenu trouvé pour le service d\'Innovation.'}
                  </p>
                  <button
                    onClick={() => {
                      setContentEditingId(null);
                      setContentEditForm({ 
                        section: 'innovation', 
                        key: '', 
                        englishText: '', 
                        frenchText: '',
                        imageUrl: '' 
                      });
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-all duration-300 hover:shadow-lg"
                    style={{ backgroundColor: '#0A3D91' }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {translations.adminAddContent}
                  </button>
                </div>
              )}
              
              {/* Add/Edit form for innovation content */}
              <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-blue-100">
                <h3 className="text-xl font-semibold mb-6" style={{ color: '#0A3D91' }}>
                  {contentEditingId ? translations.adminEditContent : translations.adminAddContent}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminSection}
                    </label>
                    <input
                      type="text"
                      value={contentEditForm.section}
                      onChange={(e) => setContentEditForm({...contentEditForm, section: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminSectionPlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminKey}
                    </label>
                    <input
                      type="text"
                      value={contentEditForm.key}
                      onChange={(e) => setContentEditForm({...contentEditForm, key: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminKeyPlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminEnglishText}
                    </label>
                    <textarea
                      value={contentEditForm.englishText}
                      onChange={(e) => setContentEditForm({...contentEditForm, englishText: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminEnglishTextPlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminFrenchText}
                    </label>
                    <textarea
                      value={contentEditForm.frenchText}
                      onChange={(e) => setContentEditForm({...contentEditForm, frenchText: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminFrenchTextPlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminImageUrl} ({translations.adminOptional})
                    </label>
                    <input
                      type="text"
                      value={contentEditForm.imageUrl || ''}
                      onChange={(e) => setContentEditForm({...contentEditForm, imageUrl: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminImageUrlPlaceholder}
                    />
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.adminOrUploadImage} ({translations.adminOptional})
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        accept="image/*"
                      />
                      {uploading && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{uploadProgress}% {translations.adminUploading}</p>
                        </div>
                      )}
                      {selectedFile && (
                        <div className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded">
                          <span className="text-sm text-gray-700 truncate">{selectedFile.name}</span>
                          <button 
                            onClick={() => {
                              setSelectedFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <button
                        onClick={async () => {
                          if (selectedFile) {
                            try {
                              const url = await uploadImage(selectedFile);
                              setContentEditForm({...contentEditForm, imageUrl: url});
                              setSelectedFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            } catch (error) {
                              console.error('Upload failed:', error);
                            }
                          }
                        }}
                        disabled={!selectedFile || uploading}
                        className={`mt-2 px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-all duration-300 ${!selectedFile || uploading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'}`}
                      >
                        {uploading ? translations.adminUploading : translations.adminOrUploadImage}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  {contentEditingId && (
                    <button
                      onClick={() => {
                        setContentEditingId(null);
                        setContentEditForm({ section: 'innovation', key: '', englishText: '', frenchText: '', imageUrl: '' });
                      }}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                    >
                      {translations.cancel}
                    </button>
                  )}
                  <button
                    onClick={contentEditingId ? saveContentEdit : addContentItem}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm transition-all duration-300 hover:shadow-lg"
                    style={{ backgroundColor: '#0A3D91' }}
                  >
                    {contentEditingId ? translations.save : translations.add}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Graphic Design Service Specific Content Management */}
        {activeTab === 'graphic-design' && (
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold mb-6" style={{ color: '#0A3D91' }}>
              {translations.adminGraphicDesign}
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{translations.adminContentManagement}</h3>
              <p className="text-sm text-gray-500 mb-6">
                {language === 'en' 
                  ? 'Manage content specific to the Graphic Design service.' 
                  : 'Gérer le contenu spécifique au service de Design Graphique.'}
              </p>
              
              {/* Filter content items for graphic design service */}
              {contentItems.filter(item => 
                item.section.includes('design') || 
                item.section.includes('Design') ||
                item.section.includes('graphic') ||
                item.section.includes('Graphic')
              ).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminSection}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminKey}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'en' ? 'English Text' : 'Texte Anglais'}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'en' ? 'French Text' : 'Texte Français'}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {translations.adminActions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contentItems.filter(item => 
                        item.section.includes('design') || 
                        item.section.includes('Design') ||
                        item.section.includes('graphic') ||
                        item.section.includes('Graphic')
                      ).map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.section}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.key}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {item.englishText}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {item.frenchText}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setContentEditingId(item.id);
                                setContentEditForm({
                                  section: item.section,
                                  key: item.key,
                                  englishText: item.englishText,
                                  frenchText: item.frenchText,
                                  imageUrl: item.imageUrl || ''
                                });
                              }}
                              className="text-indigo-600 hover:text-indigo-900 mr-2"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteContentItem(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {language === 'en' 
                      ? 'No content items found for Graphic Design service.' 
                      : 'Aucun élément de contenu trouvé pour le service de Design Graphique.'}
                  </p>
                  <button
                    onClick={() => {
                      setContentEditingId(null);
                      setContentEditForm({ 
                        section: 'graphic-design', 
                        key: '', 
                        englishText: '', 
                        frenchText: '',
                        imageUrl: '' 
                      });
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-all duration-300 hover:shadow-lg"
                    style={{ backgroundColor: '#0A3D91' }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {translations.adminAddContent}
                  </button>
                </div>
              )}
              
              {/* Add/Edit form for graphic design content */}
              <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-blue-100">
                <h3 className="text-xl font-semibold mb-6" style={{ color: '#0A3D91' }}>
                  {contentEditingId ? translations.adminEditContent : translations.adminAddContent}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminSection}
                    </label>
                    <input
                      type="text"
                      value={contentEditForm.section}
                      onChange={(e) => setContentEditForm({...contentEditForm, section: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminSectionPlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminKey}
                    </label>
                    <input
                      type="text"
                      value={contentEditForm.key}
                      onChange={(e) => setContentEditForm({...contentEditForm, key: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminKeyPlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminEnglishText}
                    </label>
                    <textarea
                      value={contentEditForm.englishText}
                      onChange={(e) => setContentEditForm({...contentEditForm, englishText: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminEnglishTextPlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminFrenchText}
                    </label>
                    <textarea
                      value={contentEditForm.frenchText}
                      onChange={(e) => setContentEditForm({...contentEditForm, frenchText: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminFrenchTextPlaceholder}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {translations.adminImageUrl} ({translations.adminOptional})
                    </label>
                    <input
                      type="text"
                      value={contentEditForm.imageUrl || ''}
                      onChange={(e) => setContentEditForm({...contentEditForm, imageUrl: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder={translations.adminImageUrlPlaceholder}
                    />
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.adminOrUploadImage} ({translations.adminOptional})
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        accept="image/*"
                      />
                      {uploading && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{uploadProgress}% {translations.adminUploading}</p>
                        </div>
                      )}
                      {selectedFile && (
                        <div className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded">
                          <span className="text-sm text-gray-700 truncate">{selectedFile.name}</span>
                          <button 
                            onClick={() => {
                              setSelectedFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <button
                        onClick={async () => {
                          if (selectedFile) {
                            try {
                              const url = await uploadImage(selectedFile);
                              setContentEditForm({...contentEditForm, imageUrl: url});
                              setSelectedFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            } catch (error) {
                              console.error('Upload failed:', error);
                            }
                          }
                        }}
                        disabled={!selectedFile || uploading}
                        className={`mt-2 px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-all duration-300 ${!selectedFile || uploading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'}`}
                      >
                        {uploading ? translations.adminUploading : translations.adminOrUploadImage}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  {contentEditingId && (
                    <button
                      onClick={() => {
                        setContentEditingId(null);
                        setContentEditForm({ section: 'graphic-design', key: '', englishText: '', frenchText: '', imageUrl: '' });
                        setSelectedFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                    >
                      {translations.cancel}
                    </button>
                  )}
                  <button
                    onClick={contentEditingId ? saveContentEdit : addContentItem}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white shadow-sm transition-all duration-300 hover:shadow-lg"
                    style={{ backgroundColor: '#0A3D91' }}
                  >
                    {contentEditingId ? translations.save : translations.add}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}      </div>
      </main>
    </div>
  );
}