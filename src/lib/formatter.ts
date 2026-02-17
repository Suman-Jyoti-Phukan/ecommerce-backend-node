
export const formatProductOrVariant = (item: any) => {
    const isVariant = !!item.variantId;
    const product = item.product;
    const variant = item.variant;

    let displayDetails: any = {
        name: product?.productName || "Unknown Product",
        image: product?.mainImage || null,
        price: product?.sellingPrice || product?.maximumRetailPrice || 0,
        size: item.size || product?.size || null,
        color: item.color || null,
        sku: null
    };

    if (isVariant && variant) {
        displayDetails.name = `${product?.productName || ""} (${variant.variantName || variant.size || variant.color || ""})`;
        displayDetails.price = variant.sellingPrice || variant.maximumRetailPrice || displayDetails.price;

        let variantImages = [];
        try {
            if (variant.variantImages) {
                variantImages = JSON.parse(variant.variantImages);
            }
        } catch (e) {
            console.error("Error parsing variant images", e);
        }

        displayDetails.image = variantImages[0] || displayDetails.image;
        displayDetails.size = variant.size || displayDetails.size;
        displayDetails.color = variant.color || displayDetails.color;
        displayDetails.sku = variant.sku;
    }

    return {
        ...item,
        type: isVariant ? "VARIANT" : "SIMPLE_PRODUCT",
        displayDetails
    };
};

export const formatOrder = (order: any) => {
    if (!order) return null;
    return {
        ...order,
        orderItems: order.orderItems?.map(formatProductOrVariant) || []
    };
};

export const formatOrderList = (orders: any[]) => {
    return orders.map(formatOrder);
};

export const formatCartItems = (cartItems: any[]) => {
    return cartItems.map(formatProductOrVariant);
};
