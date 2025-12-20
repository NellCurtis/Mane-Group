import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function DatabaseTest() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users from database...');
        const { data, error } = await supabase
          .from('users')
          .select('*');
        
        if (error) {
          console.error('Error fetching users:', error);
          setError(`Database error: ${error.message}`);
          return;
        }
        
        console.log('Users fetched:', data);
        setUsers(data || []);
      } catch (err) {
        console.error('Exception fetching users:', err);
        setError(`Exception: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Database Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-xl">Loading...</div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Users in Database</h2>
          <p className="mb-4">Total users: {users.length}</p>
          
          {users.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              No users found in the database. You need to create a user profile.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Full Name</th>
                    <th className="py-2 px-4 border-b">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="py-2 px-4 border-b text-sm">{user.id}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b">{user.full_name}</td>
                      <td className="py-2 px-4 border-b">
                        <span className={`px-2 py-1 rounded text-white ${
                          user.role === 'admin' ? 'bg-red-500' : 
                          user.role === 'editor' ? 'bg-blue-500' : 'bg-green-500'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="text-xl font-semibold mb-2">Instructions</h3>
            <p className="mb-2">
              If you don't see your user in the table above, you need to create a user profile in the database.
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to your Supabase dashboard</li>
              <li>Navigate to Table Editor &gt; users table</li>
              <li>Click "Insert row"</li>
              <li>Fill in your user details:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li><strong>id</strong>: Your user's UUID from the Authentication section</li>
                  <li><strong>email</strong>: Your email address</li>
                  <li><strong>full_name</strong>: Your name</li>
                  <li><strong>role</strong>: admin (for admin access)</li>
                </ul>
              </li>
              <li>Click "Save"</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}