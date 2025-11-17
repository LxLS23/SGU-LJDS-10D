import React, { useState, useEffect } from 'react';
import './App.css';
import UserController from './modules/user/user.controller';

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correoElectronico: '',
    numeroTelefono: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersData = await UserController.getAllUsers();
      setUsers(usersData);
    } catch (err) {
      setError(`Error al cargar usuarios: ${err.message}`);
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user = null) => {
    setFormErrors({});
    if (user) {
      setEditingUser(user);
      setFormData({
        nombreCompleto: user.nombreCompleto,
        correoElectronico: user.correoElectronico,
        numeroTelefono: user.numeroTelefono
      });
    } else {
      setEditingUser(null);
      setFormData({
        nombreCompleto: '',
        correoElectronico: '',
        numeroTelefono: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nombreCompleto.trim()) {
      errors.nombreCompleto = 'El nombre completo es obligatorio';
    }

    if (!formData.correoElectronico.trim()) {
      errors.correoElectronico = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.correoElectronico)) {
      errors.correoElectronico = 'El formato del correo no es válido';
    }

    if (!formData.numeroTelefono.trim()) {
      errors.numeroTelefono = 'El número de teléfono es obligatorio';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    setError(null);
    
    try {
      if (editingUser) {
        await UserController.updateUser(editingUser.id, formData);
      } else {
        await UserController.createUser(formData);
      }
      
      await loadUsers();
      closeModal();
      
    } catch (err) {
      const errorMessage = err.message.toLowerCase();
      if (errorMessage.includes('correo') && errorMessage.includes('uso')) {
        setFormErrors({ 
          correoElectronico: 'Este correo electrónico ya está en uso' 
        });
      } else {
        setError(`Error al ${editingUser ? 'actualizar' : 'crear'} usuario: ${err.message}`);
      }
      console.error('Error saving user:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await UserController.deleteUser(userId);
        await loadUsers();
      } catch (err) {
        setError(`Error al eliminar usuario: ${err.message}`);
        console.error('Error deleting user:', err);
      }
    }
  };

  return (
    <div className="user-crud-container">
      <div className="header">
        <h1>Gestión de Usuarios</h1>
        <button 
          className="btn btn-primary"
          onClick={() => openModal()}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Agregar Usuario'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button className="close-error" onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div className="loading">Cargando usuarios...</div>
        ) : users.length === 0 ? (
          <div className="no-users">
            No hay usuarios registrados. ¡Agrega el primero!
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Nombre Completo</th>
                <th>Correo Electrónico</th>
                <th>Número de Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.nombreCompleto}</td>
                  <td>{user.correoElectronico}</td>
                  <td>{user.numeroTelefono}</td>
                  <td className="actions">
                    <button 
                      className="btn btn-edit"
                      onClick={() => openModal(user)}
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-delete"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingUser ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSaveUser} className="user-form">
              <div className="form-group">
                <label htmlFor="nombreCompleto">Nombre Completo:</label>
                <input
                  type="text"
                  id="nombreCompleto"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleInputChange}
                  className={formErrors.nombreCompleto ? 'error' : ''}
                  required
                />
                {formErrors.nombreCompleto && (
                  <span className="field-error">{formErrors.nombreCompleto}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="correoElectronico">Correo Electrónico:</label>
                <input
                  type="email"
                  id="correoElectronico"
                  name="correoElectronico"
                  value={formData.correoElectronico}
                  onChange={handleInputChange}
                  className={formErrors.correoElectronico ? 'error' : ''}
                  required
                />
                {formErrors.correoElectronico && (
                  <span className="field-error">{formErrors.correoElectronico}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="numeroTelefono">Número de Teléfono:</label>
                <input
                  type="tel"
                  id="numeroTelefono"
                  name="numeroTelefono"
                  value={formData.numeroTelefono}
                  onChange={handleInputChange}
                  className={formErrors.numeroTelefono ? 'error' : ''}
                  required
                />
                {formErrors.numeroTelefono && (
                  <span className="field-error">{formErrors.numeroTelefono}</span>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-cancel" 
                  onClick={closeModal}
                  disabled={submitLoading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-save"
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Guardando...' : (editingUser ? 'Actualizar' : 'Guardar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;