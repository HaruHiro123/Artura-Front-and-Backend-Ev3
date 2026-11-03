import React from "react";
import toast from "react-hot-toast";
import apiClient, { API_BASE_URL, API_TOKEN_LS_KEY } from "../utils/apiClient";

const h = React.createElement;
const LEGACY_TOKEN_KEY = "artura.sanctum.token.v2";

const DEFAULT_ADMIN_AUTH = {
  name: "ADMIN",
  email: import.meta.env.VITE_API_ADMIN_EMAIL || "admin@artura.com",
  password: import.meta.env.VITE_API_ADMIN_PASSWORD || "artura123",
};

export function getActiveLanguage() {
  if (typeof window === "undefined") return "id";

  const candidateKeys = [
    "artura.language.v1",
    "artura.language",
    "artura.lang",
    "artura.lang.v1",
    "artura_language",
    "language",
    "lang",
    "i18nextLng",
  ];

  for (const key of candidateKeys) {
    const raw = window.localStorage.getItem(key);
    if (raw) {
      const clean = raw.replace(/['"]/g, "").trim().toLowerCase();
      if (clean === "id" || clean.startsWith("id-") || clean.includes("ind")) return "id";
      if (clean === "en" || clean.startsWith("en-") || clean.includes("eng")) return "en";
    }
  }

  const htmlLang = document.documentElement?.lang?.toLowerCase();
  if (htmlLang === "id" || htmlLang?.startsWith("id-")) return "id";
  if (htmlLang === "en" || htmlLang?.startsWith("en-")) return "en";

  return "id";
}

const MESSAGES = {
  id: {
    createdTitle: "Karya berhasil disimpan",
    createdDesc: (title) =>
      `"${title}" telah ditambahkan ke dalam katalog dan database.`,
    createFailed: "Gagal menyimpan karya",

    updatedTitle: "Perubahan karya disimpan",
    updatedWarn: (title) =>
      `Perubahan pada "${title}" telah diperbarui. Pilih Urungkan jika ada perubahan yang belum sesuai.`,
    updateFailed: "Gagal memperbarui karya",

    deletedTitle: "Karya dihapus",
    deletedWarn: (title) =>
      `"${title}" telah dihapus dari katalog. Pilih Urungkan untuk mengembalikan karya ini.`,
    deleteFailed: "Gagal menghapus karya",

    pricingUpdatedTitle: "Harga komisi diperbarui",
    pricingUpdatedDesc:
      "Daftar harga komisi telah disinkronkan ke tampilan pengguna dan database. Pilih Urungkan jika belum sesuai.",

    commissionUpdatedTitle: "Data & harga komisi diperbarui",
    commissionUpdatedDesc: (id) =>
      `Perubahan pada komisi "${id}" telah diterapkan ke halaman pengguna. Pilih Urungkan untuk membatalkan.`,

    restoring: "Mengembalikan data...",
    restoredTitle: "Perubahan diurungkan",
    restoredDesc: (title) =>
      `Data "${title}" telah dikembalikan ke kondisi semula.`,
    restoreFailed: "Gagal mengurungkan perubahan.",

    undoBtn: "Urungkan",
    doneBtn: "Selesai",
    closeBtn: "Tutup",
  },
  en: {
    createdTitle: "Artwork saved",
    createdDesc: (title) =>
      `"${title}" has been added to the catalog and database.`,
    createFailed: "Failed to save artwork",

    updatedTitle: "Artwork updated",
    updatedWarn: (title) =>
      `Changes to "${title}" have been saved. Select Undo if you want to revert these changes.`,
    updateFailed: "Failed to update artwork",

    deletedTitle: "Artwork deleted",
    deletedWarn: (title) =>
      `"${title}" was removed from the catalog. Select Undo to restore this artwork.`,
    deleteFailed: "Failed to delete artwork",

    pricingUpdatedTitle: "Commission pricing updated",
    pricingUpdatedDesc:
      "Commission rates are now live on the user page and saved to the database. Select Undo to revert.",

    commissionUpdatedTitle: "Commission details updated",
    commissionUpdatedDesc: (id) =>
      `Updates to commission "${id}" are now visible to the client. Select Undo to revert.`,

    restoring: "Restoring data...",
    restoredTitle: "Changes undone",
    restoredDesc: (title) =>
      `"${title}" has been restored to its previous state.`,
    restoreFailed: "Failed to undo changes.",

    undoBtn: "Undo",
    doneBtn: "Done",
    closeBtn: "Dismiss",
  },
};

function getDict() {
  const lang = getActiveLanguage();
  return MESSAGES[lang] || MESSAGES.en;
}

export function showArturaToast({
  title,
  description,
  onUndo,
  confirmLabel,
  duration = 7500,
}) {
  const dict = getDict();

  toast.custom(
    (t) =>
      h(
        "div",
        {
          className: `${
            t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          } max-w-sm w-full rounded-2xl bg-white p-5 text-stone-900 shadow-lg border border-stone-200 pointer-events-auto transition-all duration-200`,
        },
        h(
          "div",
          { className: "flex items-start justify-between gap-4" },
          h(
            "h4",
            { className: "font-serif text-lg font-medium text-stone-900 leading-snug" },
            title
          ),
          h(
            "button",
            {
              type: "button",
              onClick: () => toast.dismiss(t.id),
              className:
                "text-stone-400 hover:text-stone-700 text-xs p-1 -mr-1 -mt-1 transition cursor-pointer",
              "aria-label": "Close",
            },
            "✕"
          )
        ),
        description
          ? h(
              "p",
              { className: "mt-1.5 text-xs text-stone-600 leading-relaxed" },
              description
            )
          : null,
        h(
          "div",
          {
            className:
              "mt-4 pt-3 border-t border-stone-100 flex items-center justify-end gap-2",
          },
          onUndo
            ? h(
                "button",
                {
                  type: "button",
                  onClick: async () => {
                    toast.dismiss(t.id);
                    await onUndo();
                  },
                  className:
                    "rounded-full border border-stone-300 bg-white px-4 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 transition cursor-pointer",
                },
                dict.undoBtn
              )
            : null,
          h(
            "button",
            {
              type: "button",
              onClick: () => toast.dismiss(t.id),
              className:
                "rounded-full bg-stone-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-stone-800 transition cursor-pointer",
            },
            confirmLabel || dict.doneBtn
          )
        )
      ),
    { duration }
  );
}

// Notifikasi khusus saat Admin memperbarui Daftar Harga Komisi (Pricing) atau Harga Komisi User
export function notifyPricingOrCommissionUpdated({ type = "pricing", label = "", onUndo }) {
  const dict = getDict();
  const isPricing = type === "pricing";

  showArturaToast({
    title: isPricing ? dict.pricingUpdatedTitle : dict.commissionUpdatedTitle,
    description: isPricing ? dict.pricingUpdatedDesc : dict.commissionUpdatedDesc(label),
    confirmLabel: dict.doneBtn,
    duration: 7500,
    onUndo: onUndo
      ? async () => {
          const currentDict = getDict();
          await onUndo();
          showArturaToast({
            title: currentDict.restoredTitle,
            description: currentDict.restoredDesc(isPricing ? "Pricing" : label),
            confirmLabel: currentDict.doneBtn,
            duration: 5000,
          });
        }
      : null,
  });
}

export function getSavedSanctumToken() {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem(API_TOKEN_LS_KEY) ||
    window.localStorage.getItem(LEGACY_TOKEN_KEY)
  );
}

export function saveSanctumToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(API_TOKEN_LS_KEY, token);
    window.localStorage.setItem(LEGACY_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(API_TOKEN_LS_KEY);
    window.localStorage.removeItem(LEGACY_TOKEN_KEY);
  }
}

export async function ensureSanctumToken() {
  const existingToken = getSavedSanctumToken();
  if (existingToken) return existingToken;

  try {
    const loginRes = await apiClient.post("/login", {
      email: DEFAULT_ADMIN_AUTH.email,
      password: DEFAULT_ADMIN_AUTH.password,
    });

    if (loginRes.data?.token) {
      saveSanctumToken(loginRes.data.token);
      return loginRes.data.token;
    }
  } catch {
    try {
      await apiClient.post("/register", {
        name: DEFAULT_ADMIN_AUTH.name,
        email: DEFAULT_ADMIN_AUTH.email,
        password: DEFAULT_ADMIN_AUTH.password,
      });

      const retryLogin = await apiClient.post("/login", {
        email: DEFAULT_ADMIN_AUTH.email,
        password: DEFAULT_ADMIN_AUTH.password,
      });

      if (retryLogin.data?.token) {
        saveSanctumToken(retryLogin.data.token);
        return retryLogin.data.token;
      }
    } catch (err) {
      console.warn("Auto-auth failed:", err);
    }
  }
  return null;
}

export async function fetchArtworksFromApi() {
  const response = await apiClient.get("/artworks");
  return Array.isArray(response.data?.data)
    ? response.data.data
    : response.data;
}

export async function fetchCategoriesFromApi() {
  const response = await apiClient.get("/categories");
  return Array.isArray(response.data?.data)
    ? response.data.data
    : response.data;
}

function buildArtworkPayload(artworkData) {
  const categoryName = String(
    artworkData.category?.category ||
      artworkData.category?.name ||
      artworkData.category ||
      ""
  ).toLowerCase();

  const categoryId =
    artworkData.category_id ||
    artworkData.category?.category_id ||
    artworkData.category?.id ||
    (categoryName.includes("traditional") || categoryName.includes("tradisional")
      ? 2
      : 1);

  const collectionType =
    artworkData.collectionType || artworkData.collection_type || "portfolio";

  let resolvedStatus = artworkData.status;
  if (collectionType === "shop") {
    if (!resolvedStatus || resolvedStatus === "not-for-sale" || resolvedStatus === "portfolio") {
      resolvedStatus = "available";
    }
  } else {
    resolvedStatus = "not-for-sale";
  }

  return {
    title: artworkData.title || "Untitled Artwork",
    category_id: Number(categoryId),
    collection_type: collectionType,
    medium: artworkData.medium || "",
    technique: artworkData.technique || "",
    year: String(artworkData.year || new Date().getFullYear()).slice(0, 4),
    description: artworkData.description || "",
    price: collectionType === "shop" ? Number(artworkData.price) || 0 : null,
    status: resolvedStatus,
    featured: Boolean(artworkData.featured),
    image: artworkData.image || artworkData.img_url || artworkData.img || "",
  };
}

export async function createArtworkInApi(artworkData, options = {}) {
  const dict = getDict();
  try {
    await ensureSanctumToken();
    const payload = buildArtworkPayload(artworkData);
    const response = await apiClient.post("/artworks", payload);
    const createdItem = response.data?.data || response.data;

    if (!options.silent) {
      showArturaToast({
        title: dict.createdTitle,
        description: dict.createdDesc(createdItem?.title || payload.title),
        confirmLabel: dict.doneBtn,
        duration: 6000,
      });
    }
    return createdItem;
  } catch (error) {
    if (error.response?.status === 401) {
      saveSanctumToken(null);
      await ensureSanctumToken();
      const payload = buildArtworkPayload(artworkData);
      const retryRes = await apiClient.post("/artworks", payload);
      const createdItem = retryRes.data?.data || retryRes.data;
      if (!options.silent) {
        showArturaToast({
          title: dict.createdTitle,
          description: dict.createdDesc(createdItem?.title || payload.title),
          confirmLabel: dict.doneBtn,
          duration: 6000,
        });
      }
      return createdItem;
    }
    if (!options.silent) {
      showArturaToast({
        title: dict.createFailed,
        description: error.response?.data?.message || "",
        confirmLabel: dict.closeBtn,
        duration: 6000,
      });
    }
    throw error;
  }
}

export async function updateArtworkInApi(idOrSlug, artworkData, options = {}) {
  const dict = getDict();
  let previousSnapshot = options.previousSnapshot || null;

  try {
    await ensureSanctumToken();

    if (!previousSnapshot) {
      try {
        const prevRes = await apiClient.get(`/artworks/${idOrSlug}`);
        previousSnapshot = prevRes.data?.data || prevRes.data;
      } catch {
        previousSnapshot = null;
      }
    }

    const payload = buildArtworkPayload(artworkData);
    const response = await apiClient.put(`/artworks/${idOrSlug}`, payload);
    const updatedItem = response.data?.data || response.data;

    const revertTargetId =
      updatedItem?.id || updatedItem?.slug || previousSnapshot?.id || idOrSlug;

    if (!options.silent) {
      showArturaToast({
        title: dict.updatedTitle,
        description: dict.updatedWarn(updatedItem?.title || payload.title),
        confirmLabel: dict.doneBtn,
        duration: 8000,
        onUndo: previousSnapshot
          ? async () => {
              const currentDict = getDict();
              const loadingId = toast.loading(currentDict.restoring);
              try {
                await apiClient.put(
                  `/artworks/${revertTargetId}`,
                  buildArtworkPayload(previousSnapshot)
                );
                toast.dismiss(loadingId);
                window.dispatchEvent(new CustomEvent("artura:data-restored"));
                showArturaToast({
                  title: currentDict.restoredTitle,
                  description: currentDict.restoredDesc(
                    previousSnapshot.title || "Artwork"
                  ),
                  confirmLabel: currentDict.doneBtn,
                  duration: 5500,
                });
              } catch {
                toast.dismiss(loadingId);
                toast.error(currentDict.restoreFailed, { duration: 5000 });
              }
            }
          : null,
      });
    }

    return updatedItem;
  } catch (error) {
    if (!options.silent) {
      showArturaToast({
        title: dict.updateFailed,
        description: error.response?.data?.message || "",
        confirmLabel: dict.closeBtn,
        duration: 6000,
      });
    }
    throw error;
  }
}

export async function deleteArtworkInApi(idOrSlug, options = {}) {
  const dict = getDict();
  let deletedSnapshot = options.deletedSnapshot || null;

  try {
    await ensureSanctumToken();

    if (!deletedSnapshot) {
      try {
        const prevRes = await apiClient.get(`/artworks/${idOrSlug}`);
        deletedSnapshot = prevRes.data?.data || prevRes.data;
      } catch {
        deletedSnapshot = null;
      }
    }

    const response = await apiClient.delete(`/artworks/${idOrSlug}`);

    if (!options.silent) {
      const deletedTitle = deletedSnapshot?.title || String(idOrSlug);
      showArturaToast({
        title: dict.deletedTitle,
        description: dict.deletedWarn(deletedTitle),
        confirmLabel: dict.closeBtn,
        duration: 8000,
        onUndo: deletedSnapshot
          ? async () => {
              const currentDict = getDict();
              const loadingId = toast.loading(currentDict.restoring);
              try {
                await createArtworkInApi(deletedSnapshot, { silent: true });
                toast.dismiss(loadingId);
                window.dispatchEvent(new CustomEvent("artura:data-restored"));
                showArturaToast({
                  title: currentDict.restoredTitle,
                  description: currentDict.restoredDesc(deletedTitle),
                  confirmLabel: currentDict.doneBtn,
                  duration: 5500,
                });
              } catch {
                toast.dismiss(loadingId);
                toast.error(currentDict.restoreFailed, { duration: 5000 });
              }
            }
          : null,
      });
    }

    return response.data;
  } catch (error) {
    if (!options.silent) {
      showArturaToast({
        title: dict.deleteFailed,
        description: error.response?.data?.message || "",
        confirmLabel: dict.closeBtn,
        duration: 6000,
      });
    }
    throw error;
  }
}

function getClientCartKey() {
  if (typeof window === "undefined") return "default_guest";
  let key = window.localStorage.getItem("artura.client.cart.key");
  if (!key) {
    key = "cart-" + Math.random().toString(36).substring(2, 11);
    window.localStorage.setItem("artura.client.cart.key", key);
  }
  return key;
}

export async function fetchStoreDataFromApi() {
  const response = await apiClient.get("/store-data");
  return response.data;
}

export async function syncStoreDataToApi(storeState) {
  const payload = {
    orders: storeState.orders || [],
    commissions: storeState.commissions || [],
    reviews: storeState.reviews || [],
    pricing: storeState.pricing || null,
    artist: storeState.artist || null,
    paymentSettings: storeState.paymentSettings || null,
    siteSettings: storeState.siteSettings || null,
  };
  const response = await apiClient.post("/store-data", payload);
  return response.data;
}

export async function fetchCartFromApi() {
  const response = await apiClient.get(`/cart?client_key=${getClientCartKey()}`);
  return Array.isArray(response.data?.items) ? response.data.items : [];
}

export async function syncCartToApi(items) {
  const response = await apiClient.post("/cart", {
    client_key: getClientCartKey(),
    items: Array.isArray(items) ? items : [],
  });
  return response.data;
}

export { API_BASE_URL };