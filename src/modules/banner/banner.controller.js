const bannerService = require("@/modules/banner/banner.service");
const { HTTP_STATUS } = require("@/shared/config/constant.config");
const ApiResponse = require("@/shared/utils/apiResponse.utils");
const asyncHandler = require("@/shared/utils/asyncHandeler.utils");
const {
  getCache,
  setCache,
  bumpNsVersion,
  buildCacheKey,
} = require("@/shared/utils/cache.util");

class BannerController {
  // ── Create ──────────────────────────────────────────────────────────────────
  createBanner = asyncHandler(async (req, res, next) => {
    const data = {
      ...req.validatedData,
      createdBy: req?.user?._id || null,
      updatedBy: req?.user?._id || null,
    };

    const result = await bannerService.createBanner(data);
    
    // Invalidate banner cache
    await bumpNsVersion("banner");
    
    ApiResponse.success(
      res,
      HTTP_STATUS.CREATED,
      "Banner created successfully",
      result,
    );
  });

  // ── Read ─────────────────────────────────────────────────────────────────────
  getBanners = asyncHandler(async (req, res, next) => {
    const query = req.query || {};
    
    const suffix = JSON.stringify({ query });
    const cacheKey = await buildCacheKey("banner", suffix);
    
    // Attempt cache retrieval
    const cachedBanners = await getCache(cacheKey);
    if (cachedBanners) {
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        "Banners fetched from cache",
        cachedBanners,
      );
    }
    
    const result = await bannerService.getBanners(query);
    
    // Cache the result for 300 seconds
    await setCache(cacheKey, result, 300);
    
    ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      "Banners fetched successfully",
      result,
    );
  });

  /** get single banner */
  getBannerById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    
    const cacheKey = await buildCacheKey("banner", `single:${id}`);
    
    // Attempt cache retrieval
    const cachedBanner = await getCache(cacheKey);
    if (cachedBanner) {
      return ApiResponse.success(
        res,
        HTTP_STATUS.OK,
        "Banner fetched from cache",
        cachedBanner,
      );
    }
    
    const result = await bannerService.getBannerById(id);
    
    // Cache for 300 seconds
    await setCache(cacheKey, result, 300);
    
    ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      "Banner fetched successfully",
      result,
    );
  });

  // ── Update ──────────────────────────────────────────────────────────────────
  updateBanner = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const data = {
      ...req.validatedData,
      updatedBy: req?.user?._id || null,
    };

    const result = await bannerService.updateBanner(id, data);
    
    // Invalidate banner cache
    await bumpNsVersion("banner");
    
    ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      "Banner updated successfully",
      result,
    );
  });

  // ── Delete ──────────────────────────────────────────────────────────────────
  deleteBanner = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const result = await bannerService.deleteBanner(id);
    
    // Invalidate banner cache
    await bumpNsVersion("banner");
    
    ApiResponse.success(
      res,
      HTTP_STATUS.OK,
      "Banner deleted successfully",
      result,
    );
  });
}

module.exports = new BannerController();
