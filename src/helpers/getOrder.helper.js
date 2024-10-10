export async function getOrders(token, cartId, id) {
    try {
        const res = await fetch(`https://back-deploy-5y3a.onrender.com/${id}/orders`, {
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

export const getUserOrders = async (userId) => {
    try {
      const response = await fetch(`http://your-backend-url/api/userorder/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary authentication headers here
        //   'Authorization': `Bearer ${token}`, // Example
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
  