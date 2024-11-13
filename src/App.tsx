import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [productId, setProductId] = useState('');
  const [userId, setUserId] = useState('');
  const [newstock, setNewStock] = useState('');
  const [nbIteration , setnbIteration] = useState('');
  const [productData, setProductData] = useState(null);
  const [modificationHistory, setModificationHistory] = useState([]); 

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get('http://192.168.1.13:3000/api/auth/get-product-value');
        console.log('response', response)
        setProductData(response.data);
        setProductId(response.data.id);
        setNewStock(response.data.stock);
      } catch (error) {
        console.error('Erreur de chargement des données du produit:', error);
      }
    };

    fetchProductData();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('data', `${contact} - ${password}`)
    try {
      const response = await axios.post('http://192.168.1.13:3000/api/auth/login-user-test', {
        contact,
        password,
      });
      console.log('id', response.data.id)
      if (response) {
        setIsLoggedIn(true);
        setUserId(response.data.id)
        fetchModificationHistory(response.data.id);
      } else {
        alert('Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      alert('Erreur de connexion');
    }
  };

  const fetchModificationHistory = async (id) => {
    console.log('data', id)
    try {
      const response = await axios.get(`http://192.168.1.13:3000/api/auth/get-user-histories/${id}`);
      console.log(' 1', response.data.history)
      setModificationHistory(Array.isArray(response.data.history) ? response.data.history : []); // Ensure history is an array
    } catch (error) {
      console.error('Erreur de chargement de l\'historique des modifications:', error);
    }
  };


  const handleModification = async (e) => {
    e.preventDefault();
    const stock = parseInt(newstock);
    //const iterations = parseInt(nbIteration);
  
    try {
      console.log('nbIteration', nbIteration)
      const response = await axios.post(`http://192.168.1.13:3000/api/auth/create-modification`, {
        stock,
        userTestId: userId,
        productId: productId,
        nbIteration: nbIteration
      });
      
      alert('Modification réussie');
      fetchModificationHistory(userId);
    } catch (error) {
      console.error('Erreur de modification:', error);
      alert('Erreur de modification');
    }
  };
  
  return (
    <div className="container">
      {isLoggedIn ? (
        <div>
          <div className="box box-two">
            <h5 className="form-title">Bienvenue, vous pouvez maintenant effectuer les tests de modifications </h5>
            {productData ? (
              <form onSubmit={handleModification}>
                <div className="form-group">
                  <label htmlFor="productId" className="form-label">ID du produit</label>
                  <input
                    type="text"
                    id="productId"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="stock" className="form-label">Stock</label>
                  <input
                    type="text"
                    id="stock"
                    value={newstock}
                    onChange={(e) => setNewStock(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nbIteration" className="form-label">  Nombre d'Iterations</label>
                  <input
                    type="number"
                    id="nbIteration"
                    value={nbIteration}
                    onChange={(e) => setnbIteration(e.target.value)}
                  />
                </div>

                <button type="submit">Modifier</button>
              </form>
            ) : (
              <p>Chargement des données du produit...</p>
            )}
          </div>
          <div>
            <h3>Historique des modifications</h3>
              <table className="modification-table">
                <thead>
                  <tr>
                    <th>UserId</th>
                    <th>Value</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {modificationHistory && modificationHistory.map((record, index) => (
                  <tr key={index}>
                      <td>{userId}</td>
                      <td>{record.value}</td>
                      <td>{new Date(record.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </div>
      ) : (
        <div className="box box-two">
          <h2 className="form-title">Connectez-vous</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="contact" className="form-label">COntact</label>
              <input
                type="text"
                id="contact"
                placeholder="contact..."
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <input
                type="password"
                id="password"
                placeholder="mot de passe..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Se connecter</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
