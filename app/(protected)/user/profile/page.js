'use client';
import { useState, useEffect } from 'react';
import { updateProfile } from "firebase/auth";
import { useAuth } from '@/app/lib/AuthContext';
import { auth } from '@/app/lib/firebase';

export default function ProfileForm() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Wypełnij formularz aktualnymi danymi po załadowaniu usera
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) return;

    updateProfile(user, {
      displayName: displayName,
      photoURL: photoURL,
    })
      .then(() => {
        console.log("Profile updated");
        setSuccess("Profil został zaktualizowany pomyślnie.");
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Edytuj Profil</h2>

      {/* Zadanie 5: Warunkowe renderowanie zdjęcia */}
      <div className="mb-6 flex justify-center">
        {photoURL ? (
            <img 
                src={photoURL} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
                onError={(e) => { e.target.style.display = 'none'; }} // Ukryj jeśli link uszkodzony
            />
        ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-2xl font-bold">
                {displayName ? displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
            </div>
        )}
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">{success}</div>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email (tylko do odczytu)</label>
          <input 
            type="text" 
            value={user?.email || ''} 
            disabled 
            className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nazwa wyświetlana</label>
          <input 
            type="text" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">URL Zdjęcia profilowego</label>
          <input 
            type="text" 
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border px-3 py-2"
          />
        </div>

        <button 
          type="submit" 
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Zapisz zmiany
        </button>
      </form>
    </div>
  );
}