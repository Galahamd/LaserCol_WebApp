import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CheckoutMercadoPago from '../mercadoPago/mercadoPago';

const CartSectionDetails = ({ products }) => {
  const APIURL = process.env.NEXT_PUBLIC_API_URL;
  const [id, setId] = useState("");
  const [showInput, setShowInput] = useState(true); // Estado para controlar si se muestra el input
  const [discountValue, setDiscountValue] = useState(0); // Estado para el valor del descuento

  // Función para calcular el precio total de los productos
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

  
  const handleCouponClaim = () => {
    setDiscountValue(calculateTotalPrice() * 0.15); 
    setShowInput(false); 
  };

 
  const handleRemoveCoupon = () => {
    setDiscountValue(0); 
    setShowInput(true); 
  };

  useEffect(() => {
    if (products) {
      fetch(`${APIURL}/mercado-pago/crear-preferencia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: products.map(product => ({
            titulo: product.nombre,
            cantidad: 1,
            precio: product.valor,
            image: product.imgUrl,
          })),
          email: JSON.parse(localStorage.getItem('userSession')).email,
          cartId: localStorage.getItem('cartId'),
          userId: JSON.parse(localStorage.getItem('userSession')).id,
        }),
      })
        .then(res => res.json())
        .then(res => {
          setId(res.id);
        });
    }
  }, [products]);

  const totalPrice = calculateTotalPrice();
  const precioTotal = totalPrice - discountValue; // Precio total después del descuento

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
              <span className="text-xs font-bold text-gray-800 sm:text-sm">Gratis</span>
            </div>
          </div>

          <div className="bg-pink-200 p-4 md:p-6 rounded-lg shadow-lg lg:h-[270px] mb-10 w-full sm:w-[100%] mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-md">Subtotal</h2>
              <span className="text-lg font-semibold text-md">${totalPrice.toFixed(2)}</span>
            </div>

            {showInput ? (
              <div className="flex items-center justify-between mb-4">
                <input 
                  type="text" 
                  placeholder="Código de descuento" 
                  className="p-2 border border-pink-700 rounded"
                />
                <button 
                  onClick={handleCouponClaim}
                  className="bg-pink-600 text-white px-4 py-2 rounded ml-2"
                >
                  Reclamar cupón
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg text-md">Descuento</h2>
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-md">${discountValue.toFixed(2)}</span>
                  <button 
                    onClick={handleRemoveCoupon}
                    className="ml-2 text-pink-600 font-bold"
                  >
                    X
                  </button>
                </div>
              </div>
            )}

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
};

export default CartSectionDetails;
