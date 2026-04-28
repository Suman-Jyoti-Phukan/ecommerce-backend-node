import { prisma } from "./db/prisma";

const productsToInsert = [
    {
        "product_name": "ERI STOLE OFF WHITE LIGHT GREEN STRIP",
        "long_description": "Eri, a pure and natural treasure from Northeast India—crafted without harm as the moth completes its life cycle freely. Soft milky-white fibers, gently dyed with flowers and natural elements, create soothing pastel hues that carry an earthy elegance. Suitable for both men and women, each stole drapes effortlessly with any attire.\nEvery handwoven piece is truly one of a kind, reflecting the weaver’s touch and rhythm—where slight variations and textures are not flaws, but the signature of authentic craftsmanship.",
        "mrp": 3000.0,

    },
    {
        "product_name": "Maroon Motifs Off-white mulberry silk Mekhala Chador",
        "long_description": "Mulberry silk mekhela chador, commonly known as paat mekhela chador, is a luxurious traditional attire of Assam. It is admired for its elegance, softness, and suitability for weddings, festivals, and other special occasions. Crafted from pure mulberry silk, it is valued for its smooth feel, natural luster, and lasting durability. The mekhela chador is a traditional Assamese outfit worn by women, known for its timeless elegance and cultural significance. It is a two-piece attire consisting of the mekhela (the lower draped skirt) and the chador (the upper wrap), often paired with a blouse.\n",
        "mrp": 17000.0
    },
    {
        "product_name": "Natural Golden Silk Muga Silk Saree",
        "long_description": "A muga silk saree is a luxurious traditional attire from Assam, renowned for its natural golden sheen and exceptional durability. Made from rare muga silk fibers, it has a unique glossy texture. Handwoven by skilled artisans, muga silk sarees often feature intricate motifs inspired by Assamese culture and nature, giving them a rich and elegant look. Lightweight yet strong, this saree is highly valued for its longevity and timeless appeal.",
        "mrp": 80000.0
    },
    {
        "product_name": "Tussar Silk Saree_Animal  motifs",
        "long_description": "An Assamese handwoven Tussar saree is a beautiful blend of tradition and natural elegance. Crafted by skilled weavers, it is made from Tussar silk, known for its slightly textured feel and soft, earthy shine. The fabric is lightweight and breathable, making it comfortable to wear for long hours. These sarees often feature subtle patterns and traditional Assamese motifs, inspired by nature and local culture, which add a graceful charm without being too heavy. Each piece reflects fine craftsmanship and a touch of authenticity.",
        "mrp": 15500.0
    },
    {
        "product_name": "Mulberry Silk Mekhala Chador_Vibrant Lime & Forest Green",
        "long_description": "This elegant dual-color mulberry silk mekhela chador beautifully blends vibrant yellow and fresh green, creating a striking and graceful look. The smooth, glossy texture of pure mulberry silk adds a rich shine, enhancing its premium feel. Delicately woven with small traditional motifs across the body, it reflects fine craftsmanship and subtle detailing. The border features intricate designs with a touch of golden weave and artistic patterns, adding depth and charm to the overall appearance.",
        "mrp": 14500.0
    },
    {
        "product_name": "Maroon Red Buta Muga Silk Stole",
        "long_description": "A muga silk stole adorned with red Assamese motifs is a perfect blend of tradition and elegance. Made from rich muga silk, it carries a natural golden glow that adds a luxurious touch to any look. The vibrant red motifs, inspired by classic Assamese designs, stand out beautifully against the golden base, showcasing fine handwoven craftsmanship. Lightweight yet durable, this stole drapes gracefully and feels comfortable to wear.",
        "mrp": 18000.0
    },
    {
        "product_name": "Maroon Red Motifs Muga Silk Saree",
        "long_description": "A muga silk saree featuring red Assamese motifs is a timeless expression of heritage and elegance. Woven from authentic muga silk, it carries a natural golden sheen that gives the saree a rich and radiant look. The intricate red motifs, inspired by traditional Assamese patterns, create a beautiful contrast against the golden base, adding depth and artistic charm. Each detail reflects skilled handloom craftsmanship and cultural pride.",
        "mrp": 80000.0
    },
    {
        "product_name": "Golden Motifs in Blue Mulberry Silk Mekhal Chador",
        "long_description": "A blue mulberry silk mekhela chador with golden Assamese motifs is a perfect blend of elegance and tradition. Crafted from fine mulberry silk, it has a smooth texture and a natural sheen that enhances its rich appearance. The deep blue base beautifully highlights the intricate golden motifs, inspired by traditional Assamese designs, giving it a regal and graceful look. The detailed weaving along the borders and body reflects skilled craftsmanship and cultural artistry.",
        "mrp": 12000.0
    },
    {
        "product_name": "Light Brown with Deep Red Border Eri Stole",
        "long_description": "An eri silk (ahimsa silk) stole with a red border is a graceful blend of comfort, tradition, and conscious fashion. Made from naturally spun eri silk, it has a soft, slightly textured feel and a warm, breathable quality, making it perfect for all-day wear. The rich red border adds a striking contrast to the subtle base, bringing in a touch of traditional Assamese charm. Known for being eco-friendly and cruelty-free, eri silk reflects mindful craftsmanship while maintaining elegance.",
        "mrp": 18000.0
    },
    {
        "product_name": "Natural Beige with Hand Knotted Tassels Eri Silk Stole",
        "long_description": "An eri silk, also known as ahimsa silk, stole is a perfect combination of comfort, simplicity, and mindful elegance. Made from naturally spun silk without harming the silkworm, it is valued for its eco-friendly and cruelty-free nature. The fabric has a soft, slightly textured feel with a gentle matte finish, offering warmth in cooler weather while remaining breathable. Its subtle, earthy look reflects the beauty of traditional handloom craftsmanship.",
        "mrp": 8000.0
    },
    {
        "product_name": "Natural Undyed Golden Muga Silk Stole",
        "long_description": "A Muga or Assam silk stole is a symbol of timeless elegance and rich heritage. Made from the finest silk of Assam, it is known for its natural golden hue and smooth, luxurious texture that gives it a distinctive glow. Carefully handwoven by skilled artisans, the stole often features subtle traditional patterns that reflect the culture and artistry of the region. Lightweight yet durable, it drapes beautifully and becomes even more lustrous with time.",
        "mrp": 16000.0
    },
    {
        "product_name": "Diamond Shaped motifs with horizantal strips & hand knotted tassels Muga Silk Mekhala Chador",
        "long_description": "A Muga or Assam silk Mekhala Chadar is a timeless symbol of elegance and tradition. Woven from the finest silk of Assam, it is celebrated for its natural golden hue and rich, glossy texture that sets it apart. Handcrafted by skilled artisans, these sarees often feature delicate motifs inspired by Assamese culture and nature, adding a touch of artistic beauty. Known for its strength and durability, the fabric becomes even more lustrous over time.",
        "mrp": 80000.0
    },
    {
        "product_name": "Multi coloured traditional motifs Muga Silk Mekhala Chador",
        "long_description": "A Muga or Assam silk mekhela chador is a classic expression of Assamese tradition and elegance. Woven from the finest silk of Assam, it is known for its natural golden shine and rich, smooth texture that gives it a regal appeal. Carefully handcrafted by skilled weavers, it often features intricate motifs inspired by nature and traditional Assamese designs, adding depth and cultural beauty. The fabric is not only graceful but also strong and long-lasting, becoming more radiant with time.",
        "mrp": 80000.0
    },
    {
        "product_name": "Traditional Assamese multi coloured motifs Eri Silk Saree",
        "long_description": "An eri silk saree, also known as ahimsa silk saree, is a beautiful blend of comfort, tradition, and conscious living. Made from naturally spun eri silk without harming the silkworm, it is valued for its eco-friendly and sustainable nature. The fabric has a soft, slightly textured feel with a gentle matte finish, offering warmth while remaining breathable and comfortable for long wear. Often handwoven, eri sarees feature subtle patterns and earthy tones that reflect the simplicity and charm of traditional craftsmanship.",
        "mrp": 15500.0
    },
    {
        "product_name": "Golden Yellow hue motifs Muga Silk Mekhala Chador",
        "long_description": "A muga silk mekhela chador is one of the most treasured traditional outfits of Assam, known for its natural golden shine and timeless elegance. Made from rare muga silk, it has a rich texture and a distinctive glow that becomes even more beautiful with age. Handwoven by skilled artisans, this attire often features intricate Assamese motifs inspired by nature and heritage, adding depth and artistic charm. The fabric is strong, durable, and luxurious, making it a symbol of pride and cultural identity.",
        "mrp": 70000.0
    },
    {
        "product_name": "Luzurious Golden Beige traditional motifs Muga Silk Mekhala Chador",
        "long_description": "A muga silk mekhela chador is a cherished traditional attire of Assam, admired for its natural golden luster and enduring elegance. Crafted from rare muga silk, it offers a rich texture and a unique glow that deepens beautifully over time. Expertly handwoven, it is often adorned with detailed Assamese motifs inspired by nature and tradition, enhancing its artistic appeal. Strong, durable, and luxurious, this attire stands as a true symbol of cultural pride and heritage.\n",
        "mrp": 50000.0
    },
    {
        "product_name": "Rust Red base off white motifs & tassels Eri Silk Saree",
        "long_description": "An eri silk saree, often called ahimsa silk saree, is a perfect fusion of comfort, tradition, and mindful living. Made from naturally spun eri silk without harming the silkworm, it is appreciated for its eco-friendly and sustainable qualities. The fabric feels soft with a slightly textured touch and a subtle matte finish, providing warmth while staying breathable and comfortable for extended wear. Usually handwoven, eri sarees showcase delicate patterns and earthy shades that highlight the simplicity and beauty of traditional craftsmanship.",
        "mrp": 17500.0
    },
    {
        "product_name": "Textured Jacquard Hexagonal Grid Mulberry Silk Saree",
        "long_description": "A mulberry silk saree is a symbol of elegance and refined luxury, crafted from the finest quality silk. Known for its exceptionally smooth texture and natural glossy finish, it drapes beautifully and enhances the overall look with a rich, graceful appeal. Carefully woven, these sarees often feature intricate designs, traditional motifs, and fine detailing that reflect skilled craftsmanship. Lightweight yet strong, mulberry silk is valued for its durability and long-lasting shine.",
        "mrp": 18000.0
    },
    {
        "product_name": "Natural  rich golden luster Muga Silk Saree",
        "long_description": "A muga silk saree is a timeless symbol of Assamese heritage, admired for its natural golden glow and unmatched elegance. Made from rare muga silk, it has a rich texture and a unique sheen that becomes deeper and more radiant over time. Handwoven by skilled artisans, these sarees often feature intricate traditional motifs inspired by nature and local culture, adding a touch of artistic beauty. Known for its strength and durability, a muga saree can last for generations while retaining its charm.",
        "mrp": 80000.0
    },
    {
        "product_name": "Elegant Off white with Silver woven motifs Mulberry Silk Dokhona Set",
        "long_description": "A mulberry silk dokhona is a graceful and elegant traditional attire, especially cherished among the Bodo community of Assam. Made from fine mulberry silk, it features a smooth, soft texture with a natural sheen that gives it a rich and refined appearance. Carefully woven by skilled artisans, the dokhona often showcases beautiful traditional patterns and motifs, reflecting cultural identity and craftsmanship. The fabric drapes comfortably around the body, offering both style and ease of wear.",
        "mrp": 40000.0
    },
    {
        "product_name": "Light brown base assamese motifs multi layered border Eri Silk Stole",
        "long_description": "An eri silk stole, also known as ahimsa silk stole, is a beautiful blend of comfort, tradition, and mindful craftsmanship. Made from naturally spun eri silk without harming the silkworm, it is valued for its eco-friendly and sustainable nature. The fabric has a soft, slightly textured feel with a gentle matte finish, offering warmth while remaining breathable and comfortable for all-day wear. Lightweight yet cozy, it drapes effortlessly and adds a touch of understated elegance.",
        "mrp": 3000.0
    },
    {
        "product_name": "Natural Golden Shimmer Muga Silk Stole",
        "long_description": "A muga silk stole is a timeless accessory that reflects the rich heritage of Assam. Crafted from rare muga silk, it is known for its natural golden hue and smooth, lustrous texture that gives it a distinct, luxurious appeal. Handwoven by skilled artisans, the stole often features subtle traditional motifs, adding a touch of cultural elegance. Lightweight yet durable, it drapes beautifully and becomes even more radiant with time.",
        "mrp": 15000.0
    },
    {
        "product_name": "Golden Contrast Motifs Off white Eri Silk Stole ",
        "long_description": "An eri silk stole, also known as ahimsa silk, is a perfect blend of comfort, simplicity, and sustainable elegance. Made from naturally spun silk without harming the silkworm, it reflects an eco-friendly and ethical approach to fashion. The fabric has a soft, slightly textured feel with a gentle matte finish, offering warmth while remaining breathable and comfortable throughout the day. Its subtle look and natural tones highlight the beauty of traditional handloom craftsmanship.",
        "mrp": 5000.0
    },
    {
        "product_name": "Earthy Tone Olive Green & Brown Motifs Eri Silk Stole",
        "long_description": "An eri silk stole is a simple yet elegant accessory rooted in Assamese tradition. Made from naturally spun eri silk, it is soft to the touch with a slightly textured feel and a calm, matte finish. Known for its breathable and warm qualities, it offers comfort in all seasons while remaining lightweight and easy to drape. Often handwoven, it reflects the beauty of traditional craftsmanship with its subtle patterns and natural tones.",
        "mrp": 3000.0
    },
    {
        "product_name": "Floral & Leaf Patterned brocade with stripped border with tassles Eri Silk Stole",
        "long_description": "An eri silk shawl is a perfect blend of warmth, comfort, and understated elegance. Made from naturally spun eri silk—often known as ahimsa silk—it is soft, breathable, and gentle on the skin, making it ideal for all-day wear. The fabric has a slightly textured feel with a subtle matte finish, giving it a natural and earthy charm. Handwoven by skilled artisans, eri silk shawls often feature minimal designs or traditional patterns that reflect simplicity and cultural heritage.",
        "mrp": 9000.0
    },
    {
        "product_name": "Soft Eri Silk with intricate Golden Muga Silk Stole",
        "long_description": "An Eri Muga silk stole is a beautiful fusion of comfort and luxury, combining the best qualities of two traditional Assamese silks. It blends the soft, breathable texture of eri silk with the natural golden sheen of muga silk, creating a unique fabric that feels both rich and easy to wear. Handwoven by skilled artisans, this stole often features subtle traditional motifs and elegant patterns that reflect Assamese heritage. The contrast between the matte finish of eri and the gentle shine of muga adds depth and character to its overall look. Lightweight yet warm, an Eri Muga silk stole is perfect for both casual and festive occasions, offering a refined balance of simplicity, elegance, and cultural charm.",
        "mrp": 11000.0
    },
    {
        "product_name": "Multi Color design Pat Silk Mulberry Silk Bag",
        "long_description": "This mulberry silk bag is a vibrant blend of tradition and contemporary style, crafted from fine mulberry silk that gives it a smooth texture and a natural, elegant sheen. Designed with a mix of lively colors and intricate woven patterns, it reflects the beauty of Assamese craftsmanship. The soft yet durable fabric makes it comfortable to carry, while the artistic detailing adds a unique and eye-catching appeal. Perfect for both casual outings and festive occasions, this bag effortlessly combines utility with cultural charm, making it a stylish and timeless accessory.",
        "mrp": 1200.0
    },
    {
        "product_name": "Creamy Gold Ivory Mulberry Silk Umbrella",
        "long_description": "A mulberry silk umbrella is a unique blend of elegance and craftsmanship, made using fine mulberry silk fabric known for its smooth texture and natural sheen. Often handwoven or carefully crafted, these umbrellas feature rich colors and traditional motifs, giving them a luxurious and artistic appeal. Beyond utility, they are also used as decorative pieces in cultural events, weddings, and traditional ceremonies.",
        "mrp": 17000.0
    },
    {
        "product_name": "Off white Classic Collar EriSilk Waist Coat",
        "long_description": "An eri silk waistcoat is a refined blend of tradition, comfort, and modern style. Made from naturally spun eri silk, it has a soft, slightly textured feel with a subtle matte finish, giving it a sophisticated and understated look. Known for its breathable and warm qualities, eri silk ensures comfort in all seasons, making the waistcoat both practical and elegant. Often handwoven, it may feature minimal patterns or traditional touches that reflect skilled craftsmanship and cultural heritage. Perfect for formal occasions, festive events, or smart casual wear, an eri silk waistcoat adds a graceful and distinctive touch to any outfit while promoting sustainable and eco-friendly fashion.",
        "mrp": 4000.0
    },
    {
        "product_name": "Soft Matte Finish Muga Silk Tie",
        "long_description": "A muga silk tie is a sophisticated accessory that reflects elegance and Assamese heritage. Made from rare muga silk, it features a natural golden sheen and a smooth, rich texture that gives it a distinctive and luxurious appearance. Carefully crafted, the tie may include subtle traditional motifs or minimal patterns, adding a refined touch without being overpowering. Strong and long-lasting, muga silk maintains its beauty and structure over time. Perfect for formal occasions, business wear, or special events, a muga silk tie adds a unique blend of tradition and modern style, making it a standout addition to any wardrobe.",
        "mrp": 4000.0
    },
    {
        "product_name": "Matte Finish Textured Eri Silk Running mtr Fabric",
        "long_description": "Eri silk running fabric is a versatile and eco-friendly textile, known for its soft texture and natural comfort. Made from naturally spun eri silk—often called ahimsa silk—it is produced without harming the silkworm, making it a sustainable and ethical choice. The fabric has a slightly textured feel with a gentle matte finish, offering warmth while remaining breathable and comfortable for all-day wear. As running fabric, it comes in unstitched form, giving you the freedom to design and tailor it into garments like kurtas, blouses, dresses, or curtains and and other household clothes ",
        "mrp": 3000.0
    }
]

async function seedProducts() {
    console.log(`Starting to insert ${productsToInsert.length} products...`);

    let successCount = 0;
    let errorCount = 0;

    for (const product of productsToInsert) {
        try {
            const createdProduct = await prisma.product.create({
                data: {

                    productName: product.product_name,
                    longDesc: product.long_description,
                    maximumRetailPrice: product.mrp,
                    sellingPrice: product.mrp,
                    quantity: 20,
                    paymentType: "COD",

                    masterCategoryId: "492b8e5a-3923-4d3c-9a5f-857ad8815d57",
                    mainImage: "https://images2.minutemediacdn.com/image/upload/c_fill,w_2160,ar_16:9,f_auto,q_auto,g_auto/shape%2Fcover%2Fsport%2F649273-youtube-rick-astley-6b69666394bb6020a913c6fcd18f74be.jpg",

                    isActive: true,
                    hasVariants: false,
                    hasCashOnDelivery: true,
                    isReturn: true,
                    isFeatured: false,
                    isBestSelling: false,
                    isNewCollection: false,
                    isRelatedItem: false,
                }
            });

            console.log(`✅ Successfully inserted: ${createdProduct.productName} (ID: ${createdProduct.id})`);
            successCount++;
        } catch (error) {
            console.error(`❌ Error inserting ${product.product_name}:`, error);
            errorCount++;
        }
    }

    console.log(`\nSeeding finished. ✅ Success: ${successCount} | ❌ Errors: ${errorCount}`);
}

seedProducts()
    .catch((e) => {
        console.error("Fatal error during seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
