const UserController = {};
const ENV = import.meta.env;

const API_URL = `${ENV.VITE_API_PROTOCOL}://${ENV.VITE_API_HOST}:${ENV.VITE_API_PORT}${ENV.VITE_API_BASE}`;

const USERS_ENDPOINT = `${API_URL}/usuarios`;

UserController.getAllUsers = async () => {
    try {
        const response = await fetch(`${USERS_ENDPOINT}`, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

UserController.getUserById = async (id) => {
    try {
        const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        throw error;
    }
}

UserController.createUser = async (userData) => {
    try {
        const response = await fetch(`${USERS_ENDPOINT}`, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

UserController.updateUser = async (id, userData) => {
    try {
        const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error updating user ${id}:`, error);
        throw error;
    }
}

UserController.deleteUser = async (id) => {
    try {
        const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
            method: 'DELETE',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        return { success: true, message: 'Usuario eliminado correctamente' };
    } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
        throw error;
    }
}

export default UserController;