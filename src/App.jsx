import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./firebase";
import { getItems, createItem, updateItem, deleteItem } from "./api";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemValue, setNewItemValue] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // Load items when user is authenticated
        loadItems();
      }
    });
    return () => unsubscribe();
  }, []);

  const loadItems = async () => {
    try {
      const response = await getItems();
      setItems(response.data);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim() || !newItemValue.trim()) return;
    
    try {
      await createItem({ 
        name: newItemName, 
        value: parseFloat(newItemValue) || 0 
      });
      setNewItemName("");
      setNewItemValue("");
      loadItems(); // Reload items after adding
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteItem(id);
      loadItems(); // Reload items after deleting
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (user) {
    return (
      <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '600px', padding: 32, background: 'rgba(0,0,0,0.5)', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2>Welcome, {user.displayName || user.email}!</h2>
          <button onClick={handleSignOut} style={{ marginBottom: '20px', padding: '8px 16px' }}>Sign Out</button>
          
          <h3>Items Management</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', width: '100%' }}>
            <input
              type="text"
              placeholder="Item name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              style={{ flex: 1, padding: 8 }}
            />
            <input
              type="number"
              placeholder="Item value"
              value={newItemValue}
              onChange={(e) => setNewItemValue(e.target.value)}
              style={{ flex: 1, padding: 8 }}
            />
            <button onClick={handleAddItem} style={{ padding: '8px 16px' }}>
              Add Item
            </button>
          </div>
          
          <div style={{ width: '100%' }}>
            <h4>Items List:</h4>
            {items.length === 0 ? (
              <p style={{ color: '#ccc' }}>No items found</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
                {items.map(item => (
                  <li key={item.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '10px', 
                    margin: '5px 0', 
                    background: 'rgba(255,255,255,0.1)', 
                    borderRadius: '6px' 
                  }}>
                    <span>{item.name}: {item.value}</span>
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      style={{ 
                        background: 'red', 
                        color: 'white', 
                        border: 'none', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: 320, padding: 32, background: 'rgba(0,0,0,0.5)', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: '100%' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
            style={{ marginBottom: 10, padding: 8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
            style={{ marginBottom: 10, padding: 8 }}
          />
          <button type="submit" style={{ marginBottom: 10 }}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
          <button type="button" onClick={handleGoogleSignIn} style={{ marginBottom: 10 }}>
            Sign In with Google
          </button>
          <span style={{ color: "red", minHeight: 24 }}>{error}</span>
        </form>
        <button onClick={() => setIsSignUp((prev) => !prev)} style={{ marginTop: 10 }}>
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default App;
