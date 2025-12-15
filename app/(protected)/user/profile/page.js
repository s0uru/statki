// app/(protected)/user/profile/page.js
'use client';
import { useState, useEffect } from 'react';
import { updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from '@/app/lib/AuthContext';
import { auth, db } from '@/app/lib/firebase';

export default function ProfileForm() {
  const { user } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');

      const fetchAddress = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists() && docSnap.data().address) {
            const data = docSnap.data().address;
            setStreet(data.street || '');
            setCity(data.city || '');
            setZipCode(data.zipCode || '');
          }
        } catch (err) {
          console.error("Błąd pobierania adresu:", err);
        } finally {
          setLoadingData(false);
        }
      };
      fetchAddress();
    }
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) return;

    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });

      await setDoc(doc(db, "users", user.uid), {
        address: {
          street: street,
          city: city,
          zipCode: zipCode
        }
      }, { merge: true });

      setSuccess("Profil i adres zostały zaktualizowane.");
    } catch (err) {
      console.error(err);
      setError("Wystąpił błąd: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Twój Profil</h2>

      {/* Wyświetlanie zdjęcia */}
      <div className="mb-6 flex justify-center">
        {photoURL ? (
            <img 
                src={photoURL} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
                onError={(e) => { e.target.style.display = 'none'; }}
            />
        ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-2xl font-bold">
                {displayName ? displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
            </div>
        )}
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">{success}</div>}

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Email (Read only) - Zmieniono kolory na ciemniejsze */}
        <div>
          <label className="block text-sm font-bold text-gray-900">Email</label>
          <input 
            type="text" 
            value={user?.email || ''} 
            disabled 
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 text-gray-800 font-medium sm:text-sm border"
          />
        </div>

        {/* Auth Fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
            <label className="block text-sm font-bold text-gray-900">Nazwa użytkownika</label>
            <input 
                type="text" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                disabled={loadingData} 
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder-gray-400"
                placeholder="Np. JanKowalski"
            />
            </div>
            <div>
            <label className="block text-sm font-bold text-gray-900">URL Zdjęcia</label>
            <input 
                type="text" 
                value={photoURL} 
                onChange={(e) => setPhotoURL(e.target.value)} 
                disabled={loadingData} 
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder-gray-400"
            />
            </div>
        </div>

        <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center"><span className="bg-white px-2 text-sm font-medium text-gray-500">Dane Adresowe</span></div>
        </div>

        {/* Firestore Fields (Address) */}
        <div>
          <label className="block text-sm font-bold text-gray-900">Ulica</label>
          <input 
            type="text" 
            value={street} 
            onChange={(e) => setStreet(e.target.value)} 
            disabled={loadingData} 
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder-gray-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-bold text-gray-900">Miasto</label>
            <input 
                type="text" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                disabled={loadingData} 
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder-gray-400"
            />
            </div>
            <div>
            <label className="block text-sm font-bold text-gray-900">Kod pocztowy</label>
            <input 
                type="text" 
                value={zipCode} 
                onChange={(e) => setZipCode(e.target.value)} 
                disabled={loadingData} 
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder-gray-400"
            />
            </div>
        </div>

        <button 
          type="submit" 
          disabled={loadingData}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
        >
          {loadingData ? "Ładowanie..." : "Zapisz zmiany"}
        </button>
      </form>
    </div>
  );
}