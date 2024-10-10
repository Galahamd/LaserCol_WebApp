const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function getOrders(token, cartId, id) {
    try {
        const res = await fetch(`${API_URL}/${id}/orders`, {
            method: 'GET',
            cache: "no-cache",
            headers: {
                "Content-type": "application/json",
                Authorization: token
            },
            
        })
        const orders = await res.json();
        return orders
    } catch (error) {
        throw new Error(error)
    }
}

// services/orderService.js

export const getUserOrders = async (userId, token) => {
    try {
      const response = await fetch(`${API_URL}/orders/userorder/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary authentication headers here
          'Authorization': `Bearer ${token}`, // Example
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data; // Return the orders data
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error; // Re-throw the error for further handling
    }
  };
  