export const ApiGetServiceWrapper = async ({ url = "", headers = {} }) => {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Frame-Options": "DENY",
        ...headers,
      },
    });

    if (!res.ok) {
      console.error(`HTTP error! Status: ${res.status}`);
      return null;
    }

    return await res.json();   
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const ApiPostServiceWrapper = async ({ url = "", headers = {}, body = null }) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        // For multipart/form-data, do NOT set Content-Type manually
        "X-Frame-Options": "DENY",
        ...headers,
      },
      body: body, 
    });
    if (!res.ok) {
      console.error(`HTTP error! Status: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.log("Fetch error:", error);
    return null;
  }
};

export const ApiPatchServiceWrapper = async ({ url = "", headers = {}, body = null }) => {
  try {
    const res = await fetch(url, {
      method: "PUT",  
      headers: {
        
        "X-Frame-Options": "DENY",
        ...headers,
      },
      body: body, // pass FormData directly, or JSON string if not FormData
    });
    if (!res.ok) {
      console.error(`HTTP error! Status: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.log("Fetch error:", error);
    return null;
  }
};
