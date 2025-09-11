import { Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";

function AddCart() {
  const { id } = useParams();
  const [carts, setCarts] = useState(null);
  const [ispending, setispending] = useState(null);
  const api = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const addCartsProduct = async () => {
      const response = await axios.get(`${api}/products/${id}`);
      setCarts(response.data.product);
    };

    addCartsProduct();
  }, [api, id]);

  const selectProductId = carts;

  const handleClick = async (selectProductId) => {
    setispending(true);
    try {
      const response = await axios.post(`${api}/products/payment`, {
        name: selectProductId.name,
        email: selectProductId.email,
        newPrice: selectProductId.newPrice,
        category: selectProductId.category,
        image: selectProductId.image,
      });
      window.location.href = response.data.url;
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setispending(false);
    }
  };

  return (
    <div className="w-full flex md:flex-row flex-col md:gap-20 gap-5 md:p-8 p-4 bg-slate-50 ">
      <div className="md:w-1/2 w-full h-full py-20 text-center ">
        <div className="w-full h-full">
          {selectProductId ? (
            <div
              key={selectProductId._id}
              className="bg-gray-50 w-full h-full rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer"
            >
              <h2 className="text-2xl py-5 text-orange-700 font-bold">
                PRODUCT ITEM
              </h2>
              <div className="w-full h-full ">
                {selectProductId.sale && (
                  <span className=" top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                    Sale!
                  </span>
                )}
                <img
                  src={`${api}${selectProductId.image}`}
                  alt={selectProductId.name}
                  className="w-full h-full object-contain p-2 mt-10"
                />

                <div className="w-full h-full p-3">
                  <h3 className="text-sm font-medium">
                    {selectProductId.name}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {selectProductId.category}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {selectProductId.oldPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        Rs.{selectProductId.oldPrice}
                      </span>
                    )}
                    <span className="text-pink-600 font-bold">
                      Rs.{selectProductId.newPrice || selectProductId.price}
                    </span>
                  </div>

                  <div className=" w-full ">
                    <h2 className="font-bold text-3xl">Description</h2>
                    <p className="text-black  text-2xl">
                      {selectProductId.description}
                    </p>
                  </div>

                  <div className="w-full">
                    <p className="text-3xl font-bold text-black">Ingredients</p>
                    <p className="text-black text-2xl">
                      {" "}
                      {selectProductId.ingredients}
                    </p>
                  </div>

                  <div className="flex text-yellow-400 mt-3 text-xs">
                    {[...Array(4)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p>SomeThing Went Wrong</p>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3 w-full  h-full md:py-20 py-5 text-center ">
        <div className="w-full rounded-2xl md:p-6  p-0 text-center">
          {selectProductId ? (
            <div
              key={selectProductId._id}
              className="w-full h-full p-10 rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer"
            >
              <h2 className="text-2xl text-orange-700 font-bold">
                BUY THE PRODUCT
              </h2>
              <div className="w-full h-full p-5 ">
                <div className="w-full h-full p-3 justify-items-center gap-4 ">
                  <h3 className="text-3xl font-bold ">
                    {selectProductId.name}
                  </h3>
                  <p className="md:w-2/3 w-full text-center text-gray-400 py-6">
                    {selectProductId.description}
                  </p>
                  <p className="text-2xl text-gray-500 py-6">
                    {selectProductId.category}
                  </p>

                  <div className=" w-full gap-2 mt-2 py-3 ">
                    <span className="text-pink-600  font-bold text-4xl">
                      Rs.{selectProductId.newPrice || selectProductId.price}
                    </span>
                  </div>

                  {selectProductId?.colors?.length > 0 ? (
                    <div className="flex gap-2 mt-3 py-5">
                      {selectProductId.colors.map((color, index) => (
                        <span
                          key={index}
                          className="w-5 h-5 rounded-full border"
                          style={{ backgroundColor: color }}
                        ></span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 mt-2">No color</p>
                  )}

                  <div className="flex text-yellow-400 mt-3 text-2xl">
                    {[...Array(4)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>

                  <div className="w-full py-10">
                    <button
                      className="w-full hover:bg-red-400 rounded-md text-white font-bold h-10 bg-red-500"
                      onClick={() => handleClick(selectProductId)}
                    >
                      {ispending ? (
                        <Spin />
                      ) : (
                        <h2 className="font-bold py-2"> BUY NOW</h2>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p>SomeThing Went Wrong</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddCart;
