import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initializeSiteConfig = async () => {
  try {
    const existingConfig = await prisma.site_config.findFirst();
    if(!existingConfig){
      await prisma.site_config.create({
        data: {
          categories: [
            "Electronics",
            "Fashion",
            "Sports & Fitness",
            "Home & Kitchen",
          ],
          subCategories: {
            "Electronics": ["Mobiles", "Laptops"],
            "Fashion": ["Men", "Women"],
            "Home & Kitchen": ["Furniture", "Appliances", "Decor"],
            "Sports & Fitness": ["Gym Equipments", "Outdoor Sports", "Wearable"],          
          },
        },
      });
    }
  } catch (error) {
    console.error("Error initializing site config: ", error);
  }
}

export default initializeSiteConfig;