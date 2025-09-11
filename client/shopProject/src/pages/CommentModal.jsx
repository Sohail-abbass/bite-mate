import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Flex, Modal } from "antd";
import { MessageCircle } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ProfilePic from "../assets/Images/profile.png";

const CommentModal = ({ currentId, onCommentAdded }) => {
  const [openResponsive, setOpenResponsive] = useState(false);
  const [productData, setProductData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const api = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const { id: routeId } = useParams();

  const normId = useCallback((id) => {
    if (!id) return "";
    if (typeof id === "string") return id;
    if (typeof id === "object" && id.$oid) return id.$oid;
    return String(id);
  }, []);

  const openForCurrentPost = () => {
    const raw = currentId ?? routeId;
    const id = normId(raw);
    if (!id) return;
    setSelectedId(id);
    setOpenResponsive(true);
    navigate(`/home/${id}`);
  };

  const fetchProductData = async () => {
    try {
      const response = await axios.get(`${api}/products`);
      setProductData(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [api]);

  const selectedProduct = useMemo(() => {
    const id = selectedId || normId(currentId) || normId(routeId);
    return productData?.products?.find((p) => normId(p._id) === id);
  }, [productData, selectedId, currentId, routeId, normId]);

  const handlePostComment = async (id) => {
    if (!comment.trim()) return;

    try {
      const response = await axios.post(`${api}/products/${id}/comment`, {
        comment,
      });

      const updatedComments = response.data.commentBy || [];
      setComments(updatedComments);
      setComment(" ");

      if (onCommentAdded) {
        onCommentAdded(id, updatedComments);
      }
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleCloseModal = () => {
    setOpenResponsive(false);

    if (onCommentAdded && selectedProduct) {
      onCommentAdded(selectedProduct._id, comments);
    }
  };
  console.log("comment is ", comments);
  return (
    <Flex vertical gap="middle" align="flex-start">
      <MessageCircle onClick={openForCurrentPost} className="cursor-pointer" />

      <Modal
        className="ant-modal-content rounded-lg cursor-pointer"
        open={openResponsive}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        width={800}
      >
        <div className="w-full flex flex-row overflow-hidden">
          <div className="w-1/2 flex items-center justify-center p-6">
            {selectedProduct ? (
              <img
                src={`${api}${selectedProduct.image}`}
                className="w-full h-full object-cover"
                alt="product"
              />
            ) : (
              <div className="text-sm text-gray-500">No product found.</div>
            )}
          </div>

          <div className="w-1/2 flex flex-col overflow-hidden items-center justify-center p-6">
            <h2 className="font-bold mt-5">COMMENTS</h2>

            <div className="no-scrollbar w-full h-96 overflow-y-auto">
              {comments.length > 0 ? (
                comments.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 border-b border-gray-200 p-3"
                  >
                    <img
                      src={ProfilePic}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm">{item}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 mt-4">
                  No comments yet.
                </div>
              )}
            </div>

            <div className="w-full mt-10">
              <div className="w-full flex items-center border-t border-gray-300 px-3 py-2">
                <div className="mr-2">
                  <span className="text-2xl">😊</span>
                </div>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 outline-none text-sm placeholder-gray-400 p-4"
                />
                <button
                  className="ml-2 text-blue-500 text-sm font-semibold hover:opacity-70"
                  onClick={() => handlePostComment(selectedProduct?._id)}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Flex>
  );
};

export default CommentModal;
