import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CheckoutMercadoPago from '../mercadoPago/mercadoPago';
import { GetUserById } from '../path/to/auth.helper'; // Adjust the path accordingly

const CartSectionDetails = ({ products }) => {
  const APIURL = process.env.NEXT_PUBLIC_API_URL;
  const [id, setId] = useState("");
  const [userAddress, setUserAddress] = useState(""); // State to store user address
  const [loading, setLoading] = useState(true); // State for loading status

  // Function to calculate the total price of products
  const calculateTotalPrice = () => {
    if (!Array.isArray(products)) return 0; // Ensure products is an array
    let total = 0; 
    products.forEach(product => {
      if (product.valor) {
        total += Number(product.valor); // Add product.valor to total if it exists
      }
    });
    return total; // Return the total price
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userSession = JSON.parse(localStorage.getItem("userSession"));
        const userId = userSession.id; // Get user ID from session
        const token = localStorage.getItem('token'); // Assuming the token is stored in local storage

        // Fetch user data
        const user = await GetUserById(userId, token);
        setUserAddress(user.address); // Assuming the address is a field in the user object
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUserData(); // Call the fetch function
  }, []);

  useEffect(() => {
    if (products) {
      fetch(`${APIURL}/mercado-pago/crear-preferencia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: products.map(product => {
            return (
              {
                "titulo": product.nombre,
                "cantidad": 1,
                "precio": product.valor,
                "image": product.imgUrl
              }
            );
          }),
          email: JSON.parse(localStorage.getItem("userSession")).email,
          cartId: localStorage.getItem("cartId"),
          userId: JSON.parse(localStorage.getItem("userSession")).id
        })
      })
        .then(res => res.json())
        .then(res => {
          setId(res.id);
        });
    }
  }, [products]);

  const totalPrice = calculateTotalPrice(); // Calculate total price
  const descuento = totalPrice * 0.15; // 15% of the total price
  const precioTotal = totalPrice - descuento; // Total price after discount

  return (
    <>
      {id && products && products.length > 0 && (
        <>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg lg:mt-auto mb-6 w-full sm:w-[100%] mx-auto">
            <h2 className="text-lg font-bold mb-4 h-[30px] text-center sm:text-left">ENTREGA</h2>
            {loading ? ( // Display loading state
              <p className="mb-3 text-sm text-center md:text-base sm:text-left">Cargando dirección...</p>
            ) : (
              <p className="mb-3 text-sm text-center md:text-base sm:text-left">
                Entregar a mi domicilio <a href="#" className="text-pink-500 underline">{userAddress || "No disponible"}</a>
              </p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm">⚠️IMPORTANTE: Tiempo de preparación y envío entre 7 a 10 días hábiles</span>
              </div>
              <span className="text-xs font-bold text-gray-800 sm:text-sm">Gratis</span>
            </div>
          </div>

          <div className="bg-pink-200 p-4 md:p-6 rounded-lg shadow-lg lg:h-[270px] mb-10 w-full sm:w-[100%] mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-md ">Subtotal</h2>
              <span className="text-lg font-semibold text-md">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-md ">Descuento</h2>
              <span className="text-lg font-semibold text-md">${descuento.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-4 text-lg">
              <h2>Total</h2>
              <span className='font-semibold'>${precioTotal.toFixed(2)}</span>
            </div>

            <Link href={'/products'} className="items-center text-center lg:ml-72 mt-10 space-x-2 text-pink-700 mb-10 text-[13px] sm:text-lg font-bold">
              Psst psst, no te olvidas nada? Agrega más productos haciendo click <b>aca</b>😉
            </Link>

            <CheckoutMercadoPago pagoId={id} />
          </div>
        </>
      )}
    </>
  );
}

export default CartSectionDetails;
