import Swal from 'sweetalert2';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function CreateCart(userId) {
  
  try {
    console.log("Request body:", { userId }); // Debugging output
    const res = await fetch(`${API_URL}/cart/create`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({ userId })  // Wrap userId in an object
    });

    if (res.ok) {
      const cartData = await res.json();  // Parse the response as JSON
      return cartData;
    } else {
      throw new Error('Error creating the cart');
    }
  } catch (error) {
    throw new Error(`Failed to create cart: ${error.message}`);
  }
}

export async function GetCart(userId) {
  try {
    const res = await fetch(`${API_URL}/cart/${userId}`);
    const cart = res;
    return cart;
  } catch (error) {
    throw new Error(error)  
  }
}

export async function AddtoCart(cartId, productId, router, cantidad) {
  try {
    const res = await fetch(`${API_URL}/cart/${cartId}/${productId}`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body:JSON.stringify({
        quantity: Number(cantidad)
      })
    });

    if (res.ok) {
      router.push("/products"); // Usar el router pasado como argumento
    }
    
  } catch (error) {
    throw new Error(`Failed to add product to cart: ${error.message}`);
  }
}
export async function QuickAddtoCart(productId) {
  try {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Inicia sesion para poder añadir el producto'
      });
      return;
    }
    const res = await fetch(`${API_URL}/cart/${cartId}/${productId}`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json"
      },
      body:JSON.stringify({
        quantity: Number(cantidad)
      })
    });
    
    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Agregado',
        text: 'Producto agregado al carrito exitosamente.'
      });
    }
    
  } catch (error) {
    throw new Error(`Failed to add product to cart: ${error.message}`);
  }
}

export async function DeleteProductFromCart(cartId, productId, router) {
  // Prompt the user for confirmation
  const { isConfirmed } = await Swal.fire({
    title: '¿Estás seguro de que deseas eliminar este producto del carrito?',
    text: "¡No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!isConfirmed) {
    return; // Exit if the user does not confirm
  }

  try {
    const res = await fetch(`${API_URL}/cart/${cartId}/product/${productId}`, {
      method: 'DELETE',
      headers: {
        "Content-type": "application/json"
      }
    });

    if (res.ok) {
      router.push("/cart"); 
    } else {
      throw new Error("Failed to delete product from cart");
    }
  } catch (error) {
    throw new Error(`Failed to delete product from cart: ${error.message}`);
  }
}

