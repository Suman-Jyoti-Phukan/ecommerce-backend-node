import { prisma } from "../db/prisma";
import * as fs from "fs";
import * as path from "path";

class StoreBrandingService {
  // Get all branding configurations
  async getAllBranding() {
    return await (prisma as any).storeBranding.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  // Get active branding configuration
  async getActiveBranding() {
    return await (prisma as any).storeBranding.findFirst({
      where: { isActive: true },
    });
  }

  // Get branding by ID
  async getBrandingById(id: string) {
    return await (prisma as any).storeBranding.findUnique({
      where: { id },
    });
  }

  // Create new branding configuration
  async createBranding(data: { displayName: string; isActive?: boolean }) {
    return await (prisma as any).storeBranding.create({
      data: {
        displayName: data.displayName,
        isActive: data.isActive ?? true,
      },
    });
  }

  // Update branding configuration
  async updateBranding(
    id: string,
    data: { displayName?: string; isActive?: boolean },
  ) {
    return await (prisma as any).storeBranding.update({
      where: { id },
      data,
    });
  }

  // Upload logo
  async uploadLogo(id: string, logoPath: string) {
    const branding = await (prisma as any).storeBranding.findUnique({
      where: { id },
    });

    if (!branding) {
      throw new Error("Branding configuration not found");
    }

    // Delete old logo if exists
    if (branding.logoPath) {
      const oldLogoPath = path.join(
        process.cwd(),
        branding.logoPath.replace(/^\//, ""),
      );
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    return await (prisma as any).storeBranding.update({
      where: { id },
      data: { logoPath },
    });
  }

  // Upload banners
  async uploadBanners(id: string, bannerPaths: string[]) {
    const branding = await (prisma as any).storeBranding.findUnique({
      where: { id },
    });

    if (!branding) {
      throw new Error("Branding configuration not found");
    }

    // Combine existing and new banners
    const existingBanners = branding.bannerImages
      ? JSON.parse(JSON.stringify(branding.bannerImages))
      : [];
    const allBanners = [...existingBanners, ...bannerPaths];

    // Limit to 10 banners
    const finalBanners = allBanners.slice(0, 10);

    return await (prisma as any).storeBranding.update({
      where: { id },
      data: { bannerImages: finalBanners },
    });
  }

  // Delete specific banner by index
  async deleteBanner(id: string, index: number) {
    const branding = await (prisma as any).storeBranding.findUnique({
      where: { id },
    });

    if (!branding) {
      throw new Error("Branding configuration not found");
    }

    const banners = branding.bannerImages
      ? JSON.parse(JSON.stringify(branding.bannerImages))
      : [];

    if (index < 0 || index >= banners.length) {
      throw new Error("Invalid banner index");
    }

    // Delete the file
    const bannerToDelete = banners[index];
    const bannerFilePath = path.join(
      process.cwd(),
      bannerToDelete.replace(/^\//, ""),
    );
    if (fs.existsSync(bannerFilePath)) {
      fs.unlinkSync(bannerFilePath);
    }

    // Remove from array
    banners.splice(index, 1);

    return await (prisma as any).storeBranding.update({
      where: { id },
      data: { bannerImages: banners },
    });
  }

  // Delete branding configuration
  async deleteBranding(id: string) {
    const branding = await (prisma as any).storeBranding.findUnique({
      where: { id },
    });

    if (!branding) {
      throw new Error("Branding configuration not found");
    }

    // Delete logo if exists
    if (branding.logoPath) {
      const logoPath = path.join(
        process.cwd(),
        branding.logoPath.replace(/^\//, ""),
      );
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    // Delete banners if exist
    if (branding.bannerImages) {
      const banners = JSON.parse(JSON.stringify(branding.bannerImages));
      banners.forEach((banner: string) => {
        const bannerPath = path.join(process.cwd(), banner.replace(/^\//, ""));
        if (fs.existsSync(bannerPath)) {
          fs.unlinkSync(bannerPath);
        }
      });
    }

    return await (prisma as any).storeBranding.delete({
      where: { id },
    });
  }


  async toggleStatus(id: string) {
    const branding = await (prisma as any).storeBranding.findUnique({
      where: { id },
    });

    if (!branding) {
      throw new Error("Branding configuration not found");
    }

    return await (prisma as any).storeBranding.update({
      where: { id },
      data: { isActive: !branding.isActive },
    });
  }
}

export default new StoreBrandingService();
