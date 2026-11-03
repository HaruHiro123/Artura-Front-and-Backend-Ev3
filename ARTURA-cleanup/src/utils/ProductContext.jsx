import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // 1. GET ALL ARTWORKS / PRODUCTS (Bab 4.3.2)
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["artworks"],
    queryFn: async () => {
      const res = await apiClient.get("/artworks");
      return res.data.data || res.data;
    },
    retry: 1,
  });

  // 2. GET ARTWORKS DENGAN FILTER & PAGINATION (Bab 4.3.4)
  const getProducts = async ({
    page = 1,
    limit = 10,
    category_id = "",
    keyword = "",
  } = {}) => {
    const res = await apiClient.get(
      `/artworks?page=${page}&limit=${limit}&category_id=${category_id}&keyword=${keyword}`
    );
    return res.data.data || res.data;
  };

  // 3. SHOW DETAIL BY ID / SLUG (Bab 4.3.2)
  const getProductById = async (id) => {
    const res = await apiClient.get(`/artworks/${id}`);
    return res.data.data || res.data;
  };

  // 4. CREATE / STORE ARTWORK (Bab 4.3.2)
  const addProduct = async (formData) => {
    const response = await apiClient.post("/artworks", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    queryClient.invalidateQueries({ queryKey: ["artworks"] });
    return response;
  };

  // 5. UPDATE ARTWORK DENGAN ?_method=PUT (Bab 4.3.2)
  const updateProduct = async (id, formData) => {
    const response = await apiClient.post(
      `/artworks/${id}?_method=PUT`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    queryClient.invalidateQueries({ queryKey: ["artworks"] });
    return response;
  };

  // 6. DELETE ARTWORK (Bab 4.3.2)
  const deleteProduct = useMutation({
    mutationFn: async (id) => await apiClient.delete(`/artworks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
    },
  });

  // 7. GET CATEGORIES RELASI DATA (Bab 4.3.3)
  const getCategories = async () => {
    const res = await apiClient.get("/categories");
    return res.data.data || res.data;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        artworks: products,
        isLoading,
        isError,
        getProducts,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        getCategories,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);