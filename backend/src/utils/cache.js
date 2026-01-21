// Implementing in memory caching first redis later when scaling

const cache=new Map();

export const getCache=(key)=>{
    const data=cache.get(key);
    if(!data)return null;
    
    // Getting expiry
    if(Date.now()>data.expiry){
        cache.delete(key);
        return null;
    }

    return data.value;
}


export const setCache=(key,value,ttl=60)=>{
    cache.set(key,{
        value,
        expiry:Date.now()+ttl*1000,
    });

}


export const deleteCache=(prefix)=>{
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}