import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PaginationPage from "./Pagination";
import { client } from "../api-client";
import EditModal from "./EditModal";

function Shop() {
  const [product, setProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15;

  const navigate = useNavigate();

  const api = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      const response = await client.get(
        `/products?page=${page}&limit=${limit}`
      );
      setProduct(response.data.products);
      setTotalPages(response.data.totalPages);
    };

    fetchData();
  }, [page]);

  const handleClick = (id) => {
    navigate(`/allcarts/${id}`);
  };

  return (
    <div className="w-full px-4 py-10 justify-items-center  ">
      <h1 className="text-3xl font-bold text-center mb-8 text-pink-600 mt-10">
        Our Shop
        <div className="md:w-full w-full ">
          <p className="text-black md:py-2 py-5 md:w-full w-80">
            Click And Purchase The Receips
          </p>
        </div>
      </h1>

      <div className=" grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 ">
        {product && product.length > 0 ? (
          product?.map((item) => (
            <div className="w-full bg-white rounded-lg shadow  p-3 hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer ">
              <EditModal
                id={item._id}
                product={product}
                setProduct={setProduct}
              />
              <div
                key={item._id}
                onClick={() => handleClick(item._id)}
                className="bg-white rounded-lg mt-5 transition duration-300 overflow-hidden cursor-pointer"
              >
                <div className="w-full ">
                  {item.sale && (
                    <span className=" top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                      Sale!
                    </span>
                  )}
                  <img
                    src={`${api}${item.image}`}
                    alt={item.name}
                    className="w-full h-48 object-contain p-2"
                  />
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <h2 className="text-sm font-medium">
                    {new Date(item.updatedAt).toLocaleString()}
                  </h2>

                  <h3 className="text-sm font-medium">
                    {`P-Owner:${item.createdBy.fullname}`}
                  </h3>

                  <p className="text-xs text-gray-500">{`category-${item.category}`}</p>
                  <div className="flex items-center gap-2  py-2">
                    {item.oldPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        Rs.{item.oldPrice}
                      </span>
                    )}
                    <span className="text-pink-600 font-bold ">
                      Rs.{item.newPrice || item.price}
                    </span>
                  </div>
                  <div className="w-full overflow-hidden text-sm text-gray-600">
                    {item.description}
                  </div>
                  <div className="flex flex-row  text-yellow-400 mt-3 text-xs">
                    {[...Array(4)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full  text-center">
            <p className=" text-center text-3xl text-red-400">NO DATA FOUND</p>
          </div>
        )}
      </div>
      <div className="mt-10 ">
        <PaginationPage page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </div>
  );
}

export default Shop;
