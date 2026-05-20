const DEBUG_ENABLED = true;

function logDebug(area, message, data) {
  if (!DEBUG_ENABLED) return;

  const prefix = `[AetherCP:${area}]`;

  if (data === undefined) {
    console.log(prefix, message);
    return;
  }

  console.log(prefix, message, data);
}

function logWarning(area, message, data) {
  const prefix = `[AetherCP:${area}]`;

  if (data === undefined) {
    console.warn(prefix, message);
    return;
  }

  console.warn(prefix, message, data);
}
