var AETHERCP_BUILD_CONFIG = {
  BUILD_MODE: "community"
};

var IS_CLOUD_BUILD = AETHERCP_BUILD_CONFIG.BUILD_MODE === "cloud";

function isCloudBuild() {
  return IS_CLOUD_BUILD;
}
