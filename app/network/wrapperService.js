export const ApiGetServiceWrapper = async({url="", headers={}})=>{
    try {
        const res = await fetch(url,{
            method:"GET",
            headers:{
                "Content-Type":"application/type",
                "X-Frame-Options":"DENY",
                ...headers,
            },
        });
        if(!res.ok){
            console.error(`HTTP error! Status: ${res.status}`);
            return null;
        }

        return await res.json();
    } catch (error) {
        console.log("Fetch error:", error)
        return null
    }
};

export const ApiPostServiceWrapper = async({url="", headers={}, body={}})=>{
    try {
        const res = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/type",
                "X-Frame-Options":"DENY",
                ...headers,
            },
            body: JSON.stringify({
                ...body,
            }),
        });
        if(!res.ok){
            console.error(`HTTP error! Status: ${res.status}`);
            return null;
        }
        return await res.json();
    } catch (error) {
        console.log("Fetch error:", error)
        return null
    }
};


export const ApiPatchServiceWrapper = async({url="", headers={}, body={}})=>{
    try {
        const res = await fetch(url,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/type",
                "X-Frame-Options":"DENY",
                ...headers,
            },
            body: JSON.stringify({
                ...body,
            }),
        });
        if(!res.ok){
            console.error(`HTTP error! Status: ${res.status}`);
            return null;
        }
        return await res.json();
    } catch (error) {
        console.log("Fetch error:", error)
        return null
    }
};

