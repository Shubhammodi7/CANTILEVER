export const deleteData = async (endpoint) => {
  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || response.statusText);
    }

    return true;
  } catch (err) {
    console.error("Delete Action Failed:", err);
    return false;
  }
};
