import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CheckoutMercadoPago from '../mercadoPago/mercadoPago';
import { GetUserById } from '../../helpers/auth.helper'; // Adjust the path accordingly
import { createOrder } from '../../helpers/getOrder.helper'; // Import the createOrder function
import Swal from 'sweetalert2';

const CartSectionDetails = ({ products }) => {
  const APIURL = process.env.NEXT_PUBLIC_API_URL;
  const [id, setId] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const calculateTotalPrice = () => {
    if (!Array.isArray(products)) return 0;
    let total = 0;
    products.forEach(product => {
      if (product.valor) {
        total += Number(product.valor);
      }
    });
    return total;
  };

  const totalPrice = calculateTotalPrice();
  const descuento = isCouponApplied ? totalPrice * 0.15 : 0; // Solo aplica el descuento si el cupón es válido
  const precioTotal = totalPrice - descuento;

  useEffect(() => {
    if (products) {
      fetch(`${APIURL}/mercado-pago/crear-preferencia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: products.map(product => {
            return {
              "titulo": product.nombre,
              "cantidad": 1,
              "precio": product.valor,
              "image": product.imgUrl
            };
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

  // Check if the input matches the correct discount code
  const handleInputChange = (e) => {
    setDiscountCode(e.target.value);
    setIsButtonDisabled(e.target.value !== "BIENVENIDO15%OFF");
  };

  const applyDiscount = () => {
    if (discountCode === "BIENVENIDO15%OFF") {
      setIsCouponApplied(true);
    }
  };

  // Function to handle order creation
  const handleCreateOrder = async () => {
    try {
        const userSession = JSON.parse(localStorage.getItem("userSession"));
        const token = userSession.token; // Adjust this based on where you store the token
        const userId = userSession.id;

        // Call the createOrder function
        const createdOrder = await createOrder(userId, token);
        console.log('Order created successfully:', createdOrder);

        // Show a Swal alert after the order is created
        Swal.fire({
            title: 'Orden creada',
            text: 'Tu orden ha sido creada exitosamente.',
            icon: 'success',
            confirmButtonText: 'Ok'
        });

        // Additional actions after order creation (e.g., redirect or show confirmation)
    } catch (error) {
        console.error('Error creating order:', error);
        // Handle error (e.g., show a message to the user)
    }
};

  return (
    <>
      {id && products && products.length > 0 && (
        <>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg lg:mt-auto mb-6 w-full sm:w-[100%] mx-auto">
            <h2 className="text-lg font-bold mb-4 h-[30px] text-center sm:text-left">ENTREGA</h2>
            <p className="mb-3 text-sm text-center md:text-base sm:text-left">
              Una vez confirmada la compra, nos pondremos en contacto a través de correo electrónico para ultimar los detalles del diseño y de la entrega.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm">⚠️IMPORTANTE: Tiempo de preparación y envío entre 10 a 15 días hábiles</span>
              </div>
            </div>
          </div>

          <div className="bg-pink-200 p-4 md:p-6 rounded-lg shadow-lg lg:h-[270px] mb-10 w-full sm:w-[100%] mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-md">Subtotal</h2>
              <span className="text-lg font-semibold text-md">${totalPrice.toFixed(2)}</span>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md w-full"
                  placeholder="BIENVENIDO15%OFF"
                />
                <button
                  className={`ml-2 p-2 rounded-md bg-pink-500 text-white ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={applyDiscount}
                  disabled={isButtonDisabled}
                >
                  Canjear
                </button>
              </div>
              <p className="text-sm text-gray-800">
                Descuento de bienvenida😎 Ingresa acá el cupón <b>BIENVENIDO15%OFF</b> para canjearlo.
              </p>
            </div>

            {isCouponApplied && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg text-md">Descuento</h2>
                <span className="text-lg font-semibold text-md">${descuento.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4 text-lg">
              <h2>Total</h2>
              <span className='font-semibold'>${precioTotal.toFixed(2)}</span>
            </div>

            <Link href={'/products'} className="items-center text-center lg:ml-72 mt-10 space-x-2 text-pink-700 mb-10 text-[13px] sm:text-lg font-bold">
              Psst psst, no te olvidas nada? Agrega más productos haciendo click <b>aca</b>😉
            </Link>

            {/* Button to create the order */}
            <button
              className="p-2 bg-blue-500 text-white rounded-md mt-4"
              onClick={handleCreateOrder}
            >
              Crear Orden
            </button>
            
            <CheckoutMercadoPago pagoId={id} />
          </div>
        </>
      )}
    </>
  );
};

export default CartSectionDetails;
