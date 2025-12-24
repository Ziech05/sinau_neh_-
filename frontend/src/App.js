import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa"; // Import Icons
import "./App.css"; // Import Custom CSS

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false); // State untuk kontrol Modal

  const API_URL = "http://localhost:5000/products";

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Fungsi Reset Form & Buka Modal Tambah
  const handleAdd = () => {
    setName("");
    setPrice("");
    setEditId(null);
    setShowModal(true);
  };

  // Fungsi Buka Modal Edit
  const handleEdit = (product) => {
    setName(product.name);
    setPrice(product.price);
    setEditId(product.id);
    setShowModal(true);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, { name, price });
        Swal.fire("Berhasil!", "Data produk berhasil diupdate.", "success");
      } else {
        await axios.post(API_URL, { name, price });
        Swal.fire("Berhasil!", "Produk baru berhasil ditambahkan.", "success");
      }
      setShowModal(false); // Tutup modal
      getProducts(); // Refresh data
    } catch (error) {
      Swal.fire("Error!", "Terjadi kesalahan saat menyimpan data.", "error");
    }
  };

  const deleteProduct = (id) => {
    // Gunakan SweetAlert untuk konfirmasi hapus
    Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/${id}`);
          Swal.fire("Terhapus!", "Produk telah dihapus.", "success");
          getProducts();
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  return (
    <div className="container mt-5">
      {/* Header Aplikasi */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">📦 Manajemen Produk</h2>
        <button className="btn btn-primary shadow-sm" onClick={handleAdd}>
          <FaPlus className="me-2" /> Tambah Produk
        </button>
      </div>

      {/* Tabel Data dengan Desain Card */}
      <div className="table-wrapper">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col" width="5%">
                #
              </th>
              <th scope="col">Nama Produk</th>
              <th scope="col" width="20%">
                Harga (IDR)
              </th>
              <th scope="col" width="15%" className="text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">
                  Data produk kosong. Silakan tambah data baru.
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td className="fw-bold text-dark">{product.name}</td>
                  <td className="text-success fw-bold">
                    Rp {Number(product.price).toLocaleString("id-ID")}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn btn-outline-info btn-sm me-2 rounded-circle"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="btn btn-outline-danger btn-sm rounded-circle"
                      title="Hapus"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CUSTOM MODAL POPUP */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content-custom">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold">
                {editId ? "Edit Produk" : "Tambah Produk Baru"}
              </h4>
              <button
                className="btn btn-light btn-sm rounded-circle"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={saveProduct}>
              <div className="mb-3">
                <label className="form-label text-muted small">
                  Nama Produk
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Contoh: Kopi Susu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small">Harga</label>
                <div className="input-group">
                  <span className="input-group-text">Rp</span>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-lg">
                  {editId ? "Update Data" : "Simpan Data"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
