// Shopify Storefront API + cart state (Zustand).
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN =
  import.meta.env.VITE_SHOPIFY_STORE_DOMAIN ?? "pathorize-flow-iaw9w.myshopify.com";
export const SHOPIFY_STOREFRONT_TOKEN =
  import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN ?? "c4b79a36faa8ef4ab6f0b3a914dfb47c";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

export const POSTER_PRODUCT_HANDLE =
  import.meta.env.VITE_SHOPIFY_POSTER_PRODUCT_HANDLE ?? "custom-marathon-poster";

export interface ShopifyVariant {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface ShopifyProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: ShopifyVariant }> };
  options: Array<{ name: string; values: string[] }>;
}

export interface ShopifyProduct {
  node: ShopifyProductNode;
}

export async function storefrontApiRequest<T = any>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<{ data?: T; errors?: Array<{ message: string }> } | undefined> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description:
        "Shopify API access requires an active billing plan. Visit https://admin.shopify.com to upgrade.",
    });
    return;
  }
  if (!response.ok) {
    throw new Error(`Shopify HTTP ${response.status}`);
  }
  const data = await response.json();
  if (data.errors) {
    throw new Error(
      `Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`,
    );
  }
  return data;
}

const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      priceRange { minVariantPrice { amount currencyCode } }
      images(first: 5) { edges { node { url altText } } }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price { amount currencyCode }
            availableForSale
            selectedOptions { name value }
          }
        }
      }
      options { name values }
    }
  }
`;

export async function fetchPosterProduct(): Promise<ShopifyProduct | null> {
  const data = await storefrontApiRequest<{ product: ShopifyProductNode | null }>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle: POSTER_PRODUCT_HANDLE },
  );
  if (!data?.data?.product) return null;
  return { node: data.data.product };
}

/* ----------------------------- Cart / Checkout ---------------------------- */

const CART_QUERY = /* GraphQL */ `
  query cart($id: ID!) {
    cart(id: $id) { id totalQuantity }
  }
`;

const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges { node { id merchandise { ... on ProductVariant { id } } } }
        }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) {
          edges { node { id merchandise { ... on ProductVariant { id } } } }
        }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

export interface LineAttribute {
  key: string;
  value: string;
}

export interface CartItem {
  lineId: string | null;
  variantId: string;
  variantTitle: string;
  productTitle: string;
  imageUrl?: string | null;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
  attributes: LineAttribute[];
}

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function isCartNotFoundError(
  userErrors: Array<{ field: string[] | null; message: string }>,
): boolean {
  return userErrors.some((e) => {
    const m = e.message.toLowerCase();
    return m.includes("cart not found") || m.includes("does not exist");
  });
}

async function createShopifyCart(
  item: CartItem,
): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const data = await storefrontApiRequest<{
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
        lines: { edges: Array<{ node: { id: string } }> };
      } | null;
      userErrors: Array<{ field: string[] | null; message: string }>;
    };
  }>(CART_CREATE_MUTATION, {
    input: {
      lines: [
        {
          quantity: item.quantity,
          merchandiseId: item.variantId,
          attributes: item.attributes,
        },
      ],
    },
  });

  const result = data?.data?.cartCreate;
  if (!result) return null;
  if (result.userErrors?.length) {
    console.error("Cart creation failed:", result.userErrors);
    return null;
  }
  const cart = result.cart;
  if (!cart?.checkoutUrl) return null;
  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;
  return {
    cartId: cart.id,
    checkoutUrl: formatCheckoutUrl(cart.checkoutUrl),
    lineId,
  };
}

async function addLineToShopifyCart(
  cartId: string,
  item: CartItem,
): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest<{
    cartLinesAdd: {
      cart: {
        lines: {
          edges: Array<{ node: { id: string; merchandise: { id: string } } }>;
        };
      } | null;
      userErrors: Array<{ field: string[] | null; message: string }>;
    };
  }>(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [
      {
        quantity: item.quantity,
        merchandiseId: item.variantId,
        attributes: item.attributes,
      },
    ],
  });

  const userErrors = data?.data?.cartLinesAdd?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length) {
    console.error("Add line failed:", userErrors);
    return { success: false };
  }
  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const newLine = lines.find((l) => l.node.merchandise.id === item.variantId);
  return { success: true, lineId: newLine?.node?.id };
}

async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest<{
    cartLinesUpdate: {
      userErrors: Array<{ field: string[] | null; message: string }>;
    };
  }>(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  const userErrors = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length) {
    console.error("Update line failed:", userErrors);
    return { success: false };
  }
  return { success: true };
}

async function removeLineFromShopifyCart(
  cartId: string,
  lineId: string,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest<{
    cartLinesRemove: {
      userErrors: Array<{ field: string[] | null; message: string }>;
    };
  }>(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });
  const userErrors = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length) {
    console.error("Remove line failed:", userErrors);
    return { success: false };
  }
  return { success: true };
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  updateQuantity: (lineKey: string, quantity: number) => Promise<void>;
  removeItem: (lineKey: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
}

// Each customized poster is a distinct line — key by variantId + serialized attributes.
function lineKeyOf(item: { variantId: string; attributes: LineAttribute[] }) {
  const attrs = [...item.attributes]
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((a) => `${a.key}=${a.value}`)
    .join("|");
  return `${item.variantId}::${attrs}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,

      addItem: async (item) => {
        const { cartId, clearCart } = get();
        set({ isLoading: true });
        try {
          if (!cartId) {
            const result = await createShopifyCart({ ...item, lineId: null });
            if (result) {
              set({
                cartId: result.cartId,
                checkoutUrl: result.checkoutUrl,
                items: [{ ...item, lineId: result.lineId }],
              });
            }
          } else {
            const result = await addLineToShopifyCart(cartId, { ...item, lineId: null });
            if (result.success) {
              const currentItems = get().items;
              set({
                items: [...currentItems, { ...item, lineId: result.lineId ?? null }],
              });
            } else if (result.cartNotFound) {
              clearCart();
            }
          }
        } catch (err) {
          console.error("Failed to add item:", err);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (lineKey, quantity) => {
        if (quantity <= 0) return get().removeItem(lineKey);
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => lineKeyOf(i) === lineKey);
        if (!item?.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const result = await updateShopifyCartLine(cartId, item.lineId, quantity);
          if (result.success) {
            const current = get().items;
            set({
              items: current.map((i) =>
                lineKeyOf(i) === lineKey ? { ...i, quantity } : i,
              ),
            });
          } else if (result.cartNotFound) {
            clearCart();
          }
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (lineKey) => {
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => lineKeyOf(i) === lineKey);
        if (!item?.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const result = await removeLineFromShopifyCart(cartId, item.lineId);
          if (result.success) {
            const remaining = get().items.filter((i) => lineKeyOf(i) !== lineKey);
            if (remaining.length === 0) clearCart();
            else set({ items: remaining });
          } else if (result.cartNotFound) {
            clearCart();
          }
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),
      getCheckoutUrl: () => get().checkoutUrl,

      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing) return;
        set({ isSyncing: true });
        try {
          const data = await storefrontApiRequest<{
            cart: { id: string; totalQuantity: number } | null;
          }>(CART_QUERY, { id: cartId });
          if (!data) return;
          const cart = data?.data?.cart;
          if (!cart || cart.totalQuantity === 0) clearCart();
        } catch (err) {
          console.error("Failed to sync cart:", err);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "racepace-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
      }),
    },
  ),
);

export { lineKeyOf };
