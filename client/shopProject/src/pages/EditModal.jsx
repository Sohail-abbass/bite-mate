import React, { memo, useState } from "react";
import { Flex, Modal } from "antd";
import { Ellipsis } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditModal = memo(({ id, product, setProduct }) => {
  const [openResponsive, setOpenResponsive] = useState(false);
  const navigate = useNavigate();
  const api = import.meta.env.VITE_BASE_URL;

  const openForCurrentPost = () => {
    setOpenResponsive(true);
  };

  const handleEdit = async (id) => {
    const response = await axios.get(`${api}/products/${id}`);

    console.log(response.data);
    navigate(`/product/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${api}/products/delete/${id}`);

      const updatedProducts = product.filter(
        (item) => item._id !== response.data.deletePost._id
      );
      setProduct(updatedProducts);
      setOpenResponsive(false);
    } catch (error) {
      console.error("There was an error deleting the product!", error);
    }
  };

  return (
    <Flex vertical gap="middle" align="flex-start">
      <Ellipsis onClick={openForCurrentPost} className="cursor-pointer" />

      <Modal
        className="ant-modal-content-edit rounded-lg"
        open={openResponsive}
        footer={null}
        onCancel={() => setOpenResponsive(false)}
        width={400}
        centered
      >
        <div className="flex flex-col divide-y cursor-pointer text-center py-3 font-bold">
          <h2
            onClick={() => handleEdit(id)}
            className="hover:bg-slate-100 font-bold "
          >
            Edit
          </h2>
          <h2 className="hover:bg-slate-200">Contact Info</h2>
          <h2 className="hover:bg-slate-200">Profile</h2>
          <h2 className="hover:bg-slate-200">More Info</h2>
          <h2 className="hover:bg-slate-200">Dashboard</h2>
          <h2 className="hover:bg-slate-200">Help Line</h2>
          <h2 className="hover:bg-slate-200">Team Us</h2>
          <h2 className="hover:bg-slate-200">Visit</h2>
          <h2
            className="hover:bg-slate-200 text-red-600 font-bold"
            onClick={() => handleDelete(id)}
          >
            Delete
          </h2>
          <h2 className="hover:bg-slate-200">Contact</h2>
        </div>
      </Modal>
    </Flex>
  );
});

export default EditModal;
